import { Request, Response } from "express";
import prisma from "../prisma";
import { updateUserInput } from "../validators/schemas";

const safeSelect = {
  id: true, 
  name: true, 
  email: true,
  role: true, 
  isActive: true, 
  createdAt: true, 
  updatedAt: true,
};

export async function getUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({ 
    select: safeSelect, 
    orderBy: { 
      createdAt: "desc" 
    } 
  });
  res.json(users);
}

export async function updateUser(req: Request, res: Response) {
  const result = updateUserInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors
    });
    return;
  }

  const user = await prisma.user.findUnique({ 
    where: { id: req.params.id } 
  });
  
  if (!user) {
    res.status(404).json({ 
      error: "user not found" 
    });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: result.data,
    select: safeSelect,
  });
  res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ 
    where: { id: req.params.id } 
  });

  if (!user) {
    res.status(404).json({ 
      error: "user not found" 
    });

    return;
  }

  await prisma.user.delete({ 
    where: { 
      id: req.params.id 
    } 
  });
  res.status(204).send();
}
