import dotenv from "dotenv";
import { findConflictsAndResolve } from "./resolver.js";

dotenv.config();
await findConflictsAndResolve();
