const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let tables = {};

// ดึงสถานะโต๊ะทั้งหมด
app.get("/tables",(req,res)=>{
    res.json(tables);
});

// จองโต๊ะ
app.post("/reserve",(req,res)=>{

    const {id,people} = req.body;

    if(!tables[id]){
        tables[id] = 0;
    }

    if(tables[id] + people > 6){
        return res.json({message:"Table full"});
    }

    tables[id] += people;

    res.json({
        message:"Reserved",
        people:tables[id]
    });
});

// ออกจากโต๊ะ (QR)
app.post("/leave",(req,res)=>{

    const {id} = req.body;

    tables[id] = 0;

    res.json({message:"Table cleared"});
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});