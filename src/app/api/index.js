import express from "express";
import cors from "cors";
// import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// const MONGODB_URI = process.env.MONGODB_URI || "";

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// mongoose.connect(MONGODB_URI);

// const connection = mongoose.connection;

// connection.once("open", () => {
//   console.log("MongoDB connection established successfully");
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
