import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExpenses } from "./expenses.js";

let addEditDiv = null;
let title = null;
let amount = null;
let date = null;
let description = null;
let mainCategory = null;
let subCategory = null;
let addingExpense = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-expense");
  title = document.getElementById("title");
  amount = document.getElementById("amount");
  date = document.getElementById("date");
  description = document.getElementById("description");
  mainCategory = document.getElementById("mainCategory");
  subCategory = document.getElementById("subCategory");
  addingExpense = document.getElementById("adding-expense");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingExpense) {
        enableInput(false);

        const expenseData = {
          title: title.value,
          amount: Number(amount.value),
          date: date.value || null,
          description: description.value,
          mainCategory: mainCategory.value,
          subCategory: subCategory.value,
        };

        let method = "POST";
        let url = "/api/v1/expenses";
        const expenseId = addEditDiv.dataset.id;

        if (addingExpense.textContent.toLowerCase().includes("update")) {
          method = "PATCH";
          url = `/api/v1/expenses/${expenseId}`;
        }

        try {
          const res = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(expenseData),
          });

          const result = await res.json();

          if (res.status === 200 || res.status === 201) {
            message.textContent =
              res.status === 200
                ? "The expense entry was updated."
                : "The expense entry was created.";

            // Reset form after successful add/edit
            title.value = "";
            amount.value = "";
            date.value = "";
            description.value = "";
            mainCategory.value = "";
            subCategory.value = "";
            addEditDiv.dataset.id = "";

            showExpenses();
          } else {
            message.textContent = result.msg || "Failed to save expense.";
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        addEditDiv.dataset.id = ""; // Clear ID on cancel
        showExpenses();
      }
    }
  });
};

export const showAddEdit = async (expenseId) => {
  message.textContent = "";

  if (!expenseId) {
    // Add mode
    title.value = "";
    amount.value = "";
    date.value = "";
    description.value = "";
    mainCategory.value = "";
    subCategory.value = "";
    addingExpense.textContent = "Add Expense";
    addEditDiv.dataset.id = "";
    setDiv(addEditDiv);
  } else {
    // Edit mode
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/expenses/${expenseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const exp = data.expense;
        title.value = exp.title || "";
        amount.value = exp.amount || "";
        date.value = exp.date?.slice(0, 10) || "";
        description.value = exp.description || "";
        mainCategory.value = exp.mainCategory || "";
        subCategory.value = exp.subCategory || "";

        addingExpense.textContent = "Update Expense";
        addEditDiv.dataset.id = expenseId;
        setDiv(addEditDiv);
      } else {
        message.textContent = "The expense entry was not found.";
        showExpenses();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
      showExpenses();
    }

    enableInput(true);
  }
};
