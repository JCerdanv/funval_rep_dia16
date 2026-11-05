// (dia 17) src/controllers/product.controller.ts
import { Request, Response } from 'express';
import * as productModel from '../models/product.model.js';

// agregado 1. Importa el tipo DTO desde tu middleware de validación
import { ProductDTO } from '../middlewares/validate-product.js'; 
//
export const getMenu = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtener todos los productos del menú' */
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el menú.' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtener un producto por ID' */
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validación: Evita que IDs inválidos (letras) pasen a la base de datos
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID proporcionado debe ser un número válido.' });
      return;
    }

    const product = await productModel.getProductById(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado.' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el producto.' });
  }
};

// 2. Tipamos explícitamente el Body como ProductDTO
export const createProduct = async (
  req: Request<{}, {}, ProductDTO>, 
  res: Response 
): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crear un nuevo producto en el menú'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del producto a registrar',
        required: true,
        schema: { $ref: '#/definitions/ProductDTO' }
     }
     #swagger.responses[201] = { 
        description: 'Producto creado exitosamente' 
     }
     #swagger.responses[400] = { 
        description: 'Error de validación en los datos enviados (Campos obligatorios o tipos incorrectos)' 
     }
  */
  try {
    const { name, description, price, cost, stock, eliminado } = req.body;
    const newProduct = await productModel.insertProduct(name, description, price, cost, stock, eliminado);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al crear el producto.' });
  }
};

// 3. Lo mismo para la actualización
export const updateProduct = async (
  req: Request<{ id: string }, {}, ProductDTO>, 
  res: Response
): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Actualizar un producto existente' */
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID proporcionado debe ser un número válido.' });
      return;
    }

    const { name, description, price, cost, stock, eliminado } = req.body;
    const updatedProduct = await productModel.updateProduct(
      id, name, description, price ?? 0, cost ?? 0, stock ?? 0, eliminado,
    );
    
    if (!updatedProduct) {
      res.status(404).json({ message: 'Producto no encontrado para actualizar.' });
      return;
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el producto.' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products'] 
     #swagger.summary = 'Eliminar un producto por ID' */
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validación por si envían un ID que no es un número entero
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID proporcionado no es válido.' });
      return;
    }

    const deletedProduct = await productModel.deleteProduct(id);

    // Si el modelo devuelve null significa que el producto no existía
    if (!deletedProduct) {
      res.status(404).json({ message: 'Producto no encontrado para eliminar.' });
      return;
    }

    // Retorna el producto eliminado y estatus 200 de éxito
    res.json({ message: 'Producto eliminado exitosamente.', product: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el producto.' });
  }
};

// fin - src/controllers/product.controller.ts
