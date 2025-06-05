// script.js - Logika Game Perhitungan Anak

// --- 1. Mendapatkan Elemen-elemen HTML ---
const splashScreen = document.getElementById('splash-screen');
const container = document.querySelector('.container'); // Kontainer utama game

const menuArea = document.getElementById('menu-area');
const difficultyArea = document.getElementById('difficulty-area');
const gameLevelArea = document.getElementById('game-level-area');
const gameArea = document.getElementById('game-area');
const resultArea = document.getElementById('result-area');

const operationButtons = document.querySelectorAll('.operation-button');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const questionLevelButtons = document.querySelectorAll('.question-level-button');
const backButtons = document.querySelectorAll('.back-button');

const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const feedbackDisplay = document.getElementById('feedback');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again-button');

// Elemen baru untuk pilihan Lanjut/Berhenti
const continueStopOptions = document.getElementById('continue-stop-options');
const continueButton = document.getElementById('continue-button');
const stopGameButton = document.getElementById('stop-game-button');


// --- 2. Variabel Global untuk Game State ---
let currentOperation = ''; // Menyimpan operasi yang dipilih (add, subtract, etc.)
let currentDifficulty = ''; // Menyimpan tingkat kesulitan (satuan, puluhan, etc.)
let currentQuestionLevel = ''; // Menyimpan tingkatan soal (mudah, sulit)
let score = 0;
let correctAnswer = 0;
let totalQuestions = 0; // Menghitung jumlah soal yang sudah dimainkan
const MAX_QUESTIONS = 10; // Jumlah soal per sesi game

// Feedback positif untuk jawaban benar
const positiveFeedback = [
    "KAMU HEBAT!",
    "LUAR BIASA!",
    "KEREN!",
    "PINTAR SEKALI!",
    "BETUL!"
];


// --- 3. Fungsi Utility untuk Navigasi Layar ---
function showScreen(screenToShow) {
    // Sembunyikan semua layar
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Tampilkan layar yang diminta
    screenToShow.classList.add('active');
}

// --- 4. Fungsi untuk Menghasilkan Angka Acak ---
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- 5. Logika Pembuatan Soal ---
function generateQuestion() {
    let num1, num2;
    let questionText = '';
    let options = []; // Untuk pilihan jawaban

    // Reset feedback display
    feedbackDisplay.textContent = '';
    feedbackDisplay.className = 'feedback-text';

    // Sembunyikan pilihan Lanjut/Berhenti saat soal baru muncul
    continueStopOptions.classList.add('hidden-options');

    // Logika berdasarkan currentDifficulty dan currentQuestionLevel
    switch (currentDifficulty) {
        case 'satuan':
            if (currentOperation === 'subtract' && currentQuestionLevel === 'mudah') {
                num2 = getRandomNumber(1, 9);
                num1 = getRandomNumber(num2, 9);
            } else if (currentOperation === 'subtract' && currentQuestionLevel === 'sulit') {
                num1 = getRandomNumber(1, 9);
                num2 = getRandomNumber(1, 9);
            } else {
                num1 = getRandomNumber(1, 9);
                num2 = getRandomNumber(1, 9);
            }
            break;
        case 'puluhan':
            if (currentOperation === 'subtract' && currentQuestionLevel === 'mudah') {
                num2 = getRandomNumber(10, 99);
                let digit2_satuan = num2 % 10;
                let digit2_puluhan = Math.floor(num2 / 10);
                
                let digit1_satuan = getRandomNumber(digit2_satuan, 9);
                let digit1_puluhan = getRandomNumber(digit2_puluhan, 9);
                num1 = (digit1_puluhan * 10) + digit1_satuan;
                if (num1 < num2) num1 = getRandomNumber(num2 + 1, 99);

            } else if (currentOperation === 'subtract' && currentQuestionLevel === 'sulit') {
                let digit2_satuan = getRandomNumber(1, 9);
                let digit1_satuan = getRandomNumber(0, digit2_satuan - 1);

                let digit2_puluhan = getRandomNumber(1, 9);
                let digit1_puluhan = getRandomNumber(digit2_puluhan, 9);

                num1 = (digit1_puluhan * 10) + digit1_satuan;
                num2 = (digit2_puluhan * 10) + digit2_satuan;
                if (num1 <= num2) num1 = getRandomNumber(num2 + 1, 99);
            } else {
                num1 = getRandomNumber(10, 99);
                num2 = getRandomNumber(10, 99);
            }
            break;
        case 'ratusan':
            if (currentOperation === 'subtract' && currentQuestionLevel === 'mudah') {
                num2 = getRandomNumber(100, 999);
                let digits2 = [num2 % 10, Math.floor(num2/10) % 10, Math.floor(num2/100) % 10];
                let digits1 = [];
                for(let i=0; i<3; i++){
                    digits1.push(getRandomNumber(digits2[i], 9));
                }
                num1 = digits1[2] * 100 + digits1[1] * 10 + digits1[0];
                if (num1 < num2) num1 = getRandomNumber(num2 + 1, 999);
            } else if (currentOperation === 'subtract' && currentQuestionLevel === 'sulit') {
                num2 = getRandomNumber(100, 999);
                let digit2_satuan = num2 % 10;
                let digit1_satuan = getRandomNumber(0, digit2_satuan - 1);
                if (digit1_satuan < 0) digit1_satuan = 0;

                let digit2_puluhan = Math.floor(num2 / 10) % 10;
                let digit1_puluhan = getRandomNumber(digit2_puluhan, 9);

                let digit2_ratusan = Math.floor(num2 / 100);
                let digit1_ratusan = getRandomNumber(digit2_ratusan, 9);

                num1 = (digit1_ratusan * 100) + (digit1_puluhan * 10) + digit1_satuan;
                if (num1 <= num2) num1 = getRandomNumber(num2 + 1, 999);
            } else {
                num1 = getRandomNumber(100, 999);
                num2 = getRandomNumber(100, 999);
            }
            break;
        case 'ribuan':
            if (currentOperation === 'subtract' && currentQuestionLevel === 'mudah') {
                num2 = getRandomNumber(1000, 9999);
                let digits2 = [num2 % 10, Math.floor(num2/10) % 10, Math.floor(num2/100) % 10, Math.floor(num2/1000) % 10];
                let digits1 = [];
                for(let i=0; i<4; i++){
                    digits1.push(getRandomNumber(digits2[i], 9));
                }
                num1 = digits1[3] * 1000 + digits1[2] * 100 + digits1[1] * 10 + digits1[0];
                if (num1 < num2) num1 = getRandomNumber(num2 + 1, 9999);
            } else if (currentOperation === 'subtract' && currentQuestionLevel === 'sulit') {
                num2 = getRandomNumber(1000, 9999);
                let digit2_satuan = num2 % 10;
                let digit1_satuan = getRandomNumber(0, digit2_satuan - 1);
                if (digit1_satuan < 0) digit1_satuan = 0;

                let digit2_puluhan = Math.floor(num2 / 10) % 10;
                let digit1_puluhan = getRandomNumber(digit2_puluhan, 9);

                let digit2_ratusan = Math.floor(num2 / 100) % 10;
                let digit1_ratusan = getRandomNumber(digit2_ratusan, 9);

                let digit2_ribuan = Math.floor(num2 / 1000);
                let digit1_ribuan = getRandomNumber(digit2_ribuan, 9);

                num1 = (digit1_ribuan * 1000) + (digit1_ratusan * 100) + (digit1_puluhan * 10) + digit1_satuan;
                if (num1 <= num2) num1 = getRandomNumber(num2 + 1, 9999);
            } else {
                num1 = getRandomNumber(1000, 9999);
                num2 = getRandomNumber(1000, 9999);
            }
            break;
        case 'campuran':
            const ranges = {
                'satuan': [1, 9],
                'puluhan': [10, 99],
                'ratusan': [100, 999],
                'ribuan': [1000, 9999]
            };
            let availableRanges = ['satuan', 'puluhan', 'ratusan'];
            if (currentOperation === 'add' || currentOperation === 'subtract') {
                availableRanges.push('ribuan');
            }

            let rangeKey1 = availableRanges[getRandomNumber(0, availableRanges.length - 1)];
            let rangeKey2 = availableRanges[getRandomNumber(0, availableRanges.length - 1)];

            num1 = getRandomNumber(ranges[rangeKey1][0], ranges[rangeKey1][1]);
            num2 = getRandomNumber(ranges[rangeKey2][0], ranges[rangeKey2][1]);

            if (currentOperation === 'subtract') {
                if (num1 < num2) [num1, num2] = [num2, num1];
            } else if (currentOperation === 'divide') {
                if (num2 === 0) num2 = 1;
                let tempResult = getRandomNumber(1, 10);
                num1 = tempResult * num2;
            }
            break;
    }

    let result;
    let operator;

    if (isNaN(num1) || isNaN(num2)) {
        console.error("Error: Generated numbers are NaN. Retrying question generation.");
        generateQuestion();
        return;
    }

    switch (currentOperation) {
        case 'add':
            result = num1 + num2;
            operator = '+';
            break;
        case 'subtract':
            if (num1 < num2) [num1, num2] = [num2, num1];
            result = num1 - num2;
            operator = '-';
            break;
        case 'multiply':
            if (currentDifficulty === 'ratusan' && currentQuestionLevel === 'sulit') {
                 num1 = getRandomNumber(10, 50);
                 num2 = getRandomNumber(10, 20);
            } else if (currentDifficulty === 'puluhan' && currentQuestionLevel === 'sulit') {
                 num1 = getRandomNumber(5, 20);
                 num2 = getRandomNumber(5, 15);
            } else if (currentDifficulty === 'puluhan') {
                 num1 = getRandomNumber(1, 10);
                 num2 = getRandomNumber(1, 10);
            } else if (currentDifficulty === 'ratusan') {
                 num1 = getRandomNumber(1, 10);
                 num2 = getRandomNumber(1, 10);
            }
            result = num1 * num2;
            operator = 'x';
            break;
        case 'divide':
            if (num2 === 0) num2 = 1;
            
            let tempDivResult;
            if (currentQuestionLevel === 'sulit') {
                tempDivResult = getRandomNumber(5, 20);
                num2 = getRandomNumber(2, 12);
            } else {
                tempDivResult = getRandomNumber(1, 10);
                num2 = getRandomNumber(1, 9);
            }
            num1 = tempDivResult * num2;
            result = tempDivResult;
            operator = '/';
            break;
        default:
            questionDisplay.textContent = "Error: Operasi tidak dikenal.";
            return;
    }

    questionText = `${num1} ${operator} ${num2} = ?`;
    questionDisplay.textContent = questionText;
    correctAnswer = result;

    options.push(correctAnswer);
    while (options.length < 4) {
        let wrongAnswer;
        let offset = getRandomNumber(-10, 10); 
        if (offset === 0) offset = 1;
        
        wrongAnswer = correctAnswer + offset;
        if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);
        
        // Pastikan jawaban salah tidak duplikat dan tidak sama dengan jawaban benar
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        } else if (wrongAnswer === correctAnswer) { 
            wrongAnswer = correctAnswer + (offset > 0 ? offset + 1 : offset - 1);
            if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
                 options.push(wrongAnswer);
            }
        }
    }

    options.sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

// --- 6. Fungsi untuk Memeriksa Jawaban ---
function checkAnswer(selectedOption) {
    totalQuestions++;
    optionsContainer.innerHTML = '';

    if (selectedOption === correctAnswer) {
        score++;
        scoreDisplay.textContent = score;
        // Pilih feedback positif secara acak
        const randomPositiveFeedback = positiveFeedback[getRandomNumber(0, positiveFeedback.length - 1)];
        feedbackDisplay.textContent = randomPositiveFeedback;
        feedbackDisplay.className = 'feedback-text correct';
    } else {
        feedbackDisplay.textContent = `SALAH! Jawaban yang benar adalah ${correctAnswer}`;
        feedbackDisplay.className = 'feedback-text wrong';
    }

    continueStopOptions.classList.remove('hidden-options');
}

// --- 7. Fungsi untuk Mengakhiri Game ---
function endGame() {
    finalScoreDisplay.textContent = score;
    showScreen(resultArea);
}

// --- 8. Event Listeners (Untuk Menanggapi Interaksi Pengguna) ---

// a. Pengaturan Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        splashScreen.classList.add('hidden'); // Sembunyikan splash screen
        container.classList.remove('hidden'); // Tampilkan kontainer game
        showScreen(menuArea); // Tampilkan menu utama
    }, 3000); // Splash screen muncul selama 3 detik
});

// b. Tombol Operasi
operationButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        currentOperation = event.target.dataset.operation;
        showScreen(difficultyArea);
        
        // Atur visibilitas tombol "Ribuan" jika operasi bukan penjumlahan/pengurangan
        const ribuanButton = document.querySelector('.difficulty-button[data-level="ribuan"]');
        if (ribuanButton) {
            if (currentOperation === 'add' || currentOperation === 'subtract') {
                ribuanButton.style.display = 'flex'; // Pastikan tetap flex agar center
            } else {
                ribuanButton.style.display = 'none';
            }
        }
    });
});

// c. Tombol Tingkat Kesulitan (Satuan, Puluhan, dll.)
difficultyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        currentDifficulty = event.target.dataset.level;
        showScreen(gameLevelArea);
    });
});

// d. Tombol Tingkatan Soal (Mudah, Sulit)
questionLevelButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        currentQuestionLevel = event.target.dataset.qlevel;
        score = 0;
        totalQuestions = 0;
        scoreDisplay.textContent = score;
        showScreen(gameArea);
        generateQuestion();
    });
});

// e. Tombol Kembali
backButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const targetScreenId = event.target.dataset.target;
        showScreen(document.getElementById(targetScreenId));
        // Reset tampilan feedback dan opsi lanjut/berhenti jika kembali dari game area
        if (document.getElementById(targetScreenId) === gameLevelArea || document.getElementById(targetScreenId) === menuArea) {
            feedbackDisplay.textContent = '';
            continueStopOptions.classList.add('hidden-options');
            optionsContainer.innerHTML = '';
        }
    });
});

// f. Tombol Main Lagi (dari layar hasil akhir)
playAgainButton.addEventListener('click', () => {
    score = 0;
    totalQuestions = 0;
    scoreDisplay.textContent = score;
    feedbackDisplay.textContent = '';
    continueStopOptions.classList.add('hidden-options');
    optionsContainer.innerHTML = '';

    showScreen(menuArea);
});

// g. Tombol Lanjut (dari pilihan Lanjut/Berhenti)
continueButton.addEventListener('click', () => {
    if (totalQuestions < MAX_QUESTIONS) {
        generateQuestion();
    } else {
        endGame();
    }
});

// h. Tombol Berhenti Bermain (dari pilihan Lanjut/Berhenti)
stopGameButton.addEventListener('click', () => {
    endGame();
});

// --- PWA: Registrasi Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/GameZizi/sw.js') // PERUBAHAN DI SINI
            .then(registration => {
                console.log('Service Worker berhasil didaftarkan dengan scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker gagal didaftarkan:', error);
            });
    });
}
