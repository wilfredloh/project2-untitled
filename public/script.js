console.log("PIKACHU IS IN");
//////////////////////////////////////////////////////////////////////////
//                              ADD TODO                             //
//////////////////////////////////////////////////////////////////////////
let toggleDropdown = (event) => {
    console.log('you clicked the body!')
    let tempDiv = document.querySelector('.temp-div');
    let parent = event.target.parentElement;
    if (parent === tempDiv) {
        // do nothing
    } else {
        tempDiv.parentElement.removeChild(tempDiv);
        document.body.onclick='';
    }
}

let showCreateForm = (event) => {
    let newDiv = document.createElement('div');
        newDiv.classList.add('temp-div');
    let inputTitle = document.createElement('input');
        inputTitle.setAttribute('placeholder', 'title' );
        inputTitle.classList.add('newTitle');
    let inputDesc = document.createElement('input');
        inputDesc.setAttribute('placeholder', 'description');
        inputDesc.classList.add('newDesc');
    let newButton = document.createElement('button');
        newButton.textContent = 'Submit';
        newButton.classList.add('newButton');
        newButton.addEventListener('click', collectNewInput);

    newDiv.appendChild(inputTitle);
    newDiv.appendChild(inputDesc);
    newDiv.appendChild(newButton);
    let nextSibling = event.target.nextSibling;
    let parentDiv = event.target.parentElement;
        parentDiv.insertBefore(newDiv, nextSibling);

    setTimeout( () => {
        document.body.onclick = toggleDropdown;
    }, 500);
}

let collectNewInput = (event) => {
    let input1 = document.querySelector('.newTitle');
    let input2 = document.querySelector('.newDesc');
    let quadrant = event.target.parentElement.parentElement;
    let dataObj = {
        title: input1.value,
        desc: input2.value,
        quadrant: quadrant.dataset.id
    }
    addTodo( dataObj, quadrant );
    let parentDiv = event.target.parentElement;
    quadrant.removeChild(parentDiv);
}

let addTodo = (dataObj, quadrant) => {

    let request = new XMLHttpRequest();   // new HttpRequest instance
    let theUrl = `/todos/${dataObj.quadrant}/a-add`;

    request.addEventListener("load", function() {
        let parsed = JSON.parse(this.responseText);
        let newLi = document.createElement('li');
        let newCheckbox = document.createElement('input');
        newCheckbox.setAttribute('type', 'checkbox');
        newCheckbox.setAttribute('value', parsed[0].id);
        let newTag = document.createElement('A');
        newTag.setAttribute('href', `/todos/${parsed[0].id}`);
        newTag.innerHTML = parsed[0].title;
        newLi.appendChild(newCheckbox);
        newLi.appendChild(newTag);
        quadrant.lastChild.appendChild(newLi);
    });
    request.open("POST", theUrl);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(dataObj));
};

//////////////////////////////////////////////////////////////////////////
//                              EDIT TODO                             //
//////////////////////////////////////////////////////////////////////////

let showEditForm = (event) => {
    let newDiv = document.createElement('div');
    let inputTitle = document.createElement('input');
    inputTitle.setAttribute('placeholder', 'title' );
    inputTitle.classList.add('newTitle');
    let inputDesc = document.createElement('input');
    inputDesc.setAttribute('placeholder', 'description');
    inputDesc.classList.add('newDesc');
    let newButton = document.createElement('button');
    newButton.textContent = 'Submit';
    newButton.classList.add('newButton');
    newButton.addEventListener('click', collectNewInput);
    newDiv.appendChild(inputTitle);
    newDiv.appendChild(inputDesc);
    newDiv.appendChild(newButton);
    let parentDiv = event.target.parentElement;
    parentDiv.insertBefore(newDiv, parentDiv.childNodes[0]);
}

let collectEditedInput = (event) => {
    alert('you clicked me!');
    let input1 = document.querySelector('.newTitle');
    let input2 = document.querySelector('.newDesc');
    let quadrant = event.target.parentElement.parentElement;
    let dataObj = {
        title: input1.value,
        desc: input2.value,
        quadrant: quadrant.dataset.id
    }
    editTodo( dataObj, quadrant );

    // let parentDiv = event.target.parentElement;
    // quadrant.removeChild(parentDiv);
}

let editTodo = (dataObj, quadrant) => {

    let request = new XMLHttpRequest();   // new HttpRequest instance
    let theUrl = `/todos/${dataObj.quadrant}/ajax`;

    request.addEventListener("load", function() {
        let parsed = JSON.parse(this.responseText);
        let newDiv = document.createElement('div');
        let newCheckbox = document.createElement('input');
        newCheckbox.setAttribute('type', 'checkbox');
        newCheckbox.setAttribute('defaultValue', '1');
        newCheckbox.addEventListener('click', toggleTodoCheck); //on checked
        let newLink = document.createElement('A');
        newLink.setAttribute('href', `/todos/${parsed[0].id}`);
        newLink.innerHTML = parsed[0].title;
        newDiv.appendChild(newCheckbox);
        newDiv.appendChild(newLink);
        quadrant.appendChild(newDiv);
    });
    request.open("POST", theUrl);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(dataObj));
};

//////////////////////////////////////////////////////////////////////////
//                              DELETE TODO                             //
//////////////////////////////////////////////////////////////////////////

let checkDelete = (event) => {
    // let targetElement = event.target.nextSibling //element after event.target which is
    console.log("targetElement", targetElement);
    deleteTodo();
}

let deleteTodo = (dataObj, quadrant) => {

    let request = new XMLHttpRequest();   // new HttpRequest instance
    let theUrl = `/todos/${dataObj.quadrant}/ajax`;

    request.addEventListener("load", function() {
        let parsed = JSON.parse(this.responseText);
        let newDiv = document.createElement('div');
        let newCheckbox = document.createElement('input');
        newCheckbox.setAttribute('type', 'checkbox');
        newCheckbox.setAttribute('defaultValue', '1');
        newCheckbox.addEventListener('click', toggleTodoCheck); //on checked
        let newLink = document.createElement('A');
        newLink.setAttribute('href', `/todos/${parsed[0].id}`);
        newLink.innerHTML = parsed[0].title;
        newDiv.appendChild(newCheckbox);
        newDiv.appendChild(newLink);
        quadrant.appendChild(newDiv);
    });
    request.open("DELETE", theUrl);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(dataObj));
};

//////////////////////////////////////////////////////////////////////////
//                        TOGGLE TODO COMPLETED                         //
//////////////////////////////////////////////////////////////////////////
let timer;

let toggleTodo = (event) => {
    let next = event.target.nextSibling;
    let quadrant = event.target.parentElement.parentElement.parentElement;
    let dataObj = {
        quadrant: quadrant.dataset.id,
        todoId: event.target.value
    }
    if (event.target.checked === true) {
        // alert('correct!')
        next.classList.add('checked-todo');
    } else {
        // alert('wrong')
        next.classList.remove('checked-todo');
    }
    checkTodo(dataObj, event);
}

let checkTodo = (dataObj, event) => {
    let request = new XMLHttpRequest();   // new HttpRequest instance
    let theUrl = `/todos/${dataObj.quadrant}/a-check?_method=PUT`;

    request.addEventListener("load", function() {
        let windowURL = new URL(window.location.href);
        let searchParams = windowURL.searchParams.get('display');
        let result = JSON.parse(this.responseText);

        if (searchParams === 'completed') {
            if (!result.completed) {
                let list = event.target.parentElement;
                timer = setTimeout( () => {
                    list.style.display = 'none';
                }, 1000);
            } else {
                clearTimeout(timer);
            }
        } else {
            if (result.completed) {
                let list = event.target.parentElement;
                timer = setTimeout( () => {
                    list.style.display = 'none';
                }, 1000);
            } else {
                clearTimeout(timer);
            }
        }
    });
    request.open("POST", theUrl);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(dataObj));
}

//////////////////////////////////////////////////////////////////////////
//                        SET EVENT LISTENERS                           //
//////////////////////////////////////////////////////////////////////////

for (let i=0; i < 4; i++ ){
    if (document.querySelector('.button')) {
        let button = document.querySelectorAll('.button')[i];
        button.addEventListener('click', showCreateForm);
    }
    let bigList = document.querySelectorAll('.big-list')[i];
    bigList.addEventListener('click', toggleTodo);
}

//////////////////////////////////////////////////////////////////////////