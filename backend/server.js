import express from "express";
import cors from "cors";
import todoRouter from "./routes/todos.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// todoRouter for the /todos
app.use("/todos", verifyToken, todoRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`) 
});