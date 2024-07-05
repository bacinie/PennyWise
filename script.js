// Theme Change

const lightTheme = "light.css";
const darkTheme = "dark.css";
const sunIcon = "img/sun.png";
const moonIcon = "img/moon.png";
const themeIcon = document.getElementById("theme-icon");
const toast = document.getElementById("toast");

// Swaps the stylesheet to achieve dark mode.
function changeTheme() {
  const theme = document.getElementById("theme");
  setTimeout(() => {
    toast.innerHTML = "PennyWise";
  }, 1500);
  if (theme.getAttribute("href") === lightTheme) {
    theme.setAttribute("href", darkTheme);
    themeIcon.setAttribute("src", sunIcon);
    toast.innerHTML = "DarkMode🌙";
  } else {
    theme.setAttribute("href", lightTheme);
    themeIcon.setAttribute("src", moonIcon);
    toast.innerHTML = "LightMode☀️";
  }
}

// End of Theme
// Start of Calculator

const res = document.getElementById("result");

// Function to calculate the result
function calculate(value) {
  const calculatedValue = eval(value || null);
  if (isNaN(calculatedValue)) {
    res.value = "Can't divide 0 with 0";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  } else {
    res.value = calculatedValue;
  }
}

// Displays entered value on screen.
function liveScreen(enteredValue) {
  if (!res.value) {
    res.value = "";
  }
  res.value += enteredValue;
}

// Adding event handler to the specific input box
res.addEventListener("keydown", keyboardInputHandler);

// Function to handle keyboard inputs
function keyboardInputHandler(e) {
  // Prevent default behavior for enter and backspace keys
  e.preventDefault();

  // Numbers
  if (e.key >= "0" && e.key <= "9") {
    res.value += e.key;
  }

  // Operators
  if (["+","-","*","/"].includes(e.key)) {
    res.value += e.key;
  }

  // Decimal key
  if (e.key === ".") {
    res.value += ".";
  }

  // Press enter to see result
  if (e.key === "Enter") {
    calculate(res.value);
  }

  // Backspace for removing the last input
  if (e.key === "Backspace") {
    res.value = res.value.slice(0, -1);
  }
}

// Function to populate expense tracker with the result value
function populateExpenseTracker() {
  const resultValue = res.value;
  const expenseInput = document.getElementById("amount");
  expenseInput.value = resultValue;
}

// End of Calculator
// Start of Expense Manager

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const clearBtn = document.getElementById("clear-btn");

// Transactions
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Event Listeners
form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearHistory);
document.getElementById('amount').addEventListener('input', validateAmountInput);

// Initialize the App
Init();

// Functions

// Function to validate amount input (only allows negative sign and numeric values)
function validateAmountInput(e) {
  let value = e.target.value;
  if (/^-?\d*$/.test(value)) {
    e.target.dataset.lastValidValue = value;
  } else {
    e.target.value = e.target.dataset.lastValidValue || '';
  }
}

// Function to add a transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('please add text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

// Function to generate a random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Function to add transactions to the DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>&#8369;${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Function to update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerHTML = `&#8369;${total}`;
  money_plus.innerHTML = `+&#8369;${income}`;
  money_minus.innerHTML = `-&#8369;${expense}`;
}

// Function to remove a transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to initialize the app
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Function to clear transaction history
function clearHistory() {
  transactions = [];
  updateLocalStorage();
  Init();
}

// End of Expense Manager
// Start of Notes

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const closeBox = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("button");

// Months array for date formatting
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Notes array fetched from localStorage
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Function to display notes on the screen
const showNotes = () => {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let litag = `<li class="note">
                  <div class="details">
                    <p>${note.title}</p>
                    <span>${note.description}</span>
                  </div>
                  <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                      <i onclick="showMenu(this)">Settings</i>
                      <ul class="menu">
                        <li onclick="editNote(${index}, '${note.title}', '${note.description}')">Edit</li>
                        <li onclick="deleteNote(${index})">Delete</li>
                      </ul>
                    </div>
                  </div>
                </li>`;
    addBox.insertAdjacentHTML("afterend", litag);
  });
};

// Function to show menu
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.onclick = (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  };
}

// Function to delete a note
function deleteNote(noteId) {
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Function to edit a note
function editNote(noteId, title, description) {
  titleTag.value = title;
  descTag.value = description;
  addBox.click();
  deleteNote(noteId);
}

// Event listener to show the popup box
addBox.onclick = () => popupBox.classList.add("show");

// Event listener to close the popup box
closeBox.onclick = () => {
  titleTag.value = "";
  descTag.value = "";
  popupBox.classList.remove("show");
};

// Event listener to add a note
addBtn.onclick = (e) => {
  e.preventDefault();
  let ti = titleTag.value;
  let desc = descTag.value;
  let currentDate = new Date();
  let month = months[currentDate.getMonth()];
  let day = currentDate.getDate();
  let year = currentDate.getFullYear();
  let noteInfo = {
    title: ti,
    description: desc,
    date: `${day} ${month} ${year}`
  };
  notes.push(noteInfo);
  localStorage.setItem("notes", JSON.stringify(notes));
  closeBox.click();
  showNotes();
};

// Display notes when the page loads
showNotes();

// End of Notes

function saveTransaction() {
  const currentDate = new Date();
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const description = `Transaction: ` + money_plus + ' Exepenses: ' + money_minus;
  const noteInfo = {
    title: "New Transaction",
    description: description,
    date: `${day} ${month} ${year}`
  };
  notes.push(noteInfo);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Adding event listener to the button
document.getElementById("save-transaction-btn").addEventListener("click", saveTransaction);