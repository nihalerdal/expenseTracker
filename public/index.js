let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

import { showExpenses, handleExpenses } from "./expenses.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleExpenses();
  handleRegister();
  handleAddEdit();

  if (token) {
    showExpenses();
  } else {
    showLoginRegister();
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");
    if (!id || !token) return;

    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const res = await fetch(`/api/v1/expenses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          document.getElementById("message").textContent =
            "Expense deleted successfully.";
          showExpenses(); 
        } else {
          const data = await res.json();
          document.getElementById("message").textContent =
            data.msg || "Delete failed.";
        }
      } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "An error occurred.";
      }
    }
  }
});
