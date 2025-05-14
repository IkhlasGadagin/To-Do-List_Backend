import { Request, Response, NextFunction } from "express";
import Todo from "./todoModel";

// Create a new to-do item
const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, dueDate, completionDate, status, remarks } = req.body;
        const todo = await Todo.create({
            title,
            description,
            dueDate,
            completionDate,
            status,
            remarks
        });
        res.status(201).json(todo);
    } catch (error) {
        next(error);
    }
};

// Get all to-do items
const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

// Get a single to-do item by ID
const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "To-do item not found" });
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};

// Update a to-do item by ID
const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, dueDate, completionDate, status, remarks } = req.body;
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, completionDate, status, remarks },
            { new: true, runValidators: true }
        );
        if (!todo) {
            return res.status(404).json({ message: "To-do item not found" });
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};

// Delete a to-do item by ID
const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "To-do item not found" });
        }
        res.status(200).json({ message: "To-do item deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };




