import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Running",
    message: `Your app is running on the PORT: ${PORT}`,
  });
});

app.listen(PORT, () =>
  console.log(`Server is running succesfully on PORT ${PORT}!🚀`)
);
