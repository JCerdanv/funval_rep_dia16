// (dia 16 - 17 - 18 entregable) index.ts
import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";

import productosRouter from "./routes/product.routes.js"; // (dia 17) Importamos el router MVC de productos

import cors from "cors"
import pool from "./config/db.js"; // Importa el pool creado

const port = process.env.PORT || 3000; 
const app = express();

// Middlewares 
app.use(express.json());
app.use(cors());

// Rutas de documentación y API
app.use("/api/docs", swaggerRouter);
app.use("/api", productosRouter); // (dia 17) Montamos las rutas estructuradas bajo el prefijo /api


// Endpoint base de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

// (dia17) Eliminado app.get("/api/menu") ahora product.controller.ts

// 4. Crea el endpoint GET /api/menu
// app.get("/api/menu", async (req: Request, res: Response) => {
//   /*#swagger.tags = ['Menu']*/
//   try {
//     const result = await pool.query("SELECT * FROM products");
//     res.json(result.rows);
//   } catch (error) {
//    console.error("Error al obtener el menú:", error);
//    res.status(500).json({ error: "Error interno del servidor" });
//  }
// });

const startServer = async () => {
  try {
    // Validar la conexión realizando una consulta simple de prueba
    await pool.query("SELECT NOW()");
    console.log("Conexión a la base de datos establecida.");

    app.listen(port, () => {
      console.log(`Server El Rincon del Sabor (dia 18) URL: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
// fin - archivo index.ts