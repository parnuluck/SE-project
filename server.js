const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// เปิดไฟล์ frontend
app.use(express.static(path.join(__dirname)));

let users = [];
let tables = {};

// =================
// REGISTER
// =================
app.post("/register",(req,res)=>{

const {username,password,email} = req.body;

const exist = users.find(u=>u.username===username);

if(exist){
return res.json({
success:false,
message:"Username already exists"
});
}

users.push({
username:username,
password:password,
email:email
});

console.log("\n=== NEW USER REGISTER ===");
console.log("Username:",username);
console.log("Email:",email);

res.json({
success:true
});

});

// =================
// LOGIN
// =================
app.post("/login",(req,res)=>{

const {username,password} = req.body;

const user = users.find(u =>
u.username===username && u.password===password
);

if(user){

console.log("\n=== USER LOGIN ===");
console.log("Username:",username);

res.json({success:true});

}else{

res.json({success:false});

}

});

// =================
// TABLE DATA
// =================
app.get("/tables",(req,res)=>{
res.json(tables);
});

// =================
// RESERVE TABLE
// =================
app.post("/reserve",(req,res)=>{

const {id,people,user} = req.body;

// =====================
// check user reserved already
// =====================

for(let tableId in tables){

const table = tables[tableId];

if(!table.users) continue;

const found = table.users.find(u => u.name === user);

if(found){
return res.json({
success:false,
message:"You already reserved a table"
});
}

}

// =====================
// create table if not exist
// =====================

if(!tables[id]){
tables[id] = {
total:0,
users:[]
};
}

// =====================
// check table full
// =====================

if(tables[id].total + people > 6){
return res.json({
success:false,
message:"Table full"
});
}

// =====================
// reserve
// =====================

tables[id].users.push({
name:user,
people:people
});

tables[id].total += people;


// backend log

console.log("\n===== TABLE UPDATE =====");
console.log("Table:",id);

tables[id].users.forEach(u=>{
console.log(u.name,"-",u.people);
});

console.log("Total:",tables[id].total,"/6");
console.log("========================");


res.json({success:true});

});

// =================
// LEAVE TABLE
// =================
app.post("/leave",(req,res)=>{

const {user} = req.body;

for(let id in tables){

const index = tables[id].users.findIndex(u=>u.name === user);

if(index !== -1){

tables[id].total -= tables[id].users[index].people;

tables[id].users.splice(index,1);

console.log("\nUSER LEFT");
console.log(user,"left table",id);

return res.json({success:true});

}

}

res.json({success:false});

});

app.listen(3000,()=>{
console.log("Server running on port 3000");
});