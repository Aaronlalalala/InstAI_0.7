# 使用官方的 Node.js 映像
FROM node:14

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 以先安裝相依套件
COPY package*.json ./

# 複製應用程式程式碼
COPY . .

# 安裝相依套件
RUN npm install


# 指定執行時指令
CMD ["npm", "start"]