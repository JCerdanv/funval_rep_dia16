// (dia 16) src/config/db.ts
//
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env
dotenv.config();

// Configuración del Pool de conexiones
// port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Función para verificar la conexión a la base de datos
export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('> Conexión a la base de datos establecida.');
    client.release(); 
  } catch (error) {
    console.error('> Error crítico: No se pudo conectar a la base de datos.');
    if (error instanceof Error) {
      console.error(`> Detalle del error: ${error.message}`);
    }
    // BORRADO: no usamos process.exit(1); para que el servidor Express no se muera.
  }
};

// Manejo de errores inesperados en conexiones inactivas/vivas
pool.on('error', (err) => {
  console.error('> Error inesperado en un cliente inactivo del pool:', err.message);
});

export default pool;

// fin - archivo src/config/db.ts