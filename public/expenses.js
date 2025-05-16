import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let expensesDiv = null;
let expensesTable = null;
let expensesTableHeader = null;

export const handleExpenses = () => {
  expensesDiv = document.getElementById("expenses");
  const logoff = document.getElementById("logoff");
  const addExpense = document.getElementById("add-expense");
  expensesTable = document.getElementById("expenses-table");
  expensesTableHeader = document.getElementById("expenses-table-header");

  expensesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addExpense) {
        showAddEdit(null); 
      } else if (e.target === logoff) {
        showLoginRegister(); 
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

export const showExpenses = async () => {
  setDiv(expensesDiv);

  try {
    const res = await fetch("/api/v1/expenses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.msg || "Failed to load expenses.";
      return;
    }

    renderExpenses(data.expenses);
  } catch (err) {
    message.textContent = "Server error.";
  }
};

const renderExpenses = (expenses) => {
  expensesTable.innerHTML = "";

  if (!expenses.length) {
    expensesTable.innerHTML = "<tr><td colspan='6'>No expenses found</td></tr>";
    return;
  }

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${expense.amount}</td>
      <td>${
        expense.date ? new Date(expense.date).toLocaleDateString() : ""
      }</td>
      <td>${expense.mainCategory}</td>
      <td>${expense.subCategory}</td>
      <td>
        <button class="editButton" data-id="${expense._id}">Edit</button>
        <button class="delete-button" data-id="${expense._id}">Delete</button>
      </td>
    `;

    expensesTable.appendChild(row);
  });
};
