// Variabler for spillet
let terms = []; 
// NY: Lagt til r: 0
let totals = { s: 0, f: 0, h: 0, r: 0 }; 
let position = 50; 
let currentScore = 0;

// Timer-variabler
let timerId = null; 
let erTimerAktiv = false; 
let forrigeType = null; 
let forrigeRetning = 0; 

// Elementer fra HTML
const stickman = document.getElementById('stickman');
const expressionDisplay = document.getElementById('expression');
const controlsDiv = document.getElementById('controls');
const solveBtn = document.getElementById('solve-btn');
const solutionArea = document.getElementById('solution-area');
const feedbackText = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const nextRoundBtn = document.getElementById('next-round-btn');

function move(type, value) {
    // 1. Oppdater fasiten
    totals[type] += value;

    let denneRetning = Math.sign(value); 

    // 2. Samle-logikk
    if (erTimerAktiv === true && forrigeType === type && forrigeRetning === denneRetning) {
        let sisteIndex = terms.length - 1;
        terms[sisteIndex].val += value;
    } else {
        terms.push({ type: type, val: value });
    }

    // 3. Reset timer
    if (timerId) clearTimeout(timerId);
    
    erTimerAktiv = true;
    forrigeType = type;
    forrigeRetning = denneRetning;

    timerId = setTimeout(function() {
        erTimerAktiv = false;
        forrigeType = null;
    }, 2000);

    // 4. Oppdater GUI
    updateExpressionDisplay();
    updateVisuals(type, value);
}

function updateExpressionDisplay() {
    if (terms.length === 0) {
        expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
        return;
    }

    let expressionString = "";

    for (let i = 0; i < terms.length; i++) {
        let term = terms[i];
        let val = term.val;
        let type = term.type;
        let absVal = Math.abs(val);
        let sign = val >= 0 ? "+" : "-";

        if (i === 0) {
            if (val < 0) expressionString += `-${absVal}${type}`;
            else expressionString += `${absVal}${type}`;
        } else {
            expressionString += ` ${sign} ${absVal}${type}`;
        }
    }

    expressionDisplay.innerText = expressionString;
}

function updateVisuals(type, value) {
    let moveAmount = 0;
    
    // Bestem hvor langt den skal gå
    if (type === 's') moveAmount = 5;
    if (type === 'f') moveAmount = 2;
    if (type === 'h') moveAmount = 10;
    if (type === 'r') moveAmount = 8; // Rulle går litt lenger enn skritt

    if (value < 0) moveAmount *= -1;

    position += moveAmount;
    
    if (position > 95) position = 95;
    if (position < 5) position = 5;

    stickman.style.left = position + "%";

    // --- ANIMASJONER ---
    
    // Fjern gamle animasjoner først for å kunne trigge på nytt
    stickman.classList.remove('jump-anim', 'roll-anim');
    
    // Tving nettleseren til å oppdage at klassen er fjernet (reflow)
    void stickman.offsetWidth;

    if (type === 'h') {
        stickman.classList.add('jump-anim');
    }
    
    // NY: Trigge rulle-animasjon
    if (type === 'r') {
        stickman.classList.add('roll-anim');
    }
}

function startSolving() {
    if (terms.length === 0) {
        alert("Gå litt med strekmannen først!");
        return;
    }
    
    clearTimeout(timerId);
    erTimerAktiv = false;

    controlsDiv.classList.add('hidden');
    solveBtn.classList.add('hidden');
    solutionArea.classList.remove('hidden');
    
    // Tøm input-feltene
    document.getElementById('input-s').value = '';
    document.getElementById('input-f').value = '';
    document.getElementById('input-h').value = '';
    document.getElementById('input-r').value = ''; // Tøm r-feltet
    feedbackText.innerText = '';
}

function checkAnswer() {
    let userS = parseInt(document.getElementById('input-s').value) || 0;
    let userF = parseInt(document.getElementById('input-f').value) || 0;
    let userH = parseInt(document.getElementById('input-h').value) || 0;
    let userR = parseInt(document.getElementById('input-r').value) || 0; // Hent r-svar

    // NY: Sjekk at r også stemmer
    if (userS === totals.s && userF === totals.f && userH === totals.h && userR === totals.r) {
        let points = calculatePoints();
        currentScore += points;
        scoreDisplay.innerText = currentScore;
        
        feedbackText.innerText = `Riktig! Du fikk ${points} poeng.`;
        feedbackText.style.color = 'green';
        nextRoundBtn.classList.remove('hidden');
    } else {
        feedbackText.innerText = "Ikke helt riktig. Prøv å tell en gang til.";
        feedbackText.style.color = 'red';
    }
}

function calculatePoints() {
    return terms.length * 10;
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0, r: 0 }; // Nullstill r også
    position = 50;
    
    clearTimeout(timerId);
    erTimerAktiv = false;
    forrigeType = null;

    expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    stickman.style.left = "50%";
    
    // Fjern animasjonsklasser ved reset
    stickman.classList.remove('jump-anim', 'roll-anim');

    solutionArea.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    solveBtn.classList.remove('hidden');
    feedbackText.innerText = "";
}
