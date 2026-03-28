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

        tablePeople[id] = data[id];

        const seat = document.querySelector(`[data-table="${id}"]`);

        if(!seat) return;

        const people = data[id];

        if(people >= 6){
            seat.classList.add("full");
        }
        else if(people > 0){
            seat.classList.add("partial");
        }

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

for(let row = 1; row <= 10; row++){

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    const number = document.createElement("div");
    number.className = "header";
    number.innerText = row;

    rowDiv.appendChild(number);

    for(let seat = 1; seat <= 17; seat++){

        const seatDiv = document.createElement("div");
        seatDiv.className = "seat";

        const seatId = L[seat-1] + row;
        seatDiv.dataset.table = seatId;

        seatDiv.addEventListener("click", () => {

            selectedTable = seatId;

            document.getElementById("tableNumber").innerText = seatId;

            let used = tablePeople[seatId] || 0;

            document.getElementById("seatCount").innerText = used;

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

    if(!people || people < 1){
        alert("Please enter number of people");
        return;
    }

    if(people > 6){
        alert("Maximum 6 people per table");
        return;
    }

    if((tablePeople[selectedTable] || 0) + people > 6){
        alert("Table capacity is 6");
        return;
    }

    if(!selectedTable) return;

    fetch("http://localhost:3000/reserve",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id:selectedTable,
            people:people
        })
    })
    .then(res=>res.json())
    .then(data=>{

        tablePeople[selectedTable] = data.people;

        const seat = document.querySelector(`[data-table="${selectedTable}"]`);

        if(data.people >= 6){
            seat.classList.remove("partial");
            seat.classList.add("full");
        }
        else{
            seat.classList.add("partial");
        }

    });

    popup.style.display = "none";

};


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