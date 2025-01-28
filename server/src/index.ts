import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();
export const FE_BASE_URL = process.env.FE_BASE_URL;

const startup = async () => {
  if (!FE_BASE_URL) throw new Error("Frontegg Base URL is missing");
  app.listen(3001, () => {
    console.log("listening on 3001");
  });
};

startup();
