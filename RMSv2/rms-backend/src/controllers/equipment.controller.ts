import { Request, Response } from "express";
import * as equipmentService from "../services/equipment.service";

export async function getAll(req: Request, res: Response) {
  const items = await equipmentService.listEquipment();
  res.json(items);
}

export async function create(req: Request, res: Response) {
  const payload = req.body;
  const created = await equipmentService.createEquipment(payload);
  res.status(201).json(created);
}

export async function scan(req: Request, res: Response) {
  const { serial } = req.params;
  try {
    const item = await equipmentService.scanSerial(serial);
    res.json({ message: "Scanned and set to Available", item });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}
