import { Server } from "socket.io";
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors({
    origin: "*"
}));

app.get("/",(req,res)=>{
    res.json({name:"code yoy",Subcribe:true});
});

app.listen(3000,()=>{
    console.log("server is listening on 3000");
})
