import { Request, Response } from "express";
import prisma from "../prisma";
import { createRecordInput, updateRecordInput, recordFilterInput } from "../validators/schemas";
import { RecordType } from "@prisma/client";

export async function getRecords(req: Request, res: Response) {
  const result = recordFilterInput.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors 
    });
    return;
  }

  const { type, category, from, to } = result.data;

  const records = await prisma.financialRecord.findMany({
    where: {
      ...(type && { type: type as RecordType }),
      ...(category && { category }),
      ...(from || to ? {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      } : {}),
    },
    orderBy: { date: "desc" }, //from earliest to newest.
  });

  res.json(records);
}

export async function getRecordById(req: Request, res: Response) {
  const record = await prisma.financialRecord.findUnique({ 
    where: { 
      id: req.params.id 
    } 
  });

  if (!record) {
    res.status(404).json({ 
      error: "record not found" 
    }); 
    return;
  }
  res.json(record);
}

export async function createRecord(req: Request, res: Response) {
  const result = createRecordInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors 
    });
    return;
  }

  const { amount, type, category, date, notes } = result.data;

  const record = await prisma.financialRecord.create({
    data: {
      userId: req.user!.userId,
      amount,
      type: type as RecordType,
      category,
      date: new Date(date),
      notes,
    },
  });

  res.status(201).json(record);
}

export async function updateRecord(req: Request, res: Response) {
  const result = updateRecordInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ 
      error: result.error.flatten().fieldErrors 
    });
    return;
  }

  const existing = await prisma.financialRecord.findUnique({ 
    where: { id: req.params.id } 
  });

  if (!existing) {
    res.status(404).json({ 
      error: "record not found" 
    });
    return;
  }

  const { amount, type, category, date, notes } = result.data;

  const record = await prisma.financialRecord.update({
    where: { id: req.params.id },
    data: { amount, type: type as RecordType, 
      category, date: new Date(date), 
      notes 
    },
  });

  res.json(record);
}

export async function deleteRecord(req: Request, res: Response) {
  const existing = await prisma.financialRecord.findUnique({ 
    where: { id: req.params.id } 
  });

  if (!existing) {
    res.status(404).json({ 
      error: "record not found" 
    });
    return;
  }

  await prisma.financialRecord.delete({ 
    where: { id: req.params.id } 
  }); 
  res.status(204).send();
}
