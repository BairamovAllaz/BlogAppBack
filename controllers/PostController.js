const pool = require("../db");


const CreatePost = async (req, res) => {
  const { email, post_txt, create_time, update_time,status,like_count } = req.body;
  try {
    await pool.query(
      "INSERT INTO posts (email, post_txt,create_time,update_time,status, like_count) VALUES (?, ?, ?, ?, ?, ?)",
      [email, post_txt, create_time, update_time, status, like_count]
    );
    res.status(201).json("Post created succsesfly");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating post" });
  }
};



module.exports = { CreatePost };