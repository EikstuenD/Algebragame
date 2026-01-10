// Variabler for å holde styr på spillets tilstand
let currentExpression = ""; // Teksten som vises
let movesHistory = []; // Liste over alle trekk for poengberegning
let totals = { s: 0, f: 0, h: 0 }; // Fasiten
let position = 50; // Posisjon i prosent (50% er midten)
let currentScore = 0;

// Elementer fra HTML
const stickman = document.getElementById('stickman');
const expressionDisplay = document.getElementById('expression');
const controlsDiv = document.getElementById('controls');
const solveBtn = document.getElementById('solve-btn');
const solutionArea = document.getElementById('solution-area');
const feedbackText = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const nextRoundBtn = document.getElementById('next-round-btn');

// Funksjon for å utføre et trekk
function move(type, value) {
    // 1. Oppdater matte-logikken
    totals[type] += value;
    
    // Lag tekst-representasjon (f.eks "+ 2s" eller "- 1h")
    let sign = value > 0 ? "+" : "-";
    let absValue = Math.abs(value);
    
    // Håndter første ledd i uttrykket (fjern + tegnet hvis det er starten)
    let term = "";
    if (movesHistory.length === 0 && value > 0) {
        term = `${absValue}${type}`;
    } else {
        // Legg til mellomrom for lesbarhet: " + 2s"
        term = ` ${sign} ${absValue}${type}`; 
    }

    currentExpression += term;
    movesHistory.push(term);
    
    // Oppdater visningen på skjermen
    expressionDisplay.innerText = currentExpression;

    // 2. Animer og flytt strekmannen
    updateVisuals(type, value);
}

function updateVisuals(type, value) {
    // Beregn ny posisjon (rent visuelt)
    // Hopp flytter mer enn skritt, skritt mer enn fot
    let moveAmount = 0;
    if (type === 's') moveAmount = 5;
    if (type === 'f') moveAmount = 2;
    if (type === 'h') moveAmount = 10;

    // Juster retning
    if (value < 0) moveAmount *= -1;

    position += moveAmount;
    
    // Hold strekmannen innenfor skjermen (0-100%)
    if (position > 95) position = 95;
    if (position < 5) position = 5;

    stickman.style.left = position + "%";

    // Legg til en liten hoppe-animasjon hvis det er hopp
    if (type === 'h') {
        stickman.classList.add('jump-anim');
        setTimeout(() => {
            stickman.classList.remove('jump-anim');
        }, 500);
    }
}

// Når brukeren trykker "Ferdig"
function startSolving() {
    if (movesHistory.length === 0) {
        alert("Gå litt med strekmannen først!");
        return;
    }
    
    // Skjul kontroller, vis løsningsfelt
    controlsDiv.classList.add('hidden');
    solveBtn.classList.add('hidden');
    solutionArea.classList.remove('hidden');
    
    // Tøm inputfeltene
    document.getElementById('input-s').value = '';
    document.getElementById('input-f').value = '';
    document.getElementById('input-h').value = '';
    feedbackText.innerText = '';
    feedbackText.style.color = 'black';
}

// Sjekk svaret
function checkAnswer() {
    let userS = parseInt(document.getElementById('input-s').value) || 0;
    let userF = parseInt(document.getElementById('input-f').value) || 0;
    let userH = parseInt(document.getElementById('input-h').value) || 0;

    if (userS === totals.s && userF === totals.f && userH === totals.h) {
        // RIKTIG SVAR
        let points = calculatePoints();
        currentScore += points;
        scoreDisplay.innerText = currentScore;
        
        feedbackText.innerText = `Riktig! Du fikk ${points} poeng.`;
        feedbackText.style.color = 'green';
        nextRoundBtn.classList.remove('hidden');
    } else {
        // FEIL SVAR
        feedbackText.innerText = "Ikke helt riktig. Prøv å tell en gang til.";
        feedbackText.style.color = 'red';
    }
}

function calculatePoints() {
    // Poeng basert på lengden av uttrykket (jo lenger, jo bedre)
    return movesHistory.length * 10;
}

function resetRound() {
    // Nullstill variabler for runden
    currentExpression = "";
    movesHistory = [];
    totals = { s: 0, f: 0, h: 0 };
    position = 50;

    // Nullstill GUI
    expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    stickman.style.left = "50%";
    
    solutionArea.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    solveBtn.classList.remove('hidden');
    feedbackText.innerText = "";
}
