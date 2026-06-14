import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { CarritoItem, Producto, Orden } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storage = inject(StorageService);
  private auth = inject(AuthService);

  private _cart = signal<CarritoItem[]>([]);
  private _lastOrder = signal<Orden | null>(null);

  /** Ítems del carrito (solo lectura). */
  readonly cart = this._cart.asReadonly();

  /** Último pedido confirmado (para la página de confirmación). */
  readonly lastOrder = this._lastOrder.asReadonly();

  /** Cantidad total de ítems en el carrito. */
  readonly itemCount = computed(() =>
    this._cart().reduce((sum, item) => sum + item.cantidad, 0)
  );

  /** Monto total del carrito. */
  readonly total = computed(() =>
    this._cart().reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  );

  /** Propietario del carrito: usuario logueado o "visitante". */
  private get owner(): string {
    return this.auth.currentUser()?.usuario ?? 'visitante';
  }

  constructor() {
    this.loadCart();
  }

  /** Recarga el carrito desde localStorage según el propietario actual. */
  loadCart(): void {
    this._cart.set(this.storage.getCart(this.owner));
  }

  /** Agrega un producto al carrito o incrementa su cantidad si ya existe. */
  addProduct(product: Producto): void {
    const cart = this._cart().map(i => ({ ...i }));
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.cantidad += 1;
    } else {
      cart.push({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: 1 });
    }
    this._cart.set(cart);
    this.storage.saveCart(this.owner, cart);
  }

  /** Incrementa la cantidad de un ítem. */
  increment(productId: string): void {
    this.changeQuantity(productId, 1);
  }

  /** Decrementa la cantidad de un ítem; lo elimina si llega a 0. */
  decrement(productId: string): void {
    this.changeQuantity(productId, -1);
  }

  /** Elimina un ítem del carrito. */
  remove(productId: string): void {
    const cart = this._cart().filter(i => i.id !== productId);
    this._cart.set(cart);
    this.storage.saveCart(this.owner, cart);
  }

  private changeQuantity(productId: string, delta: number): void {
    const cart = this._cart()
      .map(i => (i.id === productId ? { ...i, cantidad: i.cantidad + delta } : { ...i }))
      .filter(i => i.cantidad > 0);
    this._cart.set(cart);
    this.storage.saveCart(this.owner, cart);
  }

  /**
   * Fusiona el carrito del visitante al carrito del usuario recién logueado.
   * Llamar después de un login exitoso.
   */
  mergeGuestCart(username: string): void {
    const guestCart = this.storage.getCart('visitante');
    if (!guestCart.length) {
      this.loadCart();
      return;
    }
    const userCart = this.storage.getCart(username);
    for (const guestItem of guestCart) {
      const existing = userCart.find(u => u.id === guestItem.id);
      if (existing) {
        existing.cantidad += guestItem.cantidad;
      } else {
        userCart.push({ ...guestItem });
      }
    }
    this.storage.saveCart(username, userCart);
    this.storage.clearCart('visitante');
    this._cart.set(userCart);
  }

  /**
   * Simula una compra: guarda la orden en el historial y vacía el carrito.
   * Retorna la orden generada o null si el carrito está vacío o no hay sesión.
   */
  buy(): Orden | null {
    const currentUser = this.auth.currentUser();
    if (!currentUser) return null;

    const cart = this._cart();
    if (!cart.length) return null;

    const order: Orden = {
      id: `ORD-${Date.now()}`,
      fecha: new Date().toLocaleString('es-CL'),
      total: this.total(),
      items: cart
    };

    this.storage.addOrder(currentUser.usuario, order);
    this.storage.clearCart(currentUser.usuario);
    this._cart.set([]);
    this._lastOrder.set(order);
    return order;
  }
}
