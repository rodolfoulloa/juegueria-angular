export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  etiqueta: string;
  imagen: string;
  categoria: string;
  stock: number;
}

export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  contrasena: string;
  direccion?: string;
  rol: 'cliente' | 'administrador';
}

export interface UsuarioSesion {
  nombre: string;
  usuario: string;
  correo: string;
  direccion: string;
  rol: 'cliente' | 'administrador';
}

export interface CarritoItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Orden {
  id: string;
  fecha: string;
  total: number;
  items: CarritoItem[];
}
