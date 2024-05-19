const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

// 設定上傳路徑和檔名
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 初始化上傳工具
const upload = multer({ storage });

// 處理上傳請求
app.post('/upload', upload.array('images', 5), (req, res) => {
  console.log('Images received and saved:', req.files);
  res.status(200).send('Images uploaded successfully');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});