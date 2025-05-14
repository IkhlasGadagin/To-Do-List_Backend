import { Schema, model } from "mongoose";
import { User } from "./userTypes";

const userSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
},
{ timestamps: true });

const User = model<User>("User", userSchema);

export default User;
