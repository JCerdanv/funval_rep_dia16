// (dia 19) src/controllers/customer.controller.ts

import { Request, Response } from "express";
import * as customerModel from "../models/customer.model.js";
import { CustomerDTO } from "../middlewares/validate-customer.js";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Obtener clientes con filtros de búsqueda y paginación' */
  try {
    // 1. Extraer los parámetros de búsqueda de la URL (?name=mar&limit=3)
    const searchName = req.query.name ? String(req.query.name) : undefined;
    const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;

    // 2. Validar que si envían un límite, sea un número válido y positivo
    if (limitParam !== undefined && (isNaN(limitParam) || limitParam <= 0)) {
      res.status(400).json({ message: "El parámetro 'limit' debe ser un número entero positivo." });
      return;
    }

    // 3. Llamar al modelo enviando los filtros dinámicos
    const customers = await customerModel.getAllCustomers(searchName, limitParam);
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor al obtener los clientes." });
  }
};

export const getCustomer = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Obtener un cliente por ID' */
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "El ID proporcionado debe ser un número válido." });
      return;
    }

    const customer = await customerModel.getCustomerById(id);
    if (!customer) {
      res.status(404).json({ message: "Cliente no encontrado." });
      return;
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor al obtener el cliente." });
  }
};

export const createCustomer = async (
  req: Request<{}, {}, CustomerDTO>,
  res: Response
): Promise<void> => {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Crear un nuevo cliente'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del cliente a registrar',
        required: true,
        schema: { $ref: '#/definitions/CustomerDTO' }
     } */
  try {
    const { name, email, phone_number } = req.body;
    const newCustomer = await customerModel.insertCustomer(name, email, phone_number);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    // Controlar el error de llave duplicada de PostgreSQL para el email único
    if (error instanceof Error && (error as any).code === "23505") {
      res.status(400).json({ message: "El correo electrónico ya se encuentra registrado." });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor al crear el cliente." });
  }
};

export const updateCustomer = async (
  req: Request<{ id: string }, {}, CustomerDTO>,
  res: Response
): Promise<void> => {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Actualizar un cliente existente' */
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "El ID proporcionado debe ser un número válido." });
      return;
    }

    const { name, email, phone_number } = req.body;
    const updatedCustomer = await customerModel.updateCustomer(id, name, email, phone_number);

    if (!updatedCustomer) {
      res.status(404).json({ message: "Cliente no encontrado para actualizar." });
      return;
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && (error as any).code === "23505") {
      res.status(400).json({ message: "El correo electrónico ya está siendo usado por otro cliente." });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor al actualizar el cliente." });
  }
};


//hard deleteCustomer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Customers'] 
     #swagger.summary = 'Eliminar un cliente por ID' */
  try {
    const id = parseInt(req.params.id as string, 10);

    // Validación por si envían un ID que no es un número entero
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID proporcionado no es válido.' });
      return;
    }

    // El metodo puede no estar incluido en la tipificación actual del modelo.
    const deleteCustomer = (
      customerModel as typeof customerModel & {
        deleteCustomer?: (customerId: number) => Promise<unknown>;
      }
    ).deleteCustomer;

    if (!deleteCustomer) {
      res.status(501).json({ message: 'La eliminación de clientes no está disponible.' });
      return;
    }

    const deletedCustomer = await deleteCustomer(id);

    // Si el modelo devuelve null significa que el cliente no existía
    if (!deletedCustomer) {
      res.status(404).json({ message: 'Cliente no encontrado para eliminar.' });
      return;
    }

    // Retorna el cliente eliminado y estatus 200 de éxito
    res.json({ message: 'Cliente eliminado exitosamente.', customer: deletedCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el cliente.' });
  }
};
// fin - src/controllers/customer.controller.ts
