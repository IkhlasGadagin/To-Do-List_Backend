import User from "../user/userModel";

export interface IBook {
    _id: string;
    title: string;
    author: User;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
}

