import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDatabase } from "./db-connection";
import { authRouter } from "./routes/home.routes";
import { userRouter } from "./routes/user.routes";
import { adminRouter } from "./routes/admin.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

// check endpoint
app.get("/", (_, response) => {
  response.status(200).send("Server is up and running 💫");
});

app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Express is running on Port ${PORT}`);
});

connectToDatabase();
