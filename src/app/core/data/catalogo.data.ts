import { Producto } from '../models/models';

export interface Categoria {
  slug: string;
  nombre: string;
  imagen: string;
  siguiente: string;
  anterior: string;
}

export const PRODUCTOS: Producto[] = [
  // ─── Estrategia ─────────────────────────────────────────────────────────────
  {
    id: 'torres-del-reino',
    nombre: 'Torres del Reino',
    descripcion: 'Construye fortalezas y administra recursos para conquistar territorios.',
    precio: 24990,
    etiqueta: 'Descuento: Sí, 10%',
    imagen: 'assets/img/juego-estrategia.svg',
    categoria: 'estrategia',
    stock: 10
  },
  {
    id: 'ruta-imperial',
    nombre: 'Ruta Imperial',
    descripcion: 'Compite por rutas comerciales y domina el mapa con táctica avanzada.',
    precio: 29990,
    etiqueta: 'Descuento: No',
    imagen: 'assets/img/juego-estrategia.svg',
    categoria: 'estrategia',
    stock: 10
  },
  {
    id: 'asamblea-de-clanes',
    nombre: 'Asamblea de Clanes',
    descripcion: 'Negocia alianzas, cumple objetivos secretos y asegura tu victoria.',
    precio: 22490,
    etiqueta: 'Descuento: Sí, 15%',
    imagen: 'assets/img/juego-estrategia.svg',
    categoria: 'estrategia',
    stock: 10
  },
  // ─── Familiares ──────────────────────────────────────────────────────────────
  {
    id: 'tarde-de-parque',
    nombre: 'Tarde de Parque',
    descripcion: 'Juego cooperativo donde todos trabajan juntos para completar retos.',
    precio: 18990,
    etiqueta: 'Descuento: No',
    imagen: 'assets/img/juego-familiares.svg',
    categoria: 'familiares',
    stock: 10
  },
  {
    id: 'aventuras-en-casa',
    nombre: 'Aventuras en Casa',
    descripcion: 'Ideal para compartir en familia con reglas simples y partidas rápidas.',
    precio: 16490,
    etiqueta: 'Descuento: Sí, 5%',
    imagen: 'assets/img/juego-familiares.svg',
    categoria: 'familiares',
    stock: 10
  },
  {
    id: 'risas-y-dados',
    nombre: 'Risas y Dados',
    descripcion: 'Gana puntos superando pruebas de creatividad y memoria en equipo.',
    precio: 19990,
    etiqueta: 'Descuento: Sí, 12%',
    imagen: 'assets/img/juego-familiares.svg',
    categoria: 'familiares',
    stock: 10
  },
  // ─── Infantiles ──────────────────────────────────────────────────────────────
  {
    id: 'islas-de-colores',
    nombre: 'Islas de Colores',
    descripcion: 'Los niños aprenden patrones y colores mientras exploran islas mágicas.',
    precio: 12990,
    etiqueta: 'Descuento: Sí, 20%',
    imagen: 'assets/img/juego-infantiles.svg',
    categoria: 'infantiles',
    stock: 10
  },
  {
    id: 'safari-mini',
    nombre: 'Safari Mini',
    descripcion: 'Encuentra animales en el tablero y desarrolla habilidades de atención.',
    precio: 10990,
    etiqueta: 'Descuento: No',
    imagen: 'assets/img/juego-infantiles.svg',
    categoria: 'infantiles',
    stock: 10
  },
  {
    id: 'carrera-de-nubes',
    nombre: 'Carrera de Nubes',
    descripcion: 'Una carrera amistosa que fomenta turnos y resolución de problemas.',
    precio: 11490,
    etiqueta: 'Descuento: Sí, 8%',
    imagen: 'assets/img/juego-infantiles.svg',
    categoria: 'infantiles',
    stock: 10
  },
  // ─── Fiesta ──────────────────────────────────────────────────────────────────
  {
    id: 'mimica-total',
    nombre: 'Mímica Total',
    descripcion: 'Actúa conceptos divertidos y gana con tu equipo en rondas rápidas.',
    precio: 14990,
    etiqueta: 'Descuento: No',
    imagen: 'assets/img/juego-fiesta.svg',
    categoria: 'fiesta',
    stock: 10
  },
  {
    id: 'palabra-prohibida',
    nombre: 'Palabra Prohibida',
    descripcion: 'Describe sin usar palabras clave y desafía tu creatividad grupal.',
    precio: 15990,
    etiqueta: 'Descuento: Sí, 10%',
    imagen: 'assets/img/juego-fiesta.svg',
    categoria: 'fiesta',
    stock: 10
  },
  {
    id: 'desafio-flash',
    nombre: 'Desafío Flash',
    descripcion: 'Retos express de lógica y rapidez para romper el hielo en reuniones.',
    precio: 13490,
    etiqueta: 'Descuento: Sí, 7%',
    imagen: 'assets/img/juego-fiesta.svg',
    categoria: 'fiesta',
    stock: 10
  }
];

export const CATEGORIAS: Categoria[] = [
  {
    slug: 'estrategia',
    nombre: 'Estrategia',
    imagen: 'assets/img/categoria-estrategia.svg',
    siguiente: 'familiares',
    anterior: 'fiesta'
  },
  {
    slug: 'familiares',
    nombre: 'Familiares',
    imagen: 'assets/img/categoria-familiares.svg',
    siguiente: 'infantiles',
    anterior: 'estrategia'
  },
  {
    slug: 'infantiles',
    nombre: 'Infantiles',
    imagen: 'assets/img/categoria-infantiles.svg',
    siguiente: 'fiesta',
    anterior: 'familiares'
  },
  {
    slug: 'fiesta',
    nombre: 'Fiesta',
    imagen: 'assets/img/categoria-fiesta.svg',
    siguiente: 'estrategia',
    anterior: 'infantiles'
  }
];

/** IDs de productos que aparecen en la sección de destacados */
export const IDS_DESTACADOS = ['torres-del-reino', 'aventuras-en-casa', 'palabra-prohibida'];

/** Etiqueta especial para cada destacado */
export const ETIQUETAS_DESTACADOS: Record<string, string> = {
  'torres-del-reino': 'Destacado semanal',
  'aventuras-en-casa': 'Favorito familiar',
  'palabra-prohibida': 'Top en fiestas'
};
