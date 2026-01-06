let score = 0;

// --- NAVIGASJON OG MENY ---
function showMenu() {
    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('subtitle').innerText = "Velg oppdrag...";
    document.getElementById('back-btn').classList.add('hidden');
    
    // Skjul alle spill-skjermer
    document.getElementById('level-1').classList.add('hidden');
    document.getElementById('level-2').classList.add('hidden');
    document.getElementById('level-3').classList.add('hidden');
}

function startLevel(level) {
    // Skjul meny, vis tilbake-knapp
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('back-btn').classList.remove('hidden');
    document.getElementById('subtitle').innerText = "Nivå " + level;

    // Start riktig spill
    if(level === 1) initLevel1();
    if(level === 2) initLevel2();
    if(level === 3) initLevel3();
}

// ==========================================
// NIVÅ 1 LOGIKK (SUBSTITUSJON)
// ==========================================
let l1_answer = 0;

function initLevel1() {
    document.getElementById('level-1').classList.remove('hidden');
    document.getElementById('l1-input').value = "";
    document.getElementById('l1-feedback').innerText = "";
    
    // Generer oppgave: ax + b
    let x = Math.floor(Math.random() * 5) + 2; // x er mellom 2 og 6
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
        score += 10;
        updateScore();
        setTimeout(initLevel1, 1500);
    } else {
        fb.innerText = "Feil kode. Prøv igjen.";
        fb.style.color = "red";
    }
}

// ==========================================
// NIVÅ 2 LOGIKK (SORTERING/TREKKE SAMMEN)
// ==========================================
let l2_ansA = 0;
let l2_ansB = 0;

function initLevel2() {
    document.getElementById('level-2').classList.remove('hidden');
    document.getElementById('l2-input-a').value = "";
    document.getElementById('l2-input-b').value = "";
    document.getElementById('l2-feedback').innerText = "";
    
    const conveyor = document.getElementById('l2-conveyor');
    conveyor.innerHTML = ""; // Tøm båndet

    l2_ansA = 0;
    l2_ansB = 0;

    // Generer 4 til 6 ledd (f.eks 2a, b, 3a)
    let numItems = Math.floor(Math.random() * 3) + 4;
    
    for(let i=0; i<numItems; i++) {
        let type = Math.random() > 0.5 ? 'a' : 'b';
        let val = Math.floor(Math.random() * 4) + 1; // Tall 1-4
        
        // Oppdater fasit
        if(type === 'a') l2_ansA += val;
        else l2_ansB += val;

        // Vis på skjerm (hvis 1a, vis bare a)
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
        fb.innerText = `Korrekt! Svaret er ${l2_ansA}a + ${l2_ansB}b`;
        fb.style.color = "#0f0";
        score += 10;
        updateScore();
        setTimeout(initLevel2, 2000);
    } else {
        fb.innerText = "Feil antall. Tell en gang til.";
        fb.style.color = "red";
    }
}

// ==========================================
// NIVÅ 3 LOGIKK (BALANSEVEKT - LIGNINGER)
// ==========================================
// Ligning: ax + b = c  (Hvor vi sørger for at x er heltall)
let l3_a = 1; // Antall x-bokser
let l3_b = 0; // Antall lodd på venstre
let l3_c = 0; // Antall lodd på høyre
let l3_xVal = 0; // Verdien av x (skjult for eleven)

function initLevel3() {
    document.getElementById('level-3').classList.remove('hidden');
    document.getElementById('l3-feedback').innerText = "";
    
    // Generer en enkel ligning: 2x + 2 = 8 (f.eks)
    l3_xVal = Math.floor(Math.random() * 3) + 2; // x er 2, 3 eller 4
    l3_a = Math.floor(Math.random() * 2) + 2; // 2x eller 3x
    l3_b = Math.floor(Math.random() * 3) + 1; // 1 til 3 lodd ekstra
    
    // Regn ut høyre side
    l3_c = (l3_a * l3_xVal) + l3_b;

    renderScale();
}

// Funksjon som tegner boksene og loddene på nytt
function renderScale() {
    const leftPlate = document.getElementById('scale-left');
    const rightPlate = document.getElementById('scale-right');
    leftPlate.innerHTML = "";
    rightPlate.innerHTML = "";

    // Tegn venstre side (ax + b)
    for(let i=0; i<l3_a; i++) {
        leftPlate.innerHTML += `<div class="box-x">x</div>`;
    }
    for(let i=0; i<l3_b; i++) {
        leftPlate.innerHTML += `<div class="weight-1">1</div>`;
    }

    // Tegn høyre side (c)
    for(let i=0; i<l3_c; i++) {
        rightPlate.innerHTML += `<div class="weight-1">1</div>`;
    }
}

function scaleAction(action) {
    let fb = document.getElementById('l3-feedback');
    fb.innerText = "";

    if(action === 'sub1') {
        // Ta bort 1 fra begge sider
        if(l3_b > 0 && l3_c > 0) {
            l3_b--;
            l3_c--;
            renderScale();
        } else {
            fb.innerText = "Du kan ikke ta bort lodd hvis det er tomt på den ene siden!";
            fb.style.color = "orange";
        }
    } else if (action === 'div') {
        // Del på antall x (hvis loddene er borte)
        if(l3_b === 0) {
            if(l3_c % l3_a === 0) {
                // Utfør deling visuelt
                l3_c = l3_c / l3_a;
                l3_a = 1; // Vi sitter igjen med 1x
                renderScale();
                
                // Sjekk om ferdig
                fb.innerText = `Gratulerer! Du fant ut at x = ${l3_c}`;
                fb.style.color = "#0f0";
                score += 20;
                updateScore();
                setTimeout(initLevel3, 3000);
            } else {
                fb.innerText = "Det går ikke opp akkurat nå.";
            }
        } else {
            fb.innerText = "Du må fjerne loddene (+b) før du kan dele!";
            fb.style.color = "orange";
        }
    }
}

function updateScore() {
    document.getElementById('total-score').innerText = score;
}
