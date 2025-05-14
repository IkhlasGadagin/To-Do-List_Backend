import mongoose from "mongoose";
import {IBook} from "./bookTypes";

const bookSchema = new mongoose.Schema<IBook>({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverImage: { type: String, required: true },
    file: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;



