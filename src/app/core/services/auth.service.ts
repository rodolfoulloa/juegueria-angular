import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Usuario, UsuarioSesion } from '../models/models';

const ADMIN_FIJO: Usuario = {
  nombre: 'Administrador La Jueguería',
  usuario: 'admin',
  correo: 'admin@lajuegueria.cl',
  contrasena: 'admin123',
  direccion: 'Casa matriz',
  rol: 'administrador'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  private _currentUser = signal<UsuarioSesion | null>(null);

  /** Usuario de sesión actual (solo lectura). */
  readonly currentUser = this._currentUser.asReadonly();

  /** true si hay sesión activa. */
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  /** true si el usuario tiene rol administrador. */
  readonly isAdmin = computed(() => this._currentUser()?.rol === 'administrador');

  constructor() {
    this._currentUser.set(this.storage.getSession());
    this.ensureAdminUser();
  }

  private sanitizeSession(user: Usuario): UsuarioSesion {
    return {
      nombre: user.nombre,
      usuario: user.usuario,
      correo: user.correo,
      direccion: user.direccion ?? '',
      rol: user.rol ?? 'cliente'
    };
  }

  private ensureAdminUser(): void {
    const admin = this.storage.findUserByUsername(ADMIN_FIJO.usuario);
    if (!admin) {
      this.storage.upsertUser(ADMIN_FIJO);
    } else if (admin.rol !== 'administrador') {
      admin.rol = 'administrador';
      admin.contrasena = ADMIN_FIJO.contrasena;
      this.storage.upsertUser(admin);
    }
  }

  login(identifier: string, password: string): { ok: boolean; message?: string } {
    this.ensureAdminUser();
    const user = this.storage.findUserByCredentials(identifier.trim(), password);
    if (!user) {
      return { ok: false, message: 'Credenciales inválidas. Intenta nuevamente.' };
    }
    const session = this.sanitizeSession(user);
    this.storage.setSession(session);
    this._currentUser.set(session);
    return { ok: true };
  }

  logout(): void {
    this.storage.clearSession();
    this._currentUser.set(null);
  }

  updateProfile(data: {
    nombre: string;
    correo: string;
    direccion: string;
    contrasena?: string;
  }): { ok: boolean; message?: string } {
    const currentUser = this._currentUser();
    if (!currentUser) {
      return { ok: false, message: 'No hay una sesión activa.' };
    }
    const user = this.storage.findUserByUsername(currentUser.usuario);
    if (!user) {
      return { ok: false, message: 'No fue posible encontrar el usuario actual.' };
    }
    const updated: Usuario = {
      nombre: data.nombre,
      usuario: user.usuario,
      correo: data.correo,
      contrasena: data.contrasena || user.contrasena,
      direccion: data.direccion,
      rol: user.rol ?? currentUser.rol ?? 'cliente'
    };
    this.storage.upsertUser(updated);
    const session = this.sanitizeSession(updated);
    this.storage.setSession(session);
    this._currentUser.set(session);
    return { ok: true };
  }
}
