// Variabler for å holde styr på spillet
let score = 0;
let level = 1;
let currentX = 0;
let correctAnswer = 0;

// Henter elementer fra HTML slik at vi kan endre dem
const mathProblemEl = document.getElementById("math-problem");
const variableDisplayEl = document.getElementById("variable-display");
const inputEl = document.getElementById("player-input");
const feedbackEl = document.getElementById("feedback-message");
const scoreEl = document.getElementById("score");
const submitBtn = document.getElementById("submit-btn");

// Start spillet når siden lastes
window.onload = generateProblem;

// Funksjon som lager en ny algebra-oppgave
function generateProblem() {
    // 1. Tøm input-feltet og fokusér på det
    inputEl.value = "";
    inputEl.focus();
    feedbackEl.innerText = "";

    // 2. Velg et tilfeldig tall for x (mellom 2 og 10)
    currentX = Math.floor(Math.random() * 9) + 2;
    
    // 3. Velg tilfeldige tall for uttrykket (ax + b)
    // a er tallet foran x, b er tallet vi legger til eller trekker fra
    let a = Math.floor(Math.random() * 5) + 2; // Tall mellom 2 og 6
    let b = Math.floor(Math.random() * 10) + 1; // Tall mellom 1 og 10

    // 4. Regn ut fasiten (maskinen må vite svaret)
    correctAnswer = (a * currentX) + b;

    // 5. Vis oppgaven til eleven
    variableDisplayEl.innerText = `x = ${currentX}`;
    mathProblemEl.innerText = `${a}x + ${b}`;
}

// Funksjon for å sjekke om svaret er riktig
function checkAnswer() {
    // Hent svaret fra eleven og gjør det om til et tall
    let playerAnswer = parseInt(inputEl.value);

    // Sjekk om feltet er tomt
    if (isNaN(playerAnswer)) {
        feedbackEl.innerText = "⚠️ Skriv inn et tall først!";
        feedbackEl.className = "wrong";
        return;
    }

    // Sammenlign
    if (playerAnswer === correctAnswer) {
        // RIKTIG SVAR
        feedbackEl.innerText = "🔓 TILGANG INNVILGET! Kodelinje akseptert.";
        feedbackEl.className = "correct";
        score += 10; // Gi poeng
        scoreEl.innerText = score;
        
        // Vent 1.5 sekund, så lag ny oppgave
        setTimeout(generateProblem, 1500);
        
    } else {
        // FEIL SVAR
        feedbackEl.innerText = "🚫 FEIL KODE! Prøv på nytt.";
        feedbackEl.className = "wrong";
        score -= 5; // Trekk poeng (valgfritt)
        if (score < 0) score = 0;
        scoreEl.innerText = score;
    }
}

// Koble knappen til sjekk-funksjonen
submitBtn.addEventListener("click", checkAnswer);

// Gjør at man kan trykke "Enter" i stedet for å klikke på knappen
inputEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
