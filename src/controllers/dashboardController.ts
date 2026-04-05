import { Request, Response } from "express";
import prisma from "../prisma";

export async function getSummary(req: Request, res: Response) {
  const records = await prisma.financialRecord.findMany({
    select: { 
      type: true, 
      category: true, 
      amount: true 
    },
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const byCategory: Record<string, number> = {};

  for (const r of records) {
    const amount = Number(r.amount);
    if (r.type === "income") {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
    const key = `${r.type}:${r.category}`;
    byCategory[key] = (byCategory[key] ?? 0) + amount;
  }

  res.json({
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    byCategory,
  });
}
