const pool = require("../db");
const crypto = require("crypto");

const generatePreviewToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

const CreatePost = async (req, res) => {
  const { 
    email, 
    title, 
    post_txt, 
    create_time, 
    update_time, 
    status, 
    like_count,
    author_avatar,
    author_name,
    reading_time,
    comment_count,
    share_count,
    views,
    category
  } = req.body;
  try {
    const currentDate = new Date().toISOString();
    const [data] = await pool.query(
      "INSERT INTO posts (email, title, post_txt, create_time, update_time, status, like_count, preview_token, author_avatar, author_name, reading_time, comment_count, share_count, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        title,
        post_txt,
        currentDate.split('T')[0],
        currentDate.split('T')[0],
        status,
        like_count,
        generatePreviewToken(),
        author_avatar,
        author_name,
        reading_time,
        comment_count,
        share_count,
        views
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

const getPostByPreviewToken = async (req, res) => {
  const { previewToken } = req.params;
  try {
    const [result] = await pool.query(
      "SELECT * FROM posts WHERE preview_token = ?",
      [previewToken]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

const updatePostByPreviewToken = async (req, res) => {
  try {
    const previewToken = req.params.previewToken;
    if (!previewToken) {
      return res.status(400).json({ message: "Preview token is required" });
    }

    const { 
      title, 
      post_txt, 
      status, 
      like_count,
      comment_count,
      share_count,
      views
    } = req.body;
    
    if (!post_txt) {
      return res.status(400).json({ message: "Post text is required" });
    }

    const updateData = {
      title,
      post_txt,
      status: status ? 1 : 0,
      like_count: like_count || 0,
      comment_count: comment_count || 0,
      share_count: share_count || 0,
      views: views || 0,
      update_time: new Date().toISOString().split('T')[0] // Only keep YYYY-MM-DD part
    };

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const columns = Object.keys(filteredData).map(col => `${col} = ?`).join(', ');
    const values = Object.values(filteredData);

    const updateQuery = `UPDATE posts SET ${columns} WHERE preview_token = ?`;

    const [updateResult] = await pool.query(updateQuery, [...values, previewToken]);
    if (!updateResult.affectedRows) {
      throw new Error('No rows were updated');
    }

    const [updatedPost] = await pool.query(
      "SELECT * FROM posts WHERE preview_token = ?",
      [previewToken]
    );

    if (!updatedPost.length) {
      throw new Error('Failed to fetch updated post');
    }

    res.json(updatedPost[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ 
      message: "Error updating post",
      error: error.message 
    });
  }
};

module.exports = { CreatePost, getPostByPreviewToken, updatePostByPreviewToken };
