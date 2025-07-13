document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded. Loading tasks...");
  loadTasks();
});

// Function to fetch tasks from PHP backend
function loadTasks() {
  fetch("/Backend/get_tasks.php")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((tasks) => {
      console.log("Tasks loaded:", tasks);
      const container = document.getElementById("task-container");
      container.innerHTML = "";

      tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        taskDiv.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Deadline: ${task.deadline}</p>
          <label>Status:
            <select data-id="${task.id}">
              <option ${
                task.status === "Pending" ? "selected" : ""
              }>Pending</option>
              <option ${
                task.status === "In Progress" ? "selected" : ""
              }>In Progress</option>
              <option ${
                task.status === "Completed" ? "selected" : ""
              }>Completed</option>
            </select>
          </label>
        `;

        container.appendChild(taskDiv);
      });

      attachStatusListeners();
    })
    .catch((error) => console.error("Error loading tasks:", error));
}

// Attach change event to each dropdown
function attachStatusListeners() {
  const selects = document.querySelectorAll("select[data-id]");
  selects.forEach((select) => {
    select.addEventListener("change", function () {
      const taskId = this.dataset.id;
      const newStatus = this.value;
      updateTaskStatus(taskId, newStatus);
    });
  });
}

// Function to update status
function updateTaskStatus(taskId, status) {
  console.log(`Updating status of task ${taskId} to "${status}"`);
  fetch("/Backend/update_task.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `task_id=${taskId}&status=${status}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(`Task ${taskId} status updated to "${status}"`);
        alert("Task status updated!");
      } else {
        console.warn(`Failed to update task ${taskId}:`, data.error);
        alert("Failed to update status.");
      }
    })
    .catch((error) => console.error("Error updating status:", error));
}

// Handle form submission
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  console.log(
    "Submitting new task:",
    Object.fromEntries(formData.entries())
  );

  fetch("/Backend/create_task.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log("Server response on create:", data);
      if (data.success) {
        alert("Task added successfully!");
        loadTasks();
        this.reset();
      } else {
        alert("Error: " + data.error);
        console.warn("Task creation failed:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error adding task:", error);
      alert("Failed to connect to server when adding task.");
    });
});
// Show/hide the form when the button is clicked
document.getElementById("show-form-btn").addEventListener("click", function() {
  const form = document.getElementById("task-form");
  form.classList.toggle("hidden");
});
