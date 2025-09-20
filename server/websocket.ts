const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

// Configure CORS for both REST and WebSocket
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: corsOptions,
});

// Track connected clients
const connectedClients = new Map();

io.on("connection", (socket: any) => {
  console.log("Client connected:", socket.id);
  connectedClients.set(socket.id, { connectedAt: new Date() });

  // Handle client authentication
  socket.on("authenticate", (token: string) => {
    // Implement your authentication logic here
    connectedClients.set(socket.id, {
      ...connectedClients.get(socket.id),
      authenticated: true,
      token,
    });
  });

  // Handle stock updates
  socket.on("stock:updated", (data: any) => {
    // Broadcast to all other clients
    socket.broadcast.emit("stock:updated", data);
  });

  // Handle order updates
  socket.on("order:updated", (data: any) => {
    socket.broadcast.emit("order:updated", data);
  });

  // Handle product updates
  socket.on("product:updated", (data: any) => {
    socket.broadcast.emit("product:updated", data);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    connectedClients.delete(socket.id);
  });
});

// Health check endpoint
app.get("/health", (_req: any, res: any) => {
  res.json({
    status: "healthy",
    connections: connectedClients.size,
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.WEBSOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
