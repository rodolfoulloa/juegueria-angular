import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { Producto, UsuarioSesion } from '../models/models';

describe('CartService', () => {
  let service: CartService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  const product: Producto = {
    id: 'torres-del-reino',
    nombre: 'Torres del Reino',
    descripcion: 'Prueba',
    precio: 24990,
    etiqueta: 'Descuento: Sí, 10%',
    imagen: 'assets/img/juego-estrategia.svg',
    categoria: 'estrategia',
    stock: 10
  };

  beforeEach(() => {
    const storage = jasmine.createSpyObj('StorageService', [
      'getCart',
      'saveCart',
      'clearCart'
    ]);
    const auth = jasmine.createSpyObj('AuthService', ['currentUser']);

    storage.getCart.and.returnValue([]);
    auth.currentUser.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: StorageService, useValue: storage },
        { provide: AuthService, useValue: auth }
      ]
    });

    service = TestBed.inject(CartService);
    storageSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add a product and update quantity and total correctly', () => {
    service.addProduct(product);
    service.addProduct(product);

    expect(service.cart()).toEqual([
      { id: 'torres-del-reino', nombre: 'Torres del Reino', precio: 24990, cantidad: 2 }
    ]);
    expect(service.itemCount()).toBe(2);
    expect(service.total()).toBe(49980);
    expect(storageSpy.saveCart).toHaveBeenCalledWith('visitante', [
      { id: 'torres-del-reino', nombre: 'Torres del Reino', precio: 24990, cantidad: 2 }
    ]);
  });

  it('should merge guest cart into user cart when a user logs in', () => {
    authSpy.currentUser.and.returnValue({
      nombre: 'Cliente',
      usuario: 'cliente1',
      correo: 'cliente@ejemplo.com',
      direccion: '',
      rol: 'cliente'
    } as UsuarioSesion);

    storageSpy.getCart.withArgs('visitante').and.returnValue([
      { id: 'torres-del-reino', nombre: 'Torres del Reino', precio: 24990, cantidad: 1 }
    ]);
    storageSpy.getCart.withArgs('cliente1').and.returnValue([
      { id: 'aventuras-en-casa', nombre: 'Aventuras en Casa', precio: 16490, cantidad: 2 }
    ]);

    service.mergeGuestCart('cliente1');

    expect(storageSpy.saveCart).toHaveBeenCalledWith('cliente1', [
      { id: 'aventuras-en-casa', nombre: 'Aventuras en Casa', precio: 16490, cantidad: 2 },
      { id: 'torres-del-reino', nombre: 'Torres del Reino', precio: 24990, cantidad: 1 }
    ]);
    expect(storageSpy.clearCart).toHaveBeenCalledWith('visitante');
    expect(service.cart()).toEqual([
      { id: 'aventuras-en-casa', nombre: 'Aventuras en Casa', precio: 16490, cantidad: 2 },
      { id: 'torres-del-reino', nombre: 'Torres del Reino', precio: 24990, cantidad: 1 }
    ]);
  });
});
