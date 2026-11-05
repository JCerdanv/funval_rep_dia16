// (dia 18) src/middlewares/validate-product.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Definición del esquema basado en los requerimientos del bootcamp
export const productSchema = z.object({
  name: z.string().min(1, { 
   message: 'El nombre es obligatorio y no puede estar vacío.' }),
  description: z.string().min(1, { 
   message: 'La descripción es obligatoria y no puede estar vacia' }),
  price: z.number().positive({ 
   message: 'El precio debe ser un número mayor a 0.' }),
  cost: z.number().nonnegative({ 
   message: 'El costo debe ser mayor o igual a 0.' }).optional(),
  stock: z.number().int({ 
   message: 'El stock debe ser un número entero.' }).nonnegative({ 
   message: 'El stock debe ser mayor o igual a 0.' }).optional(),
  eliminado: z.boolean({
   message: 'El campo eliminado debe ser un valor booleano (true/false).' }).optional().default(false),
});

// tipo para que tus controladores tengan autocompletado nativo
export type ProductDTO = z.infer<typeof productSchema>;


// Middleware de validación
export const validateProduct = (req: Request, res: Response, 
    next: NextFunction): void => {
  // safeParse no lanza excepciones, 
  // devuelve un objeto con el estado del analisis
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    // Si la validacion falla, mapeamos los errores de Zod entregarlos de forma legible
      const errors = result.error.issues.map((err: z.ZodError['issues'][number]) => ({
      campo: err.path.join('.'),
      mensaje: err.message
    }));

    res.status(400).json({
      message: 'Error de validación en los datos enviados.',
      errors
    });
    return; // Detiene la ejecución aquí, no llama a next()
  }

  // Si todo esta correcto, asignamos el cuerpo parseado 
  // (limpio y tipado) a req.body
  req.body = result.data;
  next(); // Da paso al controlador
};
// fin - src/middlewares/validate-product.ts
