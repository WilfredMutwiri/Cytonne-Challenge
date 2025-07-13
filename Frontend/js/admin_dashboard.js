document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin page loaded.");
  loadUsers();
  loadTasks();

  document
    .getElementById("create-task-form")
    .addEventListener("submit", handleCreateTask);

  document
    .getElementById("create-user-form")
    .addEventListener("submit", handleCreateUser);
});

/**
 * Load all users and populate the table and the task assignment dropdown
 */
function loadUsers() {
  fetch("/Backend/get_users.php")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((users) => {
      console.log("Users loaded:", users);
      const tbody = document.querySelector("#users-table tbody");
      const userSelect = document.querySelector(
        "#create-task-form select[name='user_id']"
      );
      tbody.innerHTML = "";
      userSelect.innerHTML = '<option value="">-- Select User --</option>';

      users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button class="edit-user btn-orange" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}" data-role="${user.role}">Edit</button>
            <button class="delete-user btn-red" data-id="${user.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);

        userSelect.innerHTML += `<option value="${user.id}">${user.name} (${user.email})</option>`;
      });

      // Attach event listeners
      tbody.querySelectorAll(".delete-user").forEach((btn) => {
        btn.addEventListener("click", handleDeleteUser);
      });
      tbody.querySelectorAll(".edit-user").forEach((btn) => {
        btn.addEventListener("click", handleEditUser);
      });
    })
    .catch((err) => console.error("Error loading users:", err));
}

/**
 * Create a new user
 */
function handleCreateUser(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  console.log("Creating user:", Object.fromEntries(formData.entries()));

  fetch("/Backend/create_user.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("User created successfully!");
        form.reset();
        loadUsers();
      } else {
        alert(data.error || "Failed to create user.");
      }
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      alert("Could not connect to server.");
    });
}

/**
 * Delete a user
 */
function handleDeleteUser(e) {
  const userId = e.target.dataset.id;
  if (!confirm("Are you sure you want to delete this user?")) return;

  const formData = new FormData();
  formData.append("id", userId);

  fetch("/Backend/delete_user.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("User deleted successfully!");
        loadUsers();
      } else {
        alert(data.error || "Failed to delete user.");
      }
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      alert("Could not connect to server.");
    });
}

/**
 * Edit a user (prompt and update)
 */
function handleEditUser(e) {
  const btn = e.target;
  const userId = btn.dataset.id;
  const oldName = btn.dataset.name;
  const oldEmail = btn.dataset.email;
  const oldRole = btn.dataset.role;

  const newName = prompt("Edit name:", oldName);
  if (!newName) return;

  const newEmail = prompt("Edit email:", oldEmail);
  if (!newEmail) return;

  const newRole = prompt("Edit role (user/admin):", oldRole);
  if (!newRole || !["user", "admin"].includes(newRole)) {
    alert("Invalid role.");
    return;
  }

  const newPassword = prompt("New password (leave blank to keep unchanged):");

  const formData = new FormData();
  formData.append("id", userId);
  formData.append("name", newName);
  formData.append("email", newEmail);
  formData.append("role", newRole);
  if (newPassword) {
    formData.append("password", newPassword);
  }

  fetch("/Backend/update_user.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("User updated successfully!");
        loadUsers();
      } else {
        alert(data.error || "Failed to update user.");
      }
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      alert("Could not connect to server.");
    });
}

/**
 * Load all tasks
 */
function loadTasks() {
  fetch("/Backend/get_tasks.php")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((tasks) => {
      console.log("Tasks loaded:", tasks);
      const tbody = document.querySelector("#tasks-table tbody");
      tbody.innerHTML = "";
      tasks.forEach((task) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td>${task.deadline}</td>
          <td>${task.status}</td>
          <td>${task.user_name || "Unassigned"}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((err) => console.error("Error loading tasks:", err));
}

/**
 * Create a new task
 */
function handleCreateTask(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  console.log("Creating task:", Object.fromEntries(formData.entries()));

  fetch("/Backend/create_task.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Task created successfully!");
        form.reset();
        loadTasks();
      } else {
        alert(data.error || "Failed to create task.");
      }
    })
    .catch((err) => {
      console.error("Error creating task:", err);
      alert("Could not connect to server.");
    });
}

/**
 * Load admin user info to display name
 */
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
  fetch("/Backend/get_user.php?user_id=" + encodeURIComponent(userId))
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("user-name").textContent = data.user.name;
      } else {
        console.error("Error fetching user info:", data.error);
      }
    })
    .catch((err) => console.error("Error fetching user info:", err));
}
