document.addEventListener("DOMContentLoaded", () => {
  console.log("User dashboard loaded.");

  // Extract user_id from URL query
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");

  if (!userId) {
    alert("No user ID provided in URL.");
    return;
  }

  loadUserTasks(userId);
});

function loadUserTasks(userId) {
  fetch(`/Backend/get_user_tasks.php?user_id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        alert("" + data.error);
        return;
      }

      const container = document.getElementById("tasks-container");
      container.innerHTML = "";

      if (data.tasks.length === 0) {
        container.innerHTML = "<p>No tasks assigned.</p>";
        return;
      }

      data.tasks.forEach((task) => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p><strong>Deadline:</strong> ${task.deadline}</p>
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
        container.appendChild(div);
      });

      attachStatusListeners();
    })
    .catch((err) => {
      console.error("Error fetching tasks:", err);
      alert("Failed to load tasks.");
    });
}

function attachStatusListeners() {
  document.querySelectorAll("select[data-id]").forEach((select) => {
    select.addEventListener("change", function () {
      const taskId = this.dataset.id;
      const newStatus = this.value;
      updateTaskStatus(taskId, newStatus);
    });
  });
}

function updateTaskStatus(taskId, status) {
  fetch("/Backend/update_task.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `task_id=${taskId}&status=${status}`
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Task status updated!");
      } else {
        alert("" + data.error);
      }
    })
    .catch((err) => {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    });
}

// Get user_id (from URL or sessionStorage)
const params = new URLSearchParams(window.location.search);
let userId = params.get("user_id");
if (!userId) {
  userId = sessionStorage.getItem("user_id");
}
if (!userId) {
  alert("No user ID found. Please log in again.");
  window.location.href = "login.html";
} else {
  console.log("Loaded dashboard for user ID:", userId);

  // Fetch user info to get email
  fetch("/Backend/get_user.php?user_id=" + encodeURIComponent(userId))
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("user-name").textContent = data.user.name;
      } else {
        console.error("Error fetching user info:", data.error);
      }
    })
    .catch(err => console.error("Error fetching user info:", err));
}