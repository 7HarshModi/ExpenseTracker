// Get DOM elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');

// Get transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize the app
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
    const sign = transaction.type === 'income' ? '+' : '-';
    const item = document.createElement('div');
    item.classList.add('transaction', transaction.type);
    
    item.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-date">${transaction.date}</div>
        </div>
        <div class="transaction-amount">${sign}₹${Math.abs(transaction.amount).toFixed(2)}</div>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    `;
    
    transactionList.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => 
        transaction.type === 'income' ? transaction.amount : -transaction.amount
    );
    
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1)
        .toFixed(2);
    
    balanceEl.innerText = `₹${total}`;
    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${expense}`;
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Add new transaction
function addTransaction(e) {
    e.preventDefault();
    
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }
    
    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: new Date().toLocaleDateString()
    };
    
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    
    // Clear form
    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'expense';
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
form.addEventListener('submit', addTransaction);

// Initialize app
init(); 