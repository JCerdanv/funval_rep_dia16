// (dia 16 entregable) index.ts
import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors"
import pool from "./config/db.js"; // Importa el pool creado

const port = process.env.PORT || 3000; 
const app = express();

// Middlewares 
app.use(express.json());
app.use(cors())

app.use("/api/docs", swaggerRouter) 

// Endpoint base de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

// 4. Crea el endpoint GET /api/menu
app.get("/api/menu", async (req: Request, res: Response) => {
  /*#swagger.tags = ['Menu']*/
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const startServer = async () => {
  try {
    // Validar la conexión realizando una consulta simple de prueba
    await pool.query("SELECT NOW()");
    console.log("Conexión a la base de datos establecida.");

    app.listen(port, () => {
      console.log(`Server corriendo en URL: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
// fin - archivo index.ts