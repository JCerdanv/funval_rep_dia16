// (dia 19) src/models/customer.model.ts
import pool from "../config/db.js";

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone_number?: string | null;
}

// Obtener todos los clientes
// export const getAllCustomers = async (): Promise<Customer[]> => {
//  const result = await pool.query<Customer>("SELECT * FROM customers ORDER BY id ASC");
//  return result.rows;
// };
//

// Obtener clientes con filtros opcionales de nombre y límites de registros
export const getAllCustomers = async (
  name?: string,
  limit?: number
): Promise<Customer[]> => {
  // Base de la consulta SQL
  let queryText = "SELECT * FROM customers WHERE 1=1";
  const queryParams: any[] = [];

  // Si viene el parámetro name, añadimos un filtro insensible a mayúsculas/minúsculas (ILIKE)
  if (name) {
    queryParams.push(`%${name}%`);
    queryText += ` AND name ILIKE $${queryParams.length}`; // Usa $1
  }

  // Ordenamos siempre por ID de forma consistente
  queryText += " ORDER BY id ASC";

  // Si viene el parámetro limit, lo añadimos de manera parametrizada
  if (limit) {
    queryParams.push(limit);
    queryText += ` LIMIT $${queryParams.length}`; // Usa $2 (o $1 si no hubo nombre)
  }

  // Ejecución final segura en el Pool
  const result = await pool.query<Customer>(queryText, queryParams);
  return result.rows;
};

// Obtener un cliente por su ID
export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const result = await pool.query<Customer>("SELECT * FROM customers WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0]! : null;
};

// Insertar un nuevo cliente (Consultas Parametrizadas Seguras)
export const insertCustomer = async (
  name: string, email: string, phone_number?: string | null
): Promise<Customer> => {
  const result = await pool.query<Customer>(
    "INSERT INTO customers (name, email, phone_number) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phone_number || null]
  );
  return result.rows[0]!;
};

// Actualizar un cliente existente
export const updateCustomer = async (
  id: number,
  name: string,
  email: string,
  phone_number?: string | null
): Promise<Customer | null> => {
  const result = await pool.query<Customer>(
    "UPDATE customers SET name = $1, email = $2, phone_number = $3 WHERE id = $4 RETURNING *",
    [name, email, phone_number || null, id]
  );
  return result.rows.length > 0 ? result.rows[0]! : null;
};

// Eliminar un cliente por su ID
export const deleteCustomer = async (id: number): Promise<Customer | null> => {
  const result = await pool.query(
    'DELETE FROM customers WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

// fin - src/models/customer.model.ts
