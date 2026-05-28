let btn = document.querySelector("button");

let ul = document.querySelector("ul");

let inp = document.querySelector("input");

let taskCounter =
    document.querySelector("#task-counter");

let dailyCounter =
    document.querySelector("#daily-counter");

let prioritySelect =
    document.querySelector("#priority-select");

let filterButtons =
    document.querySelectorAll(".filter-btn");



// LOAD TASKS
window.addEventListener("load", loadTasks);



// CREATE TASK
function createTask(
    taskText,
    completed = false,
    priority = "Medium",
    time = "",
    completedDate = null
) {

    let item = document.createElement("li");

    if (completed) {
        item.classList.add("done");
    }

    item.setAttribute(
        "data-priority",
        priority
    );

    if (completedDate) {

        item.setAttribute(
            "data-completed-date",
            completedDate
        );
    }

    let currentTime =
        time || new Date().toLocaleTimeString();

    item.innerHTML = `

        <div class="task-info">

            <span class="task-text">
                ${taskText}
            </span>

            <small class="time">
                Added at: ${currentTime}
            </small>

        </div>

        <div class="actions">

            <span class="priority ${priority.toLowerCase()}">
                ${priority}
            </span>

            <button class="complete">
                ✔
            </button>

            <button class="edit">
                ✏
            </button>

            <button class="delete">
                🗑
            </button>

        </div>
    `;

    ul.appendChild(item);

    updateCounter();

    saveTasks();
}



// ADD TASK
btn.addEventListener("click", function () {

    let task =
        inp.value.trim();

    if (task === "") {

        alert("Please enter a task");

        return;
    }

    let priority =
        prioritySelect.value;

    createTask(
        task,
        false,
        priority
    );

    inp.value = "";
});



// ENTER KEY SUPPORT
inp.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            btn.click();
        }
    }
);



// EVENT DELEGATION
ul.addEventListener(
    "click",
    function(event){

        let target = event.target;

        let listItem =
            target.closest("li");



        // DELETE TASK
        if (
            target.classList.contains("delete")
        ) {

            listItem.remove();
        }



        // COMPLETE TASK
        else if (
            target.classList.contains("complete")
        ) {

            listItem.classList.toggle("done");

            if (
                listItem.classList.contains("done")
            ) {

                let today =
                    new Date().toLocaleDateString();

                listItem.setAttribute(
                    "data-completed-date",
                    today
                );
            }
            else {

                listItem.removeAttribute(
                    "data-completed-date"
                );
            }
        }



        // EDIT TASK
        else if (
            target.classList.contains("edit")
        ) {

            let textSpan =
                listItem.querySelector(".task-text");

            let updatedTask =
                prompt(
                    "Edit your task",
                    textSpan.innerText
                );

            if (
                updatedTask !== null &&
                updatedTask.trim() !== ""
            ) {

                textSpan.innerText =
                    updatedTask;
            }
        }

        updateCounter();

        saveTasks();
    }
);



// UPDATE COUNTER
function updateCounter() {

    let totalTasks =
        document.querySelectorAll("li").length;

    let completedTasks =
        document.querySelectorAll(".done").length;

    let pendingTasks =
        totalTasks - completedTasks;

    taskCounter.innerText =

        `Total: ${totalTasks} | Completed: ${completedTasks} | Pending: ${pendingTasks}`;



    // DAILY COMPLETED TASKS

    let today =
        new Date().toLocaleDateString();

    let dailyCompleted = 0;

    document.querySelectorAll("li")
    .forEach((task) => {

        if (
            task.getAttribute(
                "data-completed-date"
            ) === today
        ) {

            dailyCompleted++;
        }
    });

    dailyCounter.innerText =

        `Daily Completed Tasks: ${dailyCompleted}`;
}



// SAVE TASKS
function saveTasks() {

    let tasks = [];

    document.querySelectorAll("li")
    .forEach((li) => {

        tasks.push({

            text:
                li.querySelector(".task-text")
                .innerText,

            completed:
                li.classList.contains("done"),

            priority:
                li.getAttribute("data-priority"),

            time:
                li.querySelector(".time")
                .innerText,

            completedDate:
                li.getAttribute(
                    "data-completed-date"
                )
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}



// LOAD TASKS
function loadTasks() {

    let tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    tasks.forEach((task) => {

        createTask(
            task.text,
            task.completed,
            task.priority,
            task.time,
            task.completedDate
        );
    });

    updateCounter();
}



// FILTERS
filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            let filter =
                button.getAttribute(
                    "data-filter"
                );

            document.querySelectorAll("li")
            .forEach((task) => {

                switch(filter){

                    case "all":

                        task.style.display =
                            "flex";

                        break;

                    case "completed":

                        task.style.display =

                            task.classList.contains("done")
                            ? "flex"
                            : "none";

                        break;

                    case "pending":

                        task.style.display =

                            !task.classList.contains("done")
                            ? "flex"
                            : "none";

                        break;
                }
            });
        }
    );
});