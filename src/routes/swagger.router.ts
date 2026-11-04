// src/routes/swagger.router.ts
import swaggerUi from 'swagger-ui-express'; 
import { Router } from 'express';

//import swaggerDoc from '../../swagger-output.json' with {type: 'json'}

import { readFileSync } from 'fs';
import { join } from 'path';

// Lee y parsea el archivo JSON manualmente
const swaggerDoc = JSON.parse(
  readFileSync(join(process.cwd(), 'swagger-output.json'), 'utf8')
);

export const swaggerRouter: Router = Router();

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default swaggerRouter;
// fin - src/routes/swagger.router.ts