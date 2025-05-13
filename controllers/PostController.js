const pool = require("../db");
const crypto = require("crypto");

const generatePreviewToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

const CreatePost = async (req, res) => {
  const { email, post_txt, create_time, update_time, status, like_count } =
    req.body;
  try {
    const [data] = await pool.query(
      "INSERT INTO posts (email, post_txt,create_time,update_time,status, like_count, preview_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        post_txt,
        create_time,
        update_time,
        status,
        like_count,
        generatePreviewToken(),
      ]
    );

     const insertedId = data.insertId;
     const [insertedData] = await pool.query(
       "SELECT * FROM posts WHERE id = ?",
       [insertedId]
     );
    res.status(201).json({ insertedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while creating post" });
  }
};

module.exports = { CreatePost };
