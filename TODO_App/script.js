function addItem(event) {
    event.preventDefault();
    //Empêche le rafraichissement automatique de la page

    let text = document.getElementById("item-input");
    database.collection("todo-items").add({
        text: text.value,
        status : "active"
    });
    text.value="";
}

function getItems() {
    database.collection("todo-items").onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            const item = doc.data();
            item.id = doc.id;
            items.push(item);
        });
        generateItems(items);
    })
}

function generateItems(items){
    let itemsHTML = "";
    items.forEach((item)=>{
        itemsHTML += `
            <div class="todo-item">
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked" : ""}">
                        <img src="./assets/icon-check.svg" alt="check">
                     </div>
                </div>
                <div class="item-text ${item.status == "completed" ? "checked" : ""}">
                     ${item.text}
                </div>
            </div>
        `
    })

    document.querySelector(".items").innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners() {
    let todoCheckmarks = document.querySelectorAll(".todo-item .check-mark");
    todoCheckmarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function(){
            markCompleted(checkMark.dataset.id);
        })
    })
}

function markCompleted(id) {
    //Depuis la base de données
    let item = database.collection("todo-items").doc(id);

    item.get().then(function(doc){
        if(doc){
            let status = doc.data().status;
            if(status == "active"){
                item.update({
                    status : "completed"
                })
            } else if(status == "completed"){
                item.update({
                    status: "active"
                })
            }
        }
    })
}

getItems();