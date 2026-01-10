// Variabler for spillet
let terms = []; // Liste som holder leddene (f.eks [{type:'s', val:3}, {type:'h', val:2}])
let totals = { s: 0, f: 0, h: 0 }; // Fasiten for sluttsum
let position = 50; // Strekmannens posisjon
let currentScore = 0;

// Variabler for "sammenslåing" (timer-logikk)
let mergeTimer = null; // Holder styr på 2-sekunders klokka
let lastMoveType = null; // Hva var forrige trekk? (s, f eller h)
let lastMoveSign = 0; // Var forrige trekk positivt eller negativt?

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
    // 1. Oppdater fasiten (matten i bakgrunnen)
    totals[type] += value;

    // 2. Logikk for uttrykket på skjermen
    // Sjekk om vi skal slå sammen med forrige ledd
    // Regler: Må være samme type (s/f/h), samme retning (fortegn), og tidsuret må være aktivt
    let currentSign = Math.sign(value); // Gir 1 for positiv, -1 for negativ

    if (mergeTimer && lastMoveType === type && lastMoveSign === currentSign) {
        // MERGE: Vi legger til verdien på det SISTE leddet i listen
        let lastIndex = terms.length - 1;
        terms[lastIndex].val += value;
    } else {
        // NYTT LEDD: Vi lager et nytt objekt i listen
        terms.push({ type: type, val: value });
    }

    // Oppdater status for neste klikk
    lastMoveType = type;
    lastMoveSign = currentSign;

    // Reset tidsuret (hvis du klikker igjen innen 2 sek, merges det videre)
    clearTimeout(mergeTimer);
    mergeTimer = setTimeout(() => {
        // Når tiden er ute, nullstiller vi "sist brukt", slik at neste klikk blir nytt ledd
        mergeTimer = null;
        lastMoveType = null;
    }, 2000); // 2000 millisekunder = 2 sekunder

    // 3. Oppdater teksten på skjermen basert på listen vår
    updateExpressionDisplay();

    // 4. Animer strekmannen
    updateVisuals(type, value);
}

function updateExpressionDisplay() {
    if (terms.length === 0) {
        expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
        return;
    }

    let expressionString = "";

    terms.forEach((term, index) => {
        let val = term.val;
        let type = term.type;
        let absVal = Math.abs(val);
        let sign = val >= 0 ? "+" : "-";

        // Hvis det er aller første leddet
        if (index === 0) {
            // Hvis tallet er negativt viser vi minustegnet, ellers ingenting foran
            if (val < 0) expressionString += `-${absVal}${type}`;
            else expressionString += `${absVal}${type}`;
        } 
        // For alle andre ledd etter det første
        else {
            expressionString += ` ${sign} ${absVal}${type}`;
        }
    });

    expressionDisplay.innerText = expressionString;
}

function updateVisuals(type, value) {
    let moveAmount = 0;
    if (type === 's') moveAmount = 5;
    if (type === 'f') moveAmount = 2;
    if (type === 'h') moveAmount = 10;

    if (value < 0) moveAmount *= -1;

    position += moveAmount;
    if (position > 95) position = 95;
    if (position < 5) position = 5;

    stickman.style.left = position + "%";

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
    
    // Stopp timeren så ingenting rart skjer mens vi løser
    clearTimeout(mergeTimer);

    controlsDiv.classList.add('hidden');
    solveBtn.classList.add('hidden');
    solutionArea.classList.remove('hidden');
    
    document.getElementById('input-s').value = '';
    document.getElementById('input-f').value = '';
    document.getElementById('input-h').value = '';
    feedbackText.innerText = '';
}

function checkAnswer() {
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
    // Poeng basert på hvor mange ledd uttrykket har.
    // Hvis man slår sammen (klikker fort), blir uttrykket kortere = færre poeng,
    // men det blir ryddigere. Hvis man venter, blir det lenger = flere poeng.
    return terms.length * 10;
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0 };
    position = 50;
    
    // Reset timer variabler
    clearTimeout(mergeTimer);
    mergeTimer = null;
    lastMoveType = null;

    expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    stickman.style.left = "50%";
    
    solutionArea.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    solveBtn.classList.remove('hidden');
    feedbackText.innerText = "";
}
