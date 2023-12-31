const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const crypto = require("crypto");
const cors = require("cors");
const fs = require("fs");

const { names, cities } = require("./data.json");



const PORT =  3000;
app.use(cors());





//encrypted secret key
app.get('/', (req, res)=> {
  res.json({
    status:true
  })
})
function encryptKey(name, origin, destination) {
  try {
    const sha256Hasher = crypto.createHash("sha256");
    const secret_key = sha256Hasher
      .update(name + origin + destination)
      .digest("hex");

    return secret_key.substring(0, 32);
  } catch (error) {
    console.log(error);
  }
}

//payload encrypted function
function encryptedData(secret, text) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ctr", secret, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + encrypted;
  } catch (error) {
    console.log(error);
  }
}

//payload encrypted function

function decryptData(secret, text) {
  try {
    const iv = Buffer.from(text.slice(0, 32), "hex");
    const encrypted = text.slice(32);

    const decipher = crypto.createDecipheriv("aes-256-ctr", secret, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.log(error);
  }
}

//creating new socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//initialization
io.on("connection", (socket) => {
  socket.on("first", (message) => {
    setInterval(() => {
      const random = Math.floor(Math.random() * names.length);
      const name = names[random];
      const origin = cities[random];
      const destination = cities[cities.length - 1 - random];
      const encryptedKey = encryptKey(name, origin, destination);
      const encryptedMessage = {
        name: encryptedData(encryptedKey, name),
        origin: encryptedData(encryptedKey, origin),
        destination: encryptedData(encryptedKey, destination),
        secret_key: encryptedKey,
      };
      io.emit("mess", encryptedMessage);
    }, 10000);
  });

  socket.on("dataToBeEncrypted", (data) => {
    console.log("new user:", data);
    const { name, origin, destination, secret_key } = data;
    const dataToBeEncrypted = {
      name: decryptData(secret_key, name),
      origin: decryptData(secret_key, origin),
      destination: decryptData(secret_key, destination),
      secret_key: secret_key,
    };
    io.emit("mess2", dataToBeEncrypted);
  });
});

server.listen(3000, () => {
  console.log("server is listening on", 3000);
});