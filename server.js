const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

const app = express();
const PORT = 3800;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/Post", postRoutes);

app.listen(PORT, async () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
