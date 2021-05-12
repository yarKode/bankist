/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

const renderMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = "";

  const movs = sorted
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : movements;

  movs.forEach((element, index) => {
    const movType = element > 0 ? "deposit" : "withdrawal";

    const rowHtml = `<div class="movements__row">
      <div class="movements__type movements__type--${movType}">${index} ${movType}</div>
      <div class="movements__value">${element.toFixed(2)}€</div>
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

const calcAndDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, el) => acc + el, 0);
  acc.balance = +balance;

  labelBalance.innerText = `${balance.toFixed(2)} €`;
};

const calcAndDisplaySum = function (arr) {
  const income = arr.filter((el) => el > 0).reduce((acc, el) => acc + el, 0);

  labelSumIn.innerText = `${income.toFixed(2)} €`;
};

const calcAndDisplayOut = function (arr) {
  const outcome = arr.filter((el) => el < 0).reduce((acc, el) => acc + el, 0);

  labelSumOut.innerText = `${outcome.toFixed(2)} €`;
};

const calcAndDisplayInterest = ({ movements: arr, interestRate }) => {
  const interest = arr
    .filter((el, i, arr) => el > 0)
    .map((el) => (el * interestRate) / 100)
    .filter((el) => el > 1)
    .reduce((acc, el) => acc + el, 0);
  console.log(interest);
  labelSumInterest.innerText = `${interest.toFixed(2)} €`;
};

function updateUI(acc) {
  if (acc) {
    renderMovements(acc.movements);
    calcAndDisplayBalance(acc);
    calcAndDisplaySum(acc.movements);
    calcAndDisplayOut(acc.movements);
    calcAndDisplayInterest(acc);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.innerText = "Sign in to continue";
    containerMovements.innerHtml = "";
  }
}
let currentAccount;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find((acc) => {
    return (
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
    );
  });

  inputLoginUsername.value = inputLoginPin.value = "";

  inputLoginPin.blur();

  if (currentAccount) {
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    labelWelcome.innerText = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
  } else {
    labelWelcome.innerText = "Wrong credentials";
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value.trim());
  const recepient = inputTransferTo.value.trim().toLowerCase();
  if (
    recepient &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    recepient !== currentAccount.username
  ) {
    const accReceiver = accounts.find((acc) => acc.username === recepient);

    if (accReceiver) {
      accReceiver.movements.push(amount);
      currentAccount.movements.push(-amount);
      updateUI(currentAccount);

      inputTransferTo.innerText = "";
      inputTransferAmount.innerText = "";
      inputTransferAmount.blur();
    } else {
      console.log(`recepient is not found`);
    }
  } else {
    console.log(
      `Some of parameters in not valid: please check recepient is not empty, amount is not empty and is not bigger your balance ${recepient} ${amount} ${currentAccount.username}`
    );
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  const specifiedUsername = inputCloseUsername.value.trim().toLowerCase();
  const specifiedPin = Number(inputClosePin.value.trim().toLowerCase());

  if (
    specifiedUsername === currentAccount.username &&
    specifiedPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === specifiedUsername
    );

    accounts.splice(index, 1);
    currentAccount = null;

    updateUI(currentAccount);

    containerApp.style.opacity = 0;
  } else {
    console.log(`Specified credentials are not correct`);
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value.trim());
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov / 0.1 > loanAmount)
  ) {
    currentAccount.movements.push(loanAmount);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    updateUI(currentAccount);
  } else {
    console.log(loanAmount);
  }
});

btnSort.addEventListener("click", () => {
  currentAccount.sorted = !currentAccount.sorted || false;

  renderMovements(currentAccount.movements, currentAccount.sorted);
});
