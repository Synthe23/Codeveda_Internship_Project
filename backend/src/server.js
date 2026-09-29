import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { protect } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { verifyToken } from "./utils/jwt.js";
import User from "./models/User.js";

const PORT = Number(process.env.PORT || 3000);

await connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join:user", (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.set("io", io);

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "codveda-taskflow-api" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

const apollo = new ApolloServer({
  typeDefs,
  resolvers
});

await apollo.start();

app.use(
  "/graphql",
  express.json(),
  expressMiddleware(apollo, {
    context: async ({ req }) => {
      try {
        const token = req.cookies?.token;
        if (!token) return { user: null };

        const payload = verifyToken(token);
        const user = await User.findById(payload.sub).select("-password");
        return { user: user ?? null };
      } catch {
        return { user: null };
      }
    }
  })
);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
});
