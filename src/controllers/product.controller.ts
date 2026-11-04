// (dia 17) src/controllers/product.controller.ts
import { Request, Response } from 'express';
import * as productModel from '../models/product.model.js';

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

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crear un nuevo producto en el menú' */
  try {
    const { name, description, price } = req.body;
    const newProduct = await productModel.insertProduct(name, description, price);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al crear el producto.' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Actualizar un producto existente' */
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validación: Evita que IDs inválidos (letras) pasen a la base de datos
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID proporcionado debe ser un número válido.' });
      return;
    }

    const { name, description, price } = req.body;
    const updatedProduct = await productModel.updateProduct(id, name, description, price);
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
