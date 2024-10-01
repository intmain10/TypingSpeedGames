const typingText = document.querySelector('.typing-text p');
const input = document.querySelector('.wrapper .input-field');
const timeDisplay = document.querySelector('.time span b');
const mistakesDisplay = document.querySelector('.mistake span');
const wpmDisplay = document.querySelector('.wpm span');
const cpmDisplay = document.querySelector('.cpm span');
const accuracyDisplay = document.querySelector('.accuracy span'); // Display for accuracy
const btn = document.querySelector('button');

let timer; // For the countdown timer
let maxTime = 60; // Total time for the game
let timeLeft = maxTime; // Time left (initialized to max time)
let isTyping = false; // To check if the user has started typing
let mistakeWordCount = 0; // Track mistake words
let totalWords = 0; // Total words in the selected paragraph

function loadParagraph() {
    const paragraphs = [
        "The forest was alive with the sounds of nature. Birds chirped in the distance, while the rustle of leaves hinted at the presence of small creatures.",
        "In the age of rapid technological advancements, the world has become more connected than ever before. Innovations in artificial intelligence are reshaping the future.",
        "The waves crashed gently against the shore as the golden sun began to set on the horizon. The salty breeze carried the scent of the ocean.",
    ];

    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = ""; // Clear previous content

    const selectedParagraph = paragraphs[randomIndex].split(' ');
    totalWords = selectedParagraph.length; // Update total words count

    selectedParagraph.forEach(word => {
        word.split('').forEach(char => {
            typingText.innerHTML += `<span>${char}</span>`;
        });
        typingText.innerHTML += ' '; // Add space between words
    });

    resetGame(); // Reset all stats when a new paragraph is loaded
}

// Reset the game stats and inputs
function resetGame() {
    clearInterval(timer); // Clear any previous timers
    timeLeft = maxTime; // Reset time
    isTyping = false; // Reset typing state
    input.value = ""; // Clear the input field
    timeDisplay.innerText = timeLeft; // Reset time display
    mistakesDisplay.innerText = 0; // Reset mistakes
    wpmDisplay.innerText = 0; // Reset WPM
    cpmDisplay.innerText = 0; // Reset CPM
    accuracyDisplay.innerText = "100%"; // Reset accuracy to 100%
    mistakeWordCount = 0; // Reset mistake words
}

// Start the countdown timer
function startTimer() {
    if (!isTyping) { // Start the timer only once when typing starts
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--; // Decrease time
                timeDisplay.innerText = timeLeft; // Update the display
                calculatePerformance(); // Recalculate performance while typing
            } else {
                clearInterval(timer); // Stop the timer when time is up
                input.disabled = true; // Disable the input field
                calculatePerformance(); // Final performance calculation
            }
        }, 1000); // Timer updates every second
    }
    isTyping = true; // Set typing state to true
}

// Add event listener for user input
input.addEventListener('input', () => {
    startTimer(); // Start the timer on first input

    const inputWords = input.value.trim().split(' '); // Split user input into words
    const paragraphWords = typingText.innerText.trim().split(' '); // Split paragraph into words

    mistakeWordCount = 0; // Reset mistake word count

    // Loop through input words to check against the paragraph words
    inputWords.forEach((word, index) => {
        if (word !== paragraphWords[index]) {
            mistakeWordCount++; // Increment mistake word count for each incorrect word
        }
    });

    mistakesDisplay.innerText = mistakeWordCount; // Update the mistake word count in the UI
    calculatePerformance(); // Calculate performance metrics
});

// Calculate and display WPM (Words Per Minute), CPM, and Accuracy
function calculatePerformance() {
    const typedChars = input.value.length; // Total characters typed
    const wordsTyped = input.value.trim().split(' ').length; // Words typed by the user

    const minutes = (maxTime - timeLeft) / 60; // Time elapsed in minutes
    const wpm = Math.round((wordsTyped - mistakeWordCount) / minutes); // WPM calculation
    const cpm = Math.round(typedChars / minutes); // CPM calculation

    wpmDisplay.innerText = wpm > 0 ? wpm : 0; // Display WPM
    cpmDisplay.innerText = cpm > 0 ? cpm : 0; // Display CPM

    // Calculate and display accuracy
    const accuracy = Math.round(((totalWords - mistakeWordCount) / totalWords) * 100);
    accuracyDisplay.innerText = accuracy + "%"; // Display accuracy
}

// Button to reload paragraph
btn.addEventListener('click', loadParagraph);

// Call the function on page load
window.onload = loadParagraph;
