// archivo src/libs/swagger.lib.ts Swagger Documentation Generation Script
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API El Rincón del Sabor", // Corregido el contexto del proyecto
    description: "Documentación automática de la API de productos para el restaurante",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index.ts"]; // Lee desde el punto de entrada raíz

swaggerAutogen()(outputFile, endpointsFiles, doc);

// fin - archivo src/libs/swagger.lib.ts
