// (dia 19) src/routes/customer.routes.ts

import { Router } from "express";
import * as customerController from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const router: ReturnType<typeof Router> = Router();

router.get("/customers", customerController.getCustomers);
router.get("/customers/:id", customerController.getCustomer);
router.post("/customers", validateCustomer, customerController.createCustomer);
router.put("/customers/:id", validateCustomer, customerController.updateCustomer);

router.delete('/customers/:id', customerController.deleteCustomer);

export default router;
// fin - src/routes/customer.routes.ts