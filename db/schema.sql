CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    preview_token VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    post_txt TEXT NOT NULL,
    create_time DATETIME NOT NULL,
    update_time DATETIME NOT NULL,
    status BOOLEAN DEFAULT true,
    like_count INT DEFAULT 0,
    author_avatar VARCHAR(255),
    author_name VARCHAR(255),
    reading_time VARCHAR(50),
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);