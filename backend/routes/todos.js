import express from "express";
const router = express.Router();
import prisma from "../db/index.js";
import { createClient } from "@supabase/supabase-js";

// Supabase client (used for verifying tokens)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware to verify JWT and attach user to request
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Ensure Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  // 2. Validate JWT using Supabase
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // 3. Attach user object to the request for access in routes
  req.user = data.user;
  next();
}

// GET: Fetch all todos for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    console.error("GET /todos error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching todos",
    });
  }
});

// POST: Create a new todo
router.post("/", authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newTodo = await prisma.todo.create({
      data: {
        name,
        description,
        completed: false,
        userId: req.user.id, // Associate todo with authenticated user
      },
    });

    res.status(201).json({
      success: true,
      todo: newTodo.id,
    });
  } catch (error) {
    console.error("POST /todos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create new todo",
    });
  }
});

// PUT: Mark a todo as completed
router.put("/:todoId/completed", authenticate, async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    // Find the todo and verify ownership
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo || todo.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Todo not found or unauthorized",
      });
    }

    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: true },
    });

    res.status(200).json({
      success: true,
      todo: updated.id,
    });
  } catch (error) {
    console.error("PUT /todos/:id/completed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark todo as completed",
    });
  }
});

// DELETE: Only allow deleting a completed todo
router.delete("/:todoId", authenticate, async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // Ensure the user owns the todo
    if (todo.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Only allow deletion if completed
    if (!todo.completed) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an incomplete todo",
      });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    res.status(200).json({
      success: true,
      todo: todoId,
    });
  } catch (error) {
    console.error("DELETE /todos/:id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
});

export default router;
