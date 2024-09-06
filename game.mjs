import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}



import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';


const LIST_OF_WORDS = ["javascript", "esports", "student", "apple", "orange", "games", "program","server", "philippines", "hawaii", "norway" ];
let correctWord = pickRandomWord(LIST_OF_WORDS).toLowerCase();
const GUESS_CHAR_OR_WORD = "Guess a char or the word : ";
const CORRECT_GUESS_MESSAGE = "Congratulation, winner winner chicken dinner";
const GAME_OVER_MESSAGE = "Game Over";
let numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_"); 
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];
let correctGuesses = [];
let wordDisplay;



function playAgain () {
    correctWord = pickRandomWord(LIST_OF_WORDS).toLowerCase();
    numberOfCharInWord = correctWord.length;
    guessedWord = "".padStart(correctWord.length, "_"); 
    wordDisplay = "";
    isGameOver = false;
    wasGuessCorrect = false;
    wrongGuesses = [];
    correctGuesses = [];
}




function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
       
        if (guessedWord[i] != "_") {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}

async function gameRunning() {
    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[wrongGuesses.length]);

        const answer = (await askQuestion(GUESS_CHAR_OR_WORD)).toLowerCase();

        if (answer == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        } else if (ifPlayerGuessedLetter(answer)) {

            let org = guessedWord;
            guessedWord = "";

            let isCorrect = false;
            for (let i = 0; i < correctWord.length; i++) {
                if (correctWord[i] == answer) {
                    guessedWord += answer;
                    isCorrect = true;
                } else {
                    
                    guessedWord += org[i];
                }
            }

            if (correctGuesses.includes(answer)){
                isCorrect = false;
            }
            
            if (isCorrect == false) {
                wrongGuesses.push(answer);
            } else if (isCorrect == true) {
                correctGuesses.push(answer);
            } else if (guessedWord == correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
            }
        }

        
        if (wrongGuesses.length == HANGMAN_UI.length || correctGuesses.length == correctWord.length) {
            isGameOver = true;
        }

        if(isGameOver){
            playAgain();
        }

    }
}

await gameRunning();


console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + CORRECT_GUESS_MESSAGE);
}
console.log(GAME_OVER_MESSAGE);
process.exit();

function ifPlayerGuessedLetter(answer) {
    return answer.length == 1;
}




function pickRandomWord(wordList) {
    return wordList[getRandomNumber(0, wordList.length)];
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
