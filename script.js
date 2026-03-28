fetch("http://localhost:3000/tables")
.then(res => res.json())
.then(data => {

    const container = document.getElementById("tables");

    data.forEach(table => {

        const div = document.createElement("div");

        div.innerHTML =
        "Table " + table.number + " - " + table.status;

        container.appendChild(div);

    });

});

function reserveTable(id){

fetch("/reserve",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({id:id})
})
.then(res=>res.json())
.then(()=>{
    loadTables();
});

}