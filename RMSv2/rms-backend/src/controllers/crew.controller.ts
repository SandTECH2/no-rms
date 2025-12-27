import { Request, Response } from "express";
import * as crewService from "../services/crew.service";

export async function list(req: Request, res: Response) {
  const crew = await crewService.listCrew();
  res.json(crew);
}

export async function create(req: Request, res: Response) {
  const crewMember = await crewService.createCrew(req.body);
  res.status(201).json(crewMember);
}
