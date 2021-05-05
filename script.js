"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const renderMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach((element, index) => {
    const movType = element > 0 ? "deposit" : "withdrawal";

    const rowHtml = `<div class="movements__row">
      <div class="movements__type movements__type--${movType}">${index} ${movType}</div>
      <div class="movements__value">${element}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", rowHtml);
  });
};

function createUsername(arr) {
  arr.forEach((el) => {
    const toLowerArr = el.owner.toLowerCase().split(" ");
    el.username = toLowerArr.map((el) => el[0]).join("");
  });
}

createUsername(accounts);
console.log(accounts);

renderMovements(movements);

const calcAndDisplayBalance = function (arr) {
  const balance = arr.reduce((acc, el) => acc + el, 0);

  labelBalance.innerText = `${balance} €`;
};

calcAndDisplayBalance(account1.movements);

const calcAndDisplaySum = function (arr) {
  const income = arr.filter((el) => el > 0).reduce((acc, el) => acc + el, 0);

  labelSumIn.innerText = `${income} €`;
};

const calcAndDisplayOut = function (arr) {
  const outcome = arr.filter((el) => el < 0).reduce((acc, el) => acc + el, 0);

  labelSumOut.innerText = `${Math.abs(outcome)} €`;
};

const calcAndDisplayInterest = (arr) => {
  const interest = arr
    .filter((el, i, arr) => el > 0)
    .map((el) => (el * 1.2) / 100)
    .filter((el) => el > 1)
    .reduce((acc, el) => acc + el, 0);
  console.log(interest);
  labelSumInterest.innerText = `${interest} €`;
};

calcAndDisplaySum(account1.movements);
calcAndDisplayOut(account1.movements);
calcAndDisplayInterest(account1.movements);
