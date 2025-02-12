const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const router = express.Router();
const cookieParser = require('cookie-parser');
const http = require("http");
const { Server } = require('socket.io');
const AuctionItem = require("./models/AuctionItem");
const { placeBid } = require("./controllers/bidController");


dotenv.config();
connectDB();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
})
);
app.use(router);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/notification", require("./routes/notificationRoute"));
app.use('/images', express.static('uploads'))

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"], 
  },
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on("placeBid", (data) => {
    placeBid(io, socket, data);
    console.log('for the bid')
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Emit Auction Updates
const emitAuctionUpdates = async () => {
  const now = new Date();
  const activeAuctions = await AuctionItem.find({ endDate: { $gte: now } });
  io.emit('auctionUpdates', activeAuctions);
};
setInterval(emitAuctionUpdates, 1000)


