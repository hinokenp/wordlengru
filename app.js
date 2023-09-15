import { WORDS_EN } from "./src/en-word-list.js";
import { WORDS_RU } from "./src/ru-word-list.js";

let arrayLineLetter = Array.from(document.querySelectorAll(".main-content__line-letter"));
let arrayLineLetterTemp = Array.from(document.querySelectorAll(".main-content__line-letter"));
let arrayBtn = Array.from(document.querySelectorAll(".main-keyboard__button"));
let langBtn = document.querySelector(".language-btn");
let statisticBtn = document.querySelector(".statistic-btn");
let alertWindow = document.querySelector(".alert");
let statisticWindow = document.querySelector(".statistic-window");
let alertMessage = document.querySelectorAll(".alert__message");
let alertWord = document.getElementById("alert__correct-word");
let alertLang = document.getElementById("alert__lang");
let ruLetters = document.querySelectorAll(".main-keyboard__button-hidden");

const LETTER_TRUE = "rgb(2, 244, 2)";
const LETTER_FALSE = "rgb(160, 160, 160)";
const LETTER_AVAILABLE = "rgb(238, 238, 16)";

const engLettersArr = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];
const ruLettersArr = [
  "й",
  "ц",
  "у",
  "к",
  "е",
  "н",
  "г",
  "ш",
  "щ",
  "з",
  "х",
  "ъ",
  "ф",
  "ы",
  "в",
  "а",
  "п",
  "р",
  "о",
  "л",
  "д",
  "ж",
  "э",
  "я",
  "ч",
  "с",
  "м",
  "и",
  "т",
  "ь",
  "б",
  "ю",
];

const statistic = {};

let currentLang = WORDS_RU;
let tempCurrenLang = "ru";
let letterIndex = 0;
let letterIndexMin = 0;
let letterIndexMax = 5;
let wordAsArr = [];
let wordRandAsString = randomWordFromArr(currentLang);
let objectLetters = {};
let wordRandAsArr = wordRandAsString.split("");

wordRandAsArr.forEach((element) => {
  objectLetters[element] = (objectLetters[element] || 0) + 1;
});
// console.log(objectLetters);

function randomWordFromArr(arr) {
  const ARR_MIN = 0;
  const ARR_MAX = arr.length;
  const randInex = ARR_MIN + Math.random() * (ARR_MAX + 1 - ARR_MIN);

  console.log(Math.floor(randInex));
  console.log(arr[Math.floor(randInex)]);
  return arr[Math.floor(randInex)];
}

function editLetter(event) {
  if (alertWindow.style.display === "none" && statisticWindow.style.display === "none") {
    if (event.type === "keydown") {
      if (event.key === "Backspace" || event.key === "Delete") {
        deleteLetter();
      }

      if (/^[А-Яа-яA-Za-z]/.test(event.key) && letterIndex < 5 && event.key.length === 1) {
        addLetter(event);
      }

      if (event.key === "Enter") {
        pressEnter();
      }
    }
    if (event.type === "click") {
      if (event.target.innerHTML === "delete") {
        deleteLetter();
      }

      if (letterIndex < 5 && event.target.innerHTML !== "delete" && event.target.innerHTML !== "enter") {
        addLetter(event);
      }

      if (event.target.innerHTML === "enter") {
        pressEnter();
      }
    }
  }
}

function deleteLetter() {
  if (letterIndex > 0) {
    letterIndex--;
    arrayLineLetter[letterIndex].innerHTML = "";
    wordAsArr.pop();
  }
}

function addLetter(event) {
  arrayLineLetter[letterIndex].innerHTML = event.key || event.target.innerHTML;
  wordAsArr.push(arrayLineLetter[letterIndex].innerHTML);
  letterIndex++;
}

function pressEnter() {
  let wordAsString = wordAsArr.join("").toLowerCase();

  if (letterIndex < 5) {
    alert("Введите слово");
  } else {
    if (currentLang.includes(wordAsString)) {
      if (wordAsString === wordRandAsString) {
        alertWindow.style.display = "block";
        checkLetterForCorrect(wordAsArr);
        alertMessage[0].innerHTML = "Правильно!";
        alertMessage[0].style.color = "#0bc829";
        alertWord.innerHTML = wordRandAsString;
        alertLang.innerHTML = tempCurrenLang;
      } else {
        checkLetterForCorrect(wordAsArr);
        alertMessage[0].innerHTML = "Не правильно!";
        alertMessage[0].style.color = "#CD1A1A";
        alertWord.innerHTML = wordRandAsString;
        alertLang.innerHTML = tempCurrenLang;
      }

      arrayLineLetter.splice(0, 5);
      letterIndex = 0;
      wordAsArr = [];

      if (arrayLineLetter.length === 0) {
        alertWindow.style.display = "block";
      }
    } else {
      alert("Слово отсутствует в библиотеке");
    }
  }
}

function checkLetterForCorrect(wordFromUser) {
  let localObjectLetters = { ...objectLetters };

  for (let i = 0; i < wordFromUser.length; i++) {
    arrayLineLetter[i].classList.add("letter_false");
    for (let j = 0; j < arrayBtn.length; j++) {
      if (wordFromUser.includes(arrayBtn[j].innerHTML) && arrayBtn[j].innerHTML !== wordRandAsArr[i]) {
        // console.log(arrayBtn[j].innerHTML);
        arrayBtn[j].style.backgroundColor = LETTER_FALSE;
      }
    }
  }

  for (let i = 0; i < wordFromUser.length; i++) {
    if (wordFromUser[i] === wordRandAsArr[i]) {
      arrayLineLetter[i].classList.remove("letter_false");
      arrayLineLetter[i].classList.add("letter_true");
      for (let j = 0; j < arrayBtn.length; j++) {
        if (arrayBtn[j].innerHTML === wordFromUser[i]) {
          // console.log(arrayBtn[j].innerHTML);
          arrayBtn[j].style.backgroundColor = LETTER_TRUE;
        }
      }
      localObjectLetters[wordFromUser[i]]--;
    }
  }

  for (let i = 0; i < wordFromUser.length; i++) {
    if (arrayLineLetter[i].classList.contains("letter_true")) {
      continue;
    }
    for (let j = 0; j < wordFromUser.length; j++) {
      if (wordFromUser[i] === wordRandAsArr[j] && localObjectLetters[wordFromUser[i]] > 0) {
        localObjectLetters[wordFromUser[i]]--;
        arrayLineLetter[i].classList.remove("letter_false");
        arrayLineLetter[i].classList.add("letter_available");
        for (let k = 0; k < arrayBtn.length; k++) {
          if (arrayBtn[k].innerHTML === wordRandAsArr[j] && arrayBtn[k].style.backgroundColor !== LETTER_TRUE) {
            console.log(arrayBtn[k].innerHTML);
            arrayBtn[k].style.backgroundColor = LETTER_AVAILABLE;
          }
        }
        break;
      }
    }
  }

  // console.log("correct: ", localObjectLetters);
  // console.log(localObjectLetters);
}

function clear() {
  for (let i = 0; i < arrayLineLetter.length; i++) {
    arrayLineLetter[i].innerHTML = "";
    letterIndex = 0;
  }
}

function changeLanguage() {
  if (tempCurrenLang === "ru") {
    for (let i = 0; i < ruLetters.length; i++) {
      ruLetters[i].style.display = "none";
    }

    for (let i = 0, j = 0; i < arrayBtn.length; i++) {
      if (arrayBtn[i].style.display !== "none" && !arrayBtn[i].classList.contains("main-keyboard__button--long")) {
        arrayBtn[i].innerHTML = engLettersArr[j];
        j++;
      }
    }
    clear();

    currentLang = WORDS_EN;
    wordRandAsString = randomWordFromArr(currentLang);
    // console.log(wordRandAsString);
    langBtn.innerHTML = "en";
    return (tempCurrenLang = "en");
  }
  if (tempCurrenLang === "en") {
    for (let i = 0; i < ruLetters.length; i++) {
      ruLetters[i].style.display = "flex";
    }

    for (let i = 0, j = 0; i < arrayBtn.length; i++) {
      if (!arrayBtn[i].classList.contains("main-keyboard__button--long")) {
        arrayBtn[i].innerHTML = ruLettersArr[j];
        j++;
      }
    }
    clear();
    currentLang = WORDS_RU;
    wordRandAsString = randomWordFromArr(currentLang);
    // console.log(wordRandAsString);
    langBtn.innerHTML = "ru";
    return (tempCurrenLang = "ru");
  }
}

function showWindow() {
  if (statisticWindow.style.display === "none") {
    statisticWindow.style.display = "block";
  } else {
    statisticWindow.style.display = "none";
  }
}

document.addEventListener("keydown", editLetter);
statisticBtn.addEventListener("click", showWindow);
langBtn.addEventListener("click", changeLanguage);

for (let i = 0; i < arrayBtn.length; i++) {
  arrayBtn[i].addEventListener("click", editLetter);
}
