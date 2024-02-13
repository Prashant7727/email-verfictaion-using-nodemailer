const express = require("express");
const cors = require("cors"); // Import the cors package
require("./config/db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Use the cors middleware
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/user", userRoutes);

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
