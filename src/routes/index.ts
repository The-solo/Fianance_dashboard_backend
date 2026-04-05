import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { register, login } from "../controllers/authController";
import { getUsers, updateUser, deleteUser } from "../controllers/userController";
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from "../controllers/recordController";
import { getSummary } from "../controllers/dashboardController";

const router = Router();

// auth 
router.post("/auth/register", register);
router.post("/auth/login", login);

// users — admin only
router.get("/users",        authenticate, requireRole("admin"), getUsers);
router.put("/users/:id",    authenticate, requireRole("admin"), updateUser);
router.delete("/users/:id", authenticate, requireRole("admin"), deleteUser);

// records — read: all users, write: admin only
router.get("/records",       authenticate, getRecords);
router.get("/records/:id",   authenticate, getRecordById);
router.post("/records",      authenticate, requireRole("admin"), createRecord);
router.put("/records/:id",   authenticate, requireRole("admin"), updateRecord);
router.delete("/records/:id",authenticate, requireRole("admin"), deleteRecord);

// dashboard
router.get("/dashboard/summary", authenticate, getSummary);

export default router;
