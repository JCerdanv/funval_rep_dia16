// (dia 17 - 18 - 19) src/models/product.model.ts
import pool from '../config/db.js';

// import { Product } from "./product.model.js"; // Asegura importar tu interfaz de producto

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  cost: number; // Corregido: NUMERIC(10, 2) cambiado a number
  stock: number;
  eliminado: boolean;
}

export const getAllProducts = async (name?: string, limit?: number): Promise<Product[]> => {
  // Base segura de la consulta SQL
  let queryText = "SELECT * FROM products WHERE 1=1";
  const queryParams: any[] = [];

  // Filtro por nombre dinámico e insensible a mayúsculas/minúsculas (ILIKE)
  if (name) {
    queryParams.push(`%${name}%`);
    queryText += ` AND name ILIKE $${queryParams.length}`; // Asigna $1
  }

  queryText += " ORDER BY id ASC";

  // Límite de registros dinámico
  if (limit) {
    queryParams.push(limit);
    queryText += ` LIMIT $${queryParams.length}`; // Asigna $2 (o $1 si no hubo filtro de nombre)
  }

  const result = await pool.query<Product>(queryText, queryParams);
  return result.rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  // const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  const result = await pool.query<Product>('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0]! : null;
};

export const insertProduct = async (name: string, description: string,
  price: number, cost: number, stock: number, eliminado: boolean): 
  Promise<Product> => {
  const result = await pool.query(
    'INSERT INTO products (name, description, price, cost, stock, eliminado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, cost, stock, eliminado ]
  );
  return result.rows[0];
};

export const updateProduct = async (id: number, name: string, description: string, 
  price: number, cost: number, stock: number, eliminado: boolean
): Promise<Product | null> => {
  const result = await pool.query(
  'UPDATE products SET name = $1, description = $2, price = $3, cost = $4, stock = $5, eliminado = $6 WHERE id = $7 RETURNING *',
  [name, description, price, cost, stock, eliminado, id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const deleteProduct = async (id: number): Promise<Product | null> => {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

// fin - src/models/product.model.ts