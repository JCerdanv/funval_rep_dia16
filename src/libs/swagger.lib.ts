// archivo src/libs/swagger.lib.ts Swagger Documentation Generation Script
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Estudiantes',
        description: 'Documentación automática generada para el bootcamp',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = 'swagger-output.json';

const endpointsFiles = ['./src/index.ts'];

// swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
//    await import('../index.js');
// });

// Eliminamos el .then(async () => { await import('../index.js'); })
swaggerAutogen()(outputFile, endpointsFiles, doc);

// fin - archivo src/libs/swagger.lib.ts
