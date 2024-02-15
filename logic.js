class StaticVariables {
    static count = 1;
}

window.onload = function(e) {
    fetch("https://to-do-list-data.onrender.com/api/tasks")
    .then(res => res.json())
    .then(json => {
        json.map(data => {
            StaticVariables.count++;
            addItem(data.task, data.completed, data.id);
        })
    })
}

let inputField = document.getElementById("input");
inputField.addEventListener("keypress", function(e) {
    if (e.key == "Enter" && inputField.value != "") {
        addItem(inputField.value, "no", StaticVariables.count);

        fetch("https://to-do-list-data.onrender.com/api/tasks", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "id": StaticVariables.count,
                "task": inputField.value,
                "completed": "no"
            })
        })
        .then(res => res.json())
        .then(json => console.log(json));
    }
});

let list = document.getElementById("list");
list.addEventListener("click", function(e) {
    var element = e.target;
    if (element.tagName == "I") {
        element = element.parentElement;
    }

    if (element.value == "complete") {
        updateItem(element.parentElement.parentElement, element.checked);
    }
    else if (element.value == "delete") {
        deleteItem(element.parentElement.parentElement);
    }
});



function addItem(task, completed, id) {
    newItem = document.createElement("li");
    newItem.setAttribute("class", "item");
    newItem.setAttribute("id", id);

    newItemLabel = document.createElement("label");
    newItemLabel.setAttribute("class", "check");

    newItemInput = document.createElement("input");
    newItemInput.setAttribute("type", "checkbox");
    newItemInput.setAttribute("name", "checkbox");
    newItemInput.setAttribute("value", "complete");
    newItemInput.setAttribute("class", "checkbox");
    newItemInput.setAttribute("job", "complete");

    newItemSpan = document.createElement("span");
    newItemSpan.setAttribute("class", "check-text");
    newItemSpan.setAttribute("name", "checkbox-text");
    newItemSpan.innerHTML = task;

    newItemButton = document.createElement("button");
    newItemButton.setAttribute("value", "delete");
    newItemButton.setAttribute("class", "delete");
    newItemButton.setAttribute("job", "delete");

    newItemIcon = document.createElement("i");
    newItemIcon.setAttribute("class", "fa fa-trash");
    newItemIcon.setAttribute("value", "delete");

    newItemLabel.appendChild(newItemInput);
    newItemLabel.appendChild(newItemSpan);

    newItemButton.appendChild(newItemIcon);
    newItemLabel.appendChild(newItemButton);
    newItem.appendChild(newItemLabel);
    list.appendChild(newItem);

    if (completed == "yes") {
        newItemInput.setAttribute("checked", "yes");
        newItemSpan.setAttribute("style", "text-decoration: line-through 1px");
    }

    StaticVariables.count++;
}


function updateItem(element, value) {
    var text = element.getElementsByClassName("check")[0].getElementsByClassName("check-text")[0];
    if (value)
        text.setAttribute("style", "text-decoration: line-through 1px");
    else
        text.setAttribute("style", "text-decoration: none");
   
    fetch("https://to-do-list-data.onrender.com/api/tasks/" + element.id, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "id": element.id,
            "task": text.innerHTML,
            "completed": value ? "yes" : "no"
        })
    })
    .then(res => res.json())
    .then(json => console.log(json));
}


function deleteItem(element) {
    fetch("https://to-do-list-data.onrender.com/api/tasks/" + element.id, {
        method: "DELETE"
    });
    
    StaticVariables.count--;
    document.getElementById("list").removeChild(document.getElementById(element.id));
}
