import z from "zod";

export const registerInput = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateUserInput = z.object({
  name: z.string().min(1).max(100),
  role: z.enum(["viewer", "analyst", "admin"]),
  isActive: z.boolean(),
});

export const createRecordInput = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  notes: z.string().optional(),
});

export const updateRecordInput = createRecordInput;

export const recordFilterInput = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type registerInput = z.infer<typeof registerInput>
export type loginInput = z.infer<typeof loginInput>
export type updateUserInput = z.infer<typeof updateUserInput>
export type createRecordInput = z.infer<typeof createRecordInput>
export type updateRecordInput = z.infer<typeof updateRecordInput>
export type recordFilterInput = z.infer<typeof recordFilterInput>
