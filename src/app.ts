import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/useRouter";
import bookRouter from "./book/bookRouter";
import toDoRouter from "./to-do/toDoRouter";

const app = express();

// CORS middleware (should be placed at the top before routes)
app.use(cors()); // Allow all origins
// Or, customize like this:
// app.use(cors({ origin: "http://your-frontend-domain.com" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    res.json({
        message: "Welcome to the Coders Gyan API!"
    });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/to-do", toDoRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
