import express, { RequestHandler } from "express";
import { createTodo, deleteTodo, getTodos, getTodoById, updateTodo } from "./todoController";


const toDoRouter = express.Router();

toDoRouter.post("/create", createTodo);
toDoRouter.get("/getalltodos", getTodos);
toDoRouter.get("/:id", getTodoById as RequestHandler);
toDoRouter.put("/:id", updateTodo as RequestHandler);
toDoRouter.delete("/:id", deleteTodo as RequestHandler);


export default toDoRouter;
