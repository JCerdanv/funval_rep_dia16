// (dia 17) src/routes/product.routes.ts
import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
// Importar el middleware
import { validateProduct } from '../middlewares/validate-product.js'; 

const router: ReturnType<typeof Router> = Router();

router.get('/menu', productController.getMenu);
router.get('/menu/:id', productController.getProduct);
// router.post('/menu', productController.createProduct);
// router.put('/menu/:id', productController.updateProduct);

// Inyección del middleware antes del controlador
router.post('/menu', validateProduct, productController.createProduct);
router.put('/menu/:id', validateProduct, productController.updateProduct);

router.delete('/menu/:id', productController.deleteProduct);

export default router;

// fin - src/routes/product.routes.ts