const tableArea = document.getElementById("tableArea");
const popup = document.getElementById("popup");

let L = "ABCDEFGHIJKLMNOPQ";

let tablePeople = {};
let selectedTable = null;

let colors = ["blue","purple","orange","pink","cyan","brown"];


// =========================
// โหลดข้อมูลโต๊ะจาก backend
// =========================

function loadTables(){

fetch("http://localhost:3000/tables")
.then(res=>res.json())
.then(data=>{

Object.keys(data).forEach(id=>{

const table = document.querySelector(`[data-table="${id}"]`);

if(!table) return;

const people = data[id].total || 0;

table.classList.remove("partial","full");

if(people >= 6){
table.classList.add("full");
}
else if(people > 0){
table.classList.add("partial");
}

table.innerHTML = id;

});

});

}


// =========================
// header
// =========================

let headerRow = document.createElement("div");
headerRow.className = "row";

let empty = document.createElement("div");
empty.className = "header";
headerRow.appendChild(empty);

for(let i = 0; i < L.length; i++){

    let letterBox = document.createElement("div");
    letterBox.className = "header";
    letterBox.innerText = L[i];

    headerRow.appendChild(letterBox);
}

tableArea.appendChild(headerRow);


// =========================
// สร้าง 170 โต๊ะ
// =========================

function getTableLabel(num){

let label = "";

while(num >= 0){
label = String.fromCharCode((num % 26) + 65) + label;
num = Math.floor(num / 26) - 1;
}

return label;

}
let tableIndex = 0;

for(let row = 1; row <= 10; row++){

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    const number = document.createElement("div");
    number.className = "header";
    number.innerText = row;

    rowDiv.appendChild(number);

    for(let seat = 0; seat < 17; seat++){

        const seatDiv = document.createElement("div");
        seatDiv.className = "seat";

        const letter = L[seat];   // A B C D ...
        const seatId = letter + row;

        seatDiv.dataset.table = seatId;
        seatDiv.innerText = seatId;

        seatDiv.addEventListener("click", () => {

            selectedTable = seatId;

            document.getElementById("tableNumber").innerText = seatId;
            document.getElementById("seatCount").innerText = "?";

            popup.style.display = "flex";

        });

        rowDiv.appendChild(seatDiv);

    }

    tableArea.appendChild(rowDiv);
}


// =========================
// cancel popup
// =========================

document.getElementById("cancelBtn").onclick = () => {
    popup.style.display = "none";
};


// =========================
// confirm reserve
// =========================

const confirmBtn = document.getElementById("confirmBtn");

confirmBtn.onclick = () => {

const people = parseInt(document.getElementById("people").value);

if(!people || people <= 0){
alert("Enter number of people");
return;
}

fetch("http://localhost:3000/reserve",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
id:selectedTable,
people:people,
user:localStorage.getItem("username")
})

})
.then(res=>res.json())
.then(data=>{

if(data.success){
popup.style.display = "none";
loadTables();
}

else{
alert(data.message);

}

});

};

function leaveTable(){

fetch("http://localhost:3000/leave",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
user:localStorage.getItem("username")
})

})
.then(res=>res.json())
.then(data=>{

if(data.success){

alert("Table is now free");

loadTables();

}else{

alert("You don't have a table");

}

});

}

// =========================
// reservation mode
// =========================

let reservationMode = false;

document.getElementById("reservationBtn").onclick = () => {

    reservationMode = !reservationMode;

    document.querySelectorAll(".seat").forEach(seat => {

        if(reservationMode && !seat.classList.contains("full")){
            seat.classList.add("canReserve");
        }else{
            seat.classList.remove("canReserve");
        }

    });

};


// โหลดสถานะโต๊ะตอนเปิดเว็บ
loadTables();
setInterval(loadTables,5000);