// (dia 19) src/middlewares/validate-customer.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Definición del esquema de validación con Zod
export const customerSchema = z.object({
  name: z
    .string()
    .trim() // Elimina espacios al inicio y al final antes de contar los caracteres
    .min(1, { message: "El nombre es obligatorio y no puede estar vacio." })
    .max(100, { message: "El nombre no puede superar los 100 caracteres." }),
  email: z
    .string()
    .trim() // es buena práctica aplicarlo a email
    .email({ message: "Debe proporcionar un correo electrónico válido." })
    .max(150, { message: "El email no puede superar los 150 caracteres." }),
  phone_number: z
    .string()
    .trim() // al teléfono si existe
    .max(20, { message: "El número de teléfono no puede superar los 20 caracteres." })
    .optional()
    .nullable(),
});

// Tipo DTO para autocompletado nativo en los controladores
export type CustomerDTO = z.infer<typeof customerSchema>;

// Middleware de validación
export const validateCustomer = (req: Request, res: Response, next: NextFunction): void => {
  const result = customerSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensaje: err.message,
    }));

    res.status(400).json({
      message: "Error de validación en los datos enviados.",
      errors,
    });
    return;
  }

  // Asigna los datos limpios y parseados al cuerpo de la petición
  req.body = result.data;
  next();
};
// fin - src/middlewares/validate-customer.ts