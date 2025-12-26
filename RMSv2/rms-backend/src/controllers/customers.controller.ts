import { Request, Response } from "express";
import * as customerService from "../services/customers.service";

export async function list(req: Request, res: Response) {
  const customers = await customerService.listCustomers();
  res.json(customers);
}

export async function create(req: Request, res: Response) {
  const payload = req.body;
  const customer = await customerService.createCustomer(payload);
  res.status(201).json(customer);
}
