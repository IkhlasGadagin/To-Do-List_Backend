import mongoose from "mongoose";
import { ITodo } from "./todoTypes";

const todoSchema = new mongoose.Schema<ITodo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    remarks: { type: String }
}, { timestamps: true });

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;
