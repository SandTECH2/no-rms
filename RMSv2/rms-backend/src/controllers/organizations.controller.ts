import { Request, Response } from "express";
import * as orgService from "../services/organizations.service";

export async function list(req: Request, res: Response) {
  const orgs = await orgService.listOrganizations();
  res.json(orgs);
}

export async function create(req: Request, res: Response) {
  const org = await orgService.createOrganization(req.body);
  res.status(201).json(org);
}
