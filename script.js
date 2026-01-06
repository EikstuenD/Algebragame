// Henter lagret score fra nettleseren, eller setter til 0 hvis ny
let score = parseInt(localStorage.getItem('algebraScore')) || 0;
updateScoreDisplay();

// Denne funksjonen kjøres hver gang en side lastes
document.addEventListener('DOMContentLoaded', () => {
    
    // Sjekker om vi er på Nivå 1
    if (document.getElementById('game-area-1')) {
        initLevel1();
    }
    
    // Sjekker om vi er på Nivå 2
    if (document.getElementById('game-area-2')) {
        initLevel2();
    }
    
    // Sjekker om vi er på Nivå 3
    if (document.getElementById('game-area-3')) {
        initLevel3();
    }
});

// Felles funksjon for å oppdatere og lagre score
function addScore(points) {
    score += points;
    localStorage.setItem('algebraScore', score); // Lagrer i nettleseren
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreEl = document.getElementById('total-score');
    if (scoreEl) scoreEl.innerText = score;
}

function resetScore() {
    score = 0;
    localStorage.setItem('algebraScore', 0);
    updateScoreDisplay();
}

/* ================= NIVÅ 1 LOGIKK ================= */
let l1_answer = 0;

function initLevel1() {
    document.getElementById('l1-input').value = "";
    document.getElementById('l1-feedback').innerText = "";
    
    let x = Math.floor(Math.random() * 5) + 2; 
    let a = Math.floor(Math.random() * 4) + 2; 
    let b = Math.floor(Math.random() * 10) + 1;
    
    l1_answer = (a * x) + b;

    document.getElementById('l1-variable').innerText = `x = ${x}`;
    document.getElementById('l1-problem').innerText = `${a}x + ${b}`;
}

function checkLevel1() {
    let input = parseInt(document.getElementById('l1-input').value);
    let fb = document.getElementById('l1-feedback');
    
    if(input === l1_answer) {
        fb.innerText = "Riktig! 🔓";
        fb.style.color = "#0f0";
        addScore(10);
        setTimeout(initLevel1, 1500);
    } else {
        fb.innerText = "Feil kode.";
        fb.style.color = "red";
    }
}

/* ================= NIVÅ 2 LOGIKK ================= */
let l2_ansA = 0;
let l2_ansB = 0;

function initLevel2() {
    document.getElementById('l2-input-a').value = "";
    document.getElementById('l2-input-b').value = "";
    document.getElementById('l2-feedback').innerText = "";
    
    const conveyor = document.getElementById('l2-conveyor');
    conveyor.innerHTML = ""; 

    l2_ansA = 0;
    l2_ansB = 0;

    let numItems = Math.floor(Math.random() * 3) + 4;
    
    for(let i=0; i<numItems; i++) {
        let type = Math.random() > 0.5 ? 'a' : 'b';
        let val = Math.floor(Math.random() * 4) + 1; 
        
        if(type === 'a') l2_ansA += val;
        else l2_ansB += val;

        let text = (val === 1) ? type : val + type;
        let div = document.createElement('div');
        div.className = 'item';
        div.innerText = text;
        conveyor.appendChild(div);
    }
}

function checkLevel2() {
    let inA = parseInt(document.getElementById('l2-input-a').value) || 0;
    let inB = parseInt(document.getElementById('l2-input-b').value) || 0;
    let fb = document.getElementById('l2-feedback');

    if(inA === l2_ansA && inB === l2_ansB) {
        fb.innerText = `Korrekt!`;
        fb.style.color = "#0f0";
        addScore(10);
        setTimeout(initLevel2, 2000);
    } else {
        fb.innerText = "Feil antall.";
        fb.style.color = "red";
    }
}

/* ================= NIVÅ 3 LOGIKK ================= */
let l3_a = 1, l3_b = 0, l3_c = 0, l3_xVal = 0;

function initLevel3() {
    document.getElementById('l3-feedback').innerText = "";
    l3_xVal = Math.floor(Math.random() * 3) + 2; 
    l3_a = Math.floor(Math.random() * 2) + 2; 
    l3_b = Math.floor(Math.random() * 3) + 1; 
    l3_c = (l3_a * l3_xVal) + l3_b;
    renderScale();
}

function renderScale() {
    const leftPlate = document.getElementById('scale-left');
    const rightPlate = document.getElementById('scale-right');
    leftPlate.innerHTML = "";
    rightPlate.innerHTML = "";

    for(let i=0; i<l3_a; i++) leftPlate.innerHTML += `<div class="box-x">x</div>`;
    for(let i=0; i<l3_b; i++) leftPlate.innerHTML += `<div class="weight-1">1</div>`;
    for(let i=0; i<l3_c; i++) rightPlate.innerHTML += `<div class="weight-1">1</div>`;
}

function scaleAction(action) {
    let fb = document.getElementById('l3-feedback');
    fb.innerText = "";

    if(action === 'sub1') {
        if(l3_b > 0 && l3_c > 0) {
            l3_b--; l3_c--;
            renderScale();
        } else {
            fb.innerText = "Kan ikke fjerne mer!";
            fb.style.color = "orange";
        }
    } else if (action === 'div') {
        if(l3_b === 0) {
            if(l3_c % l3_a === 0) {
                l3_c = l3_c / l3_a; l3_a = 1;
                renderScale();
                fb.innerText = `Bra! x = ${l3_c}`;
                fb.style.color = "#0f0";
                addScore(20);
                setTimeout(initLevel3, 3000);
            } else {
                fb.innerText = "Går ikke opp.";
            }
        } else {
            fb.innerText = "Fjern loddene (+b) først!";
            fb.style.color = "orange";
        }
    }
}
