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
        generateItemsLeft(items);
    })
}

function generateItems(items){
    let itemsHTML = "";
    items.forEach((item)=>{
        itemsHTML += `
            <div class="todo-item">
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked" : "not-checked"}">
                        <img src="./assets/icon-check.svg" alt="check">
                     </div>
                </div>
                <div class="item-text ${item.status == "completed" ? "checked" : "not-checked"}">
                     ${item.text}
                </div>
            </div>
        `
    })

    document.querySelector(".items").innerHTML = itemsHTML;
    createEventListeners();
    selectEventListener();
    filter(document.querySelector(".items-statuses span.active").innerHTML);
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

function selectEventListener() {
    let selectToDo = document.querySelectorAll(".items-statuses span");
    selectToDo.forEach((select) => {
        select.addEventListener("click", function() {
            selectFilter(select);
        })
    })
}

function selectFilter(select) {
    desactiveFilter();
    select.className = "active";
    filter(select.innerText);
}

function desactiveFilter() {
    let activeSelect = document.querySelector(".items-statuses span.active");
    activeSelect.className = "";
}


function filter(filter) {
    let items = document.querySelectorAll(".items .todo-item");
    items.forEach((item) => {
        item.style.display="flex";
    })
    switch (filter) {
        case 'All':
            break;
            case 'Active':
                items.forEach((item) => {
                    if(item.children[1].classList.contains("checked")){
                        item.style.display="none";
                    }
                })
                break;
                case 'Completed':
                    items.forEach((item) => {
                        if(item.children[1].classList.contains("not-checked")){
                            item.style.display="none";
                        }
                    })
                    break;
                    default:
                        break;
                    }
                }

function generateItemsLeft(items){
    document.querySelector(".items-left").innerHTML = `${items.length} items left`;
}

function deleteCompleted(){
    let collection = database.collection("todo-items");
    let itemToDelete = collection.where("status", "==", "completed")
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            let id = doc.id;
            collection.doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function changeTheme() {
    let div = document.querySelector(".theme");
    if(div.innerHTML.includes("Dark mode")){
        div.innerHTML = `<img src="./assets/icon-moon.svg" alt="Light mode">`;
        document.querySelector("body").className = "light-mode";
    }
    else if(div.innerHTML.includes("Light mode")){
        div.innerHTML = `<img src="./assets/icon-sun.svg" alt="Dark mode">`;
        document.querySelector("body").className = "";
    }
}
                
getItems();
                
                