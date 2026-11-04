// (dia 17) src/models/product.model.ts
import pool from '../config/db.js';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
  // Especificamos <Product> en el query
  // const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
     const result = await pool.query<Product>('SELECT * FROM products ORDER BY id ASC');
  return result.rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  // const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
     const result = await pool.query<Product>('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0]! : null;
};

export const insertProduct = async (name: string, description: string, price: number): Promise<Product> => {
  const result = await pool.query(
    'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
    [name, description, price]
  );
  return result.rows[0];
};

export const updateProduct = async (id: number, name: string, description: string, price: number): Promise<Product | null> => {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
    [name, description, price, id]
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
