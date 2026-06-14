import { Injectable } from '@angular/core';
import { Usuario, UsuarioSesion, Producto, CarritoItem, Orden } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEYS = {
    users: 'usuariosLaJuegueria',
    session: 'sesionLaJuegueria',
    inventory: 'inventarioLaJuegueria',
    history: 'historialLaJuegueria'
  };

  private readJson<T>(storage: Storage, key: string, fallback: T): T {
    try {
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      const value = JSON.parse(raw) as T;
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  private writeJson<T>(storage: Storage, key: string, value: T): void {
    storage.setItem(key, JSON.stringify(value));
  }

  // ─── Usuarios ───────────────────────────────────────────────────────────────

  getUsers(): Usuario[] {
    const users = this.readJson<unknown>(localStorage, this.KEYS.users, []);
    return Array.isArray(users) ? (users as Usuario[]) : [];
  }

  saveUsers(users: Usuario[]): void {
    this.writeJson(localStorage, this.KEYS.users, users);
  }

  upsertUser(user: Usuario): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.usuario === user.usuario);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
  }

  findUserByCredentials(identifier: string, password: string): Usuario | null {
    return (
      this.getUsers().find(
        u =>
          (u.usuario === identifier || u.correo === identifier) &&
          u.contrasena === password
      ) ?? null
    );
  }

  findUserByUsername(username: string): Usuario | null {
    return this.getUsers().find(u => u.usuario === username) ?? null;
  }

  findUserByEmail(email: string): Usuario | null {
    const normalized = email.trim().toLowerCase();
    return (
      this.getUsers().find(
        u => (u.correo ?? '').trim().toLowerCase() === normalized
      ) ?? null
    );
  }

  // ─── Sesión ─────────────────────────────────────────────────────────────────

  getSession(): UsuarioSesion | null {
    return this.readJson<UsuarioSesion | null>(
      sessionStorage,
      this.KEYS.session,
      null
    );
  }

  setSession(data: UsuarioSesion): void {
    this.writeJson(sessionStorage, this.KEYS.session, data);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.KEYS.session);
  }

  // ─── Inventario ─────────────────────────────────────────────────────────────

  getInventory(): Producto[] {
    const items = this.readJson<unknown>(localStorage, this.KEYS.inventory, []);
    return Array.isArray(items) ? (items as Producto[]) : [];
  }

  saveInventory(items: Producto[]): void {
    this.writeJson(localStorage, this.KEYS.inventory, items);
  }

  /** Si el inventario está vacío, lo semilla con los productos del catálogo. */
  ensureInventorySeed(catalogProducts: Producto[]): void {
    if (this.getInventory().length === 0) {
      this.saveInventory(catalogProducts);
    }
  }

  // ─── Carrito ─────────────────────────────────────────────────────────────────

  private getCartKey(owner: string): string {
    return `carritoLaJuegueria_${owner}`;
  }

  getCart(owner: string): CarritoItem[] {
    const items = this.readJson<unknown>(
      localStorage,
      this.getCartKey(owner),
      []
    );
    return Array.isArray(items) ? (items as CarritoItem[]) : [];
  }

  saveCart(owner: string, items: CarritoItem[]): void {
    this.writeJson(localStorage, this.getCartKey(owner), items);
  }

  clearCart(owner: string): void {
    localStorage.removeItem(this.getCartKey(owner));
  }

  // ─── Historial ───────────────────────────────────────────────────────────────

  private getHistory(): Record<string, Orden[]> {
    return this.readJson<Record<string, Orden[]>>(
      localStorage,
      this.KEYS.history,
      {}
    );
  }

  addOrder(username: string, order: Orden): void {
    const history = this.getHistory();
    if (!Array.isArray(history[username])) {
      history[username] = [];
    }
    history[username].push(order);
    this.writeJson(localStorage, this.KEYS.history, history);
  }

  getOrders(username: string): Orden[] {
    const history = this.getHistory();
    return Array.isArray(history[username]) ? history[username] : [];
  }
}
