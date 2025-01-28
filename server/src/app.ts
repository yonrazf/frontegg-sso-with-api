import express, { json, Request, Response } from "express";
import cors from "cors";
import { SamlRouter } from "./routes/samlLogin";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error-handler";
dotenv.config();
const API_KEY = process.env.FE_API_KEY;
const CLIENT_ID = process.env.FE_CLIENT_ID;

const app = express();

app.use(errorHandler);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://app-kcj0djtbjuee.frontegg.com/oauth/account/login",
  "*",
]; // Add all allowed origins here

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true); // Allow request
    },
  })
);

app.use(json());

app.use(SamlRouter);

app.all("*", async (req: Request, res: Response) => {
  const err = new Error("Not found");

  res.status(404).send({ error: err });
});

export { app };
