const tableArea = document.getElementById("tableArea");

let L = "ABCDEFGHIJKLMNOPQ";

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

        rowDiv.appendChild(seatDiv);

    }

    tableArea.appendChild(rowDiv);
}