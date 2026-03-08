const tableArea = document.getElementById("tableArea");
const popup = document.getElementById("popup");

let L = "ABCDEFGHIJKLMNOPQ";

let tablePeople = {};
let selectedTable = null;

let colors = ["blue","purple","orange","pink","cyan","brown"];

//header 

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


//170โต๊ะ

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


//cancel

document.getElementById("cancelBtn").onclick = () => {
    popup.style.display = "none";
};



//cf
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

    if(tablePeople[selectedTable] + people > 6){
        alert("Table capacity is 6");
        return;
    }

    document.querySelectorAll(".seat").forEach(seat => {
        if(seat.classList.contains("full")){
                seat.style.pointerEvents = "none"
                seat.style.opacity = "0.4"
            }

    })    

    if(!selectedTable) return;

    if(!tablePeople[selectedTable]){
        tablePeople[selectedTable] = 0;
    }

    tablePeople[selectedTable] += people;
        document.getElementById("seatCount").innerText =
    tablePeople[selectedTable];

    const seat = document.querySelector(`[data-table="${selectedTable}"]`);


    //color of table
    if(tablePeople[selectedTable] >= 6){

        seat.classList.remove("partial");
        seat.classList.add("full");

    }
    else{   

        seat.classList.add("partial");

    }

  

    if(!seat.querySelector(".peopleContainer")){
        
        const container = document.createElement("div");
        container.className = "peopleContainer";
        
        seat.appendChild(container);
    }

    const container = seat.querySelector(".peopleContainer");
//people

    for(let i=0;i<people;i++){

        const dot = document.createElement("div");
        dot.className = "person";

        dot.style.background = colors[Math.floor(Math.random()*colors.length)];

        container.appendChild(dot);
    }

    popup.style.display = "none";

};

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
