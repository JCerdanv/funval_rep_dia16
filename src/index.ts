// (dia 16 - 17 - 18 - 19 entregable) index.ts
import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";

import productosRouter from "./routes/product.routes.js"; // (dia 17) Importamos router MVC productos
import clientesRouter from "./routes/customer.routes.js"; // (dia 19) Importamos enrutador clientes

import cors from "cors"
import pool from "./config/db.js"; // Importa el pool creado

const port = process.env.PORT || 3000; 
const app = express();

// Middlewares 
app.use(express.json());
app.use(cors());

// Rutas de documentación y API
app.use("/api/docs", swaggerRouter);
app.use("/api", productosRouter); // (dia 17) Rutas estructuradas con prefijo /api
app.use("/api", clientesRouter); // (dia 19) Rutas clientes con prefijo /api


// Endpoint base de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online", version: "1.0.0"
    });
});

const startServer = async () => {
  try {
    // Validar la conexión realizando una consulta simple de prueba
    await pool.query("SELECT NOW()");
    console.log("Conexión a la base de datos establecida.");

    app.listen(port, () => {
      console.log(`Server El Rincon del Sabor (dia 19) URL: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
// fin - archivo index.ts