const add_btn = document.querySelector(".add_btn");
let bFlag = false;
const txtCont = document.querySelector(".txt-cont");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
let defaultPriorityColor = "gray";
let colors = ["lightcoral", "lightskyblue", "lightgoldenrodyellow", "gray"];
const colorPriorElements = document.querySelectorAll(".color_prior .color");
let tickArrays = [];

if(localStorage.getItem("notewise")){
    tickArrays = JSON.parse(localStorage.getItem("notewise"));
}
tickArrays.forEach((tickObj) => {
    createTicket(tickObj.tickColor, tickObj.tickTask, tickObj.tickID);
})

for (let i = 0; i < colorPriorElements.length; i++) {
    colorPriorElements[i].addEventListener("click", (e) => {
        let currPriorEle = colorPriorElements[i].classList[0];
        let filTick = tickArrays.filter((tickObj, idx) => {
            return currPriorEle === tickObj.tickColor;
        });
        console.log(filTick);
        let alltickCont = document.querySelectorAll(".task-cont");
        for (let i = 0; i < alltickCont.length; i++) {
            alltickCont[i].remove();
        }

        filTick.forEach((tickObj, idx) => {
            createTicket(tickObj.tickColor, tickObj.tickTask, tickObj.tickID);
        });

    })

    colorPriorElements[i].addEventListener("dblclick", (e) => {
        let alltickCont = document.querySelectorAll(".task-cont");
        for (let i = 0; i < alltickCont.length; i++) {
            alltickCont[i].remove();
        }

        tickArrays.forEach((tickObj, idx) => {
            createTicket(tickObj.tickColor, tickObj.tickTask, tickObj.tickID);
        })
    })
}

document.addEventListener("DOMContentLoaded", function () {
    const colorElements = document.querySelectorAll(".p-color");
    const defaultBorderElement = document.querySelector(".c-gray");
    defaultBorderElement.classList.add("border");
    colorElements.forEach((colorElement) => {
        colorElement.addEventListener("click", () => {
            colorElements.forEach((el) => {
                el.classList.remove("border");
            });
            colorElement.classList.add("border");
            defaultPriorityColor = colorElement.classList[0];
        });
    });
});

function setDefaultBorderColor() {
    const colorElements = document.querySelectorAll(".p-color");
    const defaultBorderElement = document.querySelector(".c-gray");
    colorElements.forEach((el) => {
        el.classList.remove("border");
    });
    defaultBorderElement.classList.add("border");
    defaultPriorityColor = "gray";
}

add_btn.addEventListener("click", (e) => {
    bFlag = !bFlag;
    if (bFlag) {
        modalCont.style.display = "flex";
        setDefaultBorderColor();
        setTimeout(() => {
            modalCont.classList.add("modal-show");
        }, 50);
    } else {
        modalCont.classList.remove("modal-show");
        setTimeout(() => {
            modalCont.style.display = "none";
        }, 300);
    }
});

modalCont.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "Shift") {
        createTicket(defaultPriorityColor, txtCont.value);
        modalCont.style.display = "none";
        bFlag = false;
        txtCont.value = "";
    }
});

modalCont.addEventListener("click", (event) => {
    if (event.target === modalCont) {
        modalCont.classList.remove("modal-show");
        setTimeout(() => {
            modalCont.style.display = "none";
        }, 300);
    }
});

function createTicket(tickColor, tickTask, tickID) {
    let id = tickID || shortid();

    let newTicket = document.createElement("div");
    newTicket.setAttribute("class", "task-cont");
    newTicket.style.backgroundColor = tickColor;
    newTicket.innerHTML = `
        <div class="color-bar lockDiv">
            <i class="lock fa-solid fa-lock lockIcon"></i>
        </div>
        <div class="task-id">#${id}</div>
        <div class="task-text">${tickTask}</div>               
    `;
    mainCont.appendChild(newTicket);

    if (!tickID) {
        tickArrays.push({ tickColor, tickTask, tickID: id });
        localStorage.setItem("notewise", JSON.stringify(tickArrays));
    }
    const initialColorIndex = colors.indexOf(tickColor);
    newTicket.dataset.colorIndex = initialColorIndex;

    let tickIdIdx = getIdIdx(id);

    newTicket.addEventListener("click", () => {
        remTicket(newTicket, id);
    });
    handleLock(newTicket, id);

    newTicket.querySelector(".color-bar").addEventListener("click", (e) => {
        const colorIndex = parseInt(newTicket.dataset.colorIndex);
        const nextColorIndex = (colorIndex + 1) % colors.length;
        const nextColor = colors[nextColorIndex];
        newTicket.style.backgroundColor = nextColor;
        newTicket.dataset.colorIndex = nextColorIndex;
        tickArrays[tickIdIdx].tickColor = nextColor;
        localStorage.setItem("notewise", JSON.stringify(tickArrays));
    });
}

function getIdIdx(id) {
    let idIdx = tickArrays.findIndex((tickObj) => {
        return tickObj.tickID === id;
    })

    return idIdx;
}

let remFlag = false;
const rmTicket = document.querySelector(".rm_btn").children[0];

rmTicket.addEventListener("click", (e) => {
    remFlag = !remFlag;
})

function remTicket(ticket, id) {
    if (!remFlag) return;
    let idx = getIdIdx(id);
    tickArrays.splice(idx, 1);
    localStorage.setItem("notewise", JSON.stringify(tickArrays));
    ticket.remove();

}

const lock = "fa-lock";
const unlock = "fa-lock-open";

const trashIcon = document.getElementById("trash");

trashIcon.addEventListener("click", () => {
    trashIcon.classList.toggle("trash-toggled");
});

function handleLock(ticket, id) {
    let lockTick = ticket.querySelector(".lock");
    let taskTick = ticket.querySelector(".task-text");
    lockTick.addEventListener("click", (e) => {
        let tickIdIdx = getIdIdx(id);
        e.stopPropagation();

        if (lockTick.classList.contains(lock)) {
            lockTick.classList.remove(lock);
            lockTick.classList.add(unlock);
            taskTick.setAttribute("contenteditable", "true");
        } else {
            lockTick.classList.remove(unlock);
            lockTick.classList.add(lock);
            taskTick.setAttribute("contenteditable", "false");
        }
        tickArrays[tickIdIdx].tickTask = taskTick.innerText;
        localStorage.setItem("notewise", JSON.stringify(tickArrays));
    });
}