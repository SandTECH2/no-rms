import { Request, Response } from "express";
import * as projectService from "../services/projects.service";

export async function list(req: Request, res: Response) {
  const projects = await projectService.listProjects();
  res.json(projects);
}

export async function create(req: Request, res: Response) {
  const payload = req.body;
  const project = await projectService.createProject(payload);
  res.status(201).json(project);
}
