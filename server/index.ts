import "dotenv/config";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { attachUser } from "./middlewares/auth.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
