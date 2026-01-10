// Variabler for spillet
let terms = []; // Liste som holder leddene
let totals = { s: 0, f: 0, h: 0 }; // Fasiten for sluttsum
let position = 50; // Strekmannens posisjon (50%)
let currentScore = 0;

// Timer-variabler
let timerId = null; // ID-en til selve tidsuret
let erTimerAktiv = false; // Sier om vi er "innenfor tiden" for å slå sammen
let forrigeType = null; // Husker om vi trykket s, f eller h sist
let forrigeRetning = 0; // Husker om vi gikk fram (1) eller tilbake (-1)

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
    // 1. Oppdater fasiten i bakgrunnen
    totals[type] += value;

    // Sjekk retning (er det + eller -?)
    let denneRetning = Math.sign(value); 

    // 2. Logikk for å slå sammen eller lage nytt ledd
    // Vi slår sammen HVIS: 
    // Tiden ikke er ute ENNÅ (erTimerAktiv er true)
    // OG vi trykker på samme knapp (type og retning er lik)
    if (erTimerAktiv === true && forrigeType === type && forrigeRetning === denneRetning) {
        
        // SLÅ SAMMEN: Vi endrer bare verdien på det siste leddet
        let sisteIndex = terms.length - 1;
        terms[sisteIndex].val += value;
        
    } else {
        
        // NYTT LEDD: Tiden er ute, eller vi trykket på noe annet
        terms.push({ type: type, val: value });
    }

    // 3. Nullstill og start tidsuret på nytt
    // Hver gang du trykker, får du 2 nye sekunder
    if (timerId) {
        clearTimeout(timerId); // Stopp den gamle klokka
    }
    
    // Oppdater status
    erTimerAktiv = true;
    forrigeType = type;
    forrigeRetning = denneRetning;

    // Start nedtellingen på 2 sekunder (2000 ms)
    timerId = setTimeout(function() {
        erTimerAktiv = false; // Tiden er ute!
        forrigeType = null;
    }, 2000);

    // 4. Oppdater skjermen
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
        
        let absVal = Math.abs(val); // Verdien uten minus (f.eks 3)
        let sign = val >= 0 ? "+" : "-"; // Fortegnet

        // Logikk for å bygge tekststrengen pent
        if (i === 0) {
            // Første ledd: Vis minus hvis negativt, ellers ingenting foran
            if (val < 0) {
                expressionString += `-${absVal}${type}`;
            } else {
                expressionString += `${absVal}${type}`;
            }
        } else {
            // Andre ledd og utover: Alltid mellomrom og fortegn først
            expressionString += ` ${sign} ${absVal}${type}`;
        }
    }

    expressionDisplay.innerText = expressionString;
}

function updateVisuals(type, value) {
    let moveAmount = 0;
    if (type === 's') moveAmount = 5;
    if (type === 'f') moveAmount = 2;
    if (type === 'h') moveAmount = 10;

    // Hvis verdien er negativ (gå bakover), gjør bevegelsen negativ
    if (value < 0) moveAmount *= -1;

    position += moveAmount;
    
    // Pass på at han ikke går ut av skjermen
    if (position > 95) position = 95;
    if (position < 5) position = 5;

    stickman.style.left = position + "%";

    // Hoppe-animasjon
    if (type === 'h') {
        stickman.classList.add('jump-anim');
        setTimeout(() => stickman.classList.remove('jump-anim'), 500);
    }
}

function startSolving() {
    if (terms.length === 0) {
        alert("Gå litt med strekmannen først!");
        return;
    }
    
    // Stopp tidsuret så vi ikke får "hengende" sammenslåinger
    clearTimeout(timerId);
    erTimerAktiv = false;

    controlsDiv.classList.add('hidden');
    solveBtn.classList.add('hidden');
    solutionArea.classList.remove('hidden');
    
    // Tøm input-feltene
    document.getElementById('input-s').value = '';
    document.getElementById('input-f').value = '';
    document.getElementById('input-h').value = '';
    feedbackText.innerText = '';
}

function checkAnswer() {
    // Hent verdiene brukeren har skrevet inn (eller 0 hvis tomt)
    let userS = parseInt(document.getElementById('input-s').value) || 0;
    let userF = parseInt(document.getElementById('input-f').value) || 0;
    let userH = parseInt(document.getElementById('input-h').value) || 0;

    if (userS === totals.s && userF === totals.f && userH === totals.h) {
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
    // Poengsystem: Lengre uttrykk gir mer poeng
    return terms.length * 10;
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0 };
    position = 50;
    
    // Reset timer
    clearTimeout(timerId);
    erTimerAktiv = false;
    forrigeType = null;

    expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    stickman.style.left = "50%";
    
    solutionArea.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    solveBtn.classList.remove('hidden');
    feedbackText.innerText = "";
}
