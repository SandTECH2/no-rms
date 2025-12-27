import { Request, Response } from "express";
import * as warehouseService from "../services/warehouses.service";

export async function list(req: Request, res: Response) {
  const warehouses = await warehouseService.listWarehouses();
  res.json(warehouses);
}

export async function create(req: Request, res: Response) {
  const warehouse = await warehouseService.createWarehouse(req.body);
  res.status(201).json(warehouse);
}
