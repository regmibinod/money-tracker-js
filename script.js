// Selecting DOM elements
const balance = document.getElementById("balance"); // Element to display total balance
const income = document.getElementById("income"); // Element to display total income
const expense = document.getElementById("expense"); // Element to display total expenses
const transactionList = document.getElementById("transaction-list"); // List of transactions
const form = document.getElementById("transaction-form"); // Transaction form
const text = document.getElementById("text"); // Input field for transaction name
const amount = document.getElementById("amount"); // Input field for transaction amount

// Retrieve stored transactions from localStorage (if any)
const localStorageTransactions = JSON.parse(localStorage.getItem("localStorageTransactions"));


// If there are transactions in localStorage, use them; otherwise, start with an empty array
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Get transaction name and amount from input fields
  const inputTName = text.value.trim(); // Remove extra spaces
  const inputTAmount = +amount.value.trim(); // Convert input to a number

  // Create a transaction object with a unique ID
  const transaction = {
    id: Math.floor(Math.random() * 1000), // Generate a random ID
    text: inputTName, // Transaction name
    amount: inputTAmount, // Transaction amount
  };

  transactions.push(transaction); // Add transaction to the array

  // Clear input fields after submission
  text.value = "";
  amount.value = "";

  // Save updated transactions to localStorage
  saveDataToLocalStorage();

  // Reload transaction list and update values
  loadTransaction();
}

// Function to load and display transactions
function loadTransaction() {
  transactionList.innerHTML = ""; // Clear the transaction list before adding new ones

  // Loop through each transaction and create list items
  transactions.forEach((item) => {
    const li = document.createElement("li"); // Create a new list item
    li.innerHTML = `${item.text} <span class="delete" data-id=${item.id}> X</span>`; // Display transaction name and delete button
    transactionList.appendChild(li); // Append to the transaction list

    // Add class based on transaction type (income or expense)
    li.classList.add(`${item.amount > 0 ? "plus" : "minus"}`);
  });

  // Function to update balance, income, and expense
  function updateValues() {
    const amountArray = transactions.map((amt) => amt.amount); // Extract transaction amounts into an array

    // Calculate total balance
    const totalBalance = amountArray.reduce(
      (total, currentValue) => total + currentValue,
      0
    );

    // Calculate total income (positive amounts)
    const incomeBalance = amountArray
      .filter((amount) => amount > 0)
      .reduce((acc, currentValue) => acc + currentValue, 0);

    // Calculate total expenses (negative amounts)
    const expenseBalance = amountArray
      .filter((amount) => amount < 0)
      .reduce((acc, currentValue) => acc + currentValue, 0);

    // Update the UI with the calculated values
    balance.textContent = `$ ${totalBalance.toFixed(2)}`;
    income.textContent = `$ ${incomeBalance.toFixed(2)}`;
    expense.textContent = `$ ${Math.abs(expenseBalance).toFixed(2)}`;

    // Apply styling to balance based on positive or negative value
    balance.classList.add(`${totalBalance > 0 ? "plus" : "minus"}`);
  }

  updateValues(); // Call function to update displayed values
}

// Function to delete a transaction
function deleteTransaction(e) {
  const id = +e.target.dataset.id; // Get transaction ID from clicked element

  // Check if the clicked element has the 'delete' class
  if (e.target.classList.contains("delete")) {
    // Remove the transaction with the matching ID
    transactions = transactions.filter((item) => {
      return item.id !== id;
    });
  }

  // Save the updated transactions to localStorage
  saveDataToLocalStorage();

  // Reload transaction list and update values
  loadTransaction();
}

// Event listeners for form submission and delete button clicks
form.addEventListener("submit", addTransaction);
transactionList.addEventListener("click", deleteTransaction);

// Load transactions on page load
loadTransaction();

// Function to save transactions to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("localStorageTransactions", JSON.stringify(transactions));
}
