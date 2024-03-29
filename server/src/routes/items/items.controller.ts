import { getOneItemById } from "../../models/items.model.js";
import { Request, Response } from "express";

export async function httpGetOneItemById(req: Request, res: Response) {
  const id = req.params.id;

  return res.status(200).json(await getOneItemById(id));
}
