import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { registerInput, loginInput } from "../validators/schemas";

export async function register(req: Request, res: Response) {
  const result = registerInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors 
    });
    return;
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ 
      error: "email already in use" 
    });
    return;
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      isActive: true, 
      createdAt: true 
    },
  });

  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const result = loginInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors 
    });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ 
      error: "invalid email or password" 
    });
    return;
  }
  if (!user.isActive) {
    res.status(403).json({ 
      error: "account is inactive" 
    });
    return;
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    res.status(401).json({ 
      error: "invalid email or password" 
    });
    return;
  }

  const token = jwt.sign(
    { 
    userId: user.id, 
    role: user.role 
  },
    process.env.JWT_SECRET!,{ expiresIn: "24h"}
  );

  const { passwordHash: _, ...safeUser } = user;
  res.json({ 
    token, user: safeUser 
  });
}
