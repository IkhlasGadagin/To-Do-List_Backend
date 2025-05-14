export interface ITodo {
    _id: string;
    title: string;
    description: string;
    createdDate: Date;
    completionDate?: Date;
    dueDate: Date;
    status: "pending" | "in-progress" | "completed";
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
} 