// --- SPILL VARIABLER ---
let terms = []; 
let totals = { s: 0, f: 0, h: 0, r: 0 }; 
let position = 50; 
let money = 0; // Totale penger (poeng) man har

// Timer variabler
let timerId = null; 
let erTimerAktiv = false; 
let forrigeType = null; 
let forrigeRetning = 0; 

// --- BUTIKK DATA ---
// Her definerer vi hva som finnes i butikken
const shopData = [
    // BAKGRUNNER
    { id: 'bg_default', type: 'bg', name: 'Standard Himmel', price: 0, cssClass: 'default-bg' },
    { id: 'bg_desert', type: 'bg', name: 'Ørken', price: 50, cssClass: 'desert-bg' },
    { id: 'bg_forest', type: 'bg', name: 'Skog', price: 100, cssClass: 'forest-bg' },
    { id: 'bg_night', type: 'bg', name: 'Natt', price: 200, cssClass: 'night-bg' },
    
    // HODEPLAGG
    { id: 'hat_none', type: 'head', name: 'Ingen hatt', price: 0, cssClass: '' },
    { id: 'hat_cowboy', type: 'head', name: 'Cowboyhatt', price: 150, cssClass: 'hat-cowboy' },
    { id: 'hat_caps', type: 'head', name: 'Rød Caps', price: 100, cssClass: 'hat-caps' },
    { id: 'hat_glasses', type: 'head', name: 'Briller', price: 80, cssClass: 'hat-glasses' },

    // KLÆR (KROPP/BEIN)
    { id: 'body_none', type: 'body', name: 'Standard strek', price: 0, cssClass: '' },
    { id: 'shirt_red', type: 'body', name: 'Rød T-skjorte', price: 120, cssClass: 'shirt-red' },
    { id: 'shirt_blue', type: 'body', name: 'Blå T-skjorte', price: 120, cssClass: 'shirt-blue' },
    { id: 'pants_jeans', type: 'body', name: 'Dongeribukse', price: 120, cssClass: 'pants-jeans' },
    { id: 'full_outfit', type: 'body', name: 'Grønn drakt', price: 300, cssClass: 'shirt-blue pants-green' } // Kombinasjon
];

// Lager for hva spilleren eier (starter med standard ting)
let inventory = ['bg_default', 'hat_none', 'body_none'];

// Hva har spilleren på seg nå?
let equipped = {
    bg: 'bg_default',
    head: 'hat_none',
    body: 'body_none'
};

// --- ELEMENTER ---
const stickman = document.getElementById('stickman');
const expressionDisplay = document.getElementById('expression');
const controlsDiv = document.getElementById('controls');
const solveBtn = document.getElementById('solve-btn');
const solutionArea = document.getElementById('solution-area');
const feedbackText = document.getElementById('feedback');
const moneyDisplay = document.getElementById('money');
const nextRoundBtn = document.getElementById('next-round-btn');
const shopOverlay = document.getElementById('shop-overlay');

// --- SPILL LOGIKK ---

function move(type, value) {
    totals[type] += value;
    let denneRetning = Math.sign(value); 

    if (erTimerAktiv === true && forrigeType === type && forrigeRetning === denneRetning) {
        let sisteIndex = terms.length - 1;
        terms[sisteIndex].val += value;
    } else {
        terms.push({ type: type, val: value });
    }

    if (timerId) clearTimeout(timerId);
    erTimerAktiv = true;
    forrigeType = type;
    forrigeRetning = denneRetning;

    timerId = setTimeout(() => {
        erTimerAktiv = false;
        forrigeType = null;
    }, 2000);

    updateExpressionDisplay();
    updateVisuals(type, value);
}

function updateExpressionDisplay() {
    if (terms.length === 0) {
        expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
        return;
    }
    let str = "";
    terms.forEach((term, i) => {
        let sign = term.val >= 0 ? "+" : "-";
        if (i === 0) str += term.val < 0 ? `-${Math.abs(term.val)}${term.type}` : `${Math.abs(term.val)}${term.type}`;
        else str += ` ${sign} ${Math.abs(term.val)}${term.type}`;
    });
    expressionDisplay.innerText = str;
}

function updateVisuals(type, value) {
    let moveAmount = 0;
    if (type === 's') moveAmount = 5;
    if (type === 'f') moveAmount = 2;
    if (type === 'h') moveAmount = 10;
    if (type === 'r') moveAmount = 8; 
    if (value < 0) moveAmount *= -1;

    position += moveAmount;
    if (position > 95) position = 95;
    if (position < 5) position = 5;

    stickman.style.left = position + "%";

    const rotator = document.getElementById('stickman-rotator');
    rotator.classList.remove('jump-anim', 'roll-anim');
    void rotator.offsetWidth; 

    if (type === 'h') rotator.classList.add('jump-anim');
    if (type === 'r') rotator.classList.add('roll-anim');
}

function startSolving() {
    if (terms.length === 0) { alert("Gå litt først!"); return; }
    clearTimeout(timerId);
    erTimerAktiv = false;
    controlsDiv.classList.add('hidden');
    solveBtn.classList.add('hidden');
    solutionArea.classList.remove('hidden');
    
    document.getElementById('input-s').value = '';
    document.getElementById('input-f').value = '';
    document.getElementById('input-h').value = '';
    document.getElementById('input-r').value = '';
    feedbackText.innerText = '';
}

function checkAnswer() {
    let uS = parseInt(document.getElementById('input-s').value) || 0;
    let uF = parseInt(document.getElementById('input-f').value) || 0;
    let uH = parseInt(document.getElementById('input-h').value) || 0;
    let uR = parseInt(document.getElementById('input-r').value) || 0;

    if (uS === totals.s && uF === totals.f && uH === totals.h && uR === totals.r) {
        let points = terms.length * 10;
        
        // Bonus: Gi mer penger hvis stykket er langt!
        money += points;
        moneyDisplay.innerText = money;
        
        feedbackText.innerText = `Riktig! Du tjente ${points} kr.`;
        feedbackText.style.color = 'green';
        nextRoundBtn.classList.remove('hidden');
    } else {
        feedbackText.innerText = "Feil svar. Prøv igjen!";
        feedbackText.style.color = 'red';
    }
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0, r: 0 }; 
    position = 50;
    clearTimeout(timerId);
    erTimerAktiv = false;
    forrigeType = null;
    expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    stickman.style.left = "50%";
    const rotator = document.getElementById('stickman-rotator');
    rotator.classList.remove('jump-anim', 'roll-anim');
    solutionArea.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    solveBtn.classList.remove('hidden');
    feedbackText.innerText = "";
}

// --- BUTIKK FUNKSJONER ---

function toggleShop() {
    shopOverlay.classList.toggle('hidden');
    if (!shopOverlay.classList.contains('hidden')) {
        filterShop('bg'); // Vis bakgrunner som standard når butikken åpnes
    }
}

function filterShop(category) {
    const container = document.getElementById('shop-items');
    container.innerHTML = ""; // Tøm butikken

    // Finn varer som matcher kategorien
    const itemsToShow = shopData.filter(item => item.type === category);

    itemsToShow.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const isOwned = inventory.includes(item.id);
        const isEquipped = (equipped[item.type] === item.id);
        
        let buttonHtml = "";
        
        if (isEquipped) {
            buttonHtml = `<button class="buy-btn" disabled>I bruk</button>`;
        } else if (isOwned) {
            buttonHtml = `<button class="buy-btn equip" onclick="equipItem('${item.id}')">Bruk</button>`;
        } else {
            // Sjekk om vi har råd
            const canAfford = money >= item.price;
            const disabledAttr = canAfford ? "" : "disabled";
            buttonHtml = `<button class="buy-btn" onclick="buyItem('${item.id}')" ${disabledAttr}>Kjøp (${item.price} kr)</button>`;
        }

        itemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.price > 0 ? item.price + ' kr' : 'Gratis'}</p>
            ${buttonHtml}
        `;
        container.appendChild(itemDiv);
    });
}

function buyItem(itemId) {
    const item = shopData.find(i => i.id === itemId);
    if (money >= item.price) {
        money -= item.price;
        moneyDisplay.innerText = money;
        inventory.push(itemId);
        equipItem(itemId); // Ta på tingen automatisk når du kjøper
        filterShop(item.type); // Oppdater butikken
    } else {
        alert("Du har ikke nok penger!");
    }
}

function equipItem(itemId) {
    const item = shopData.find(i => i.id === itemId);
    
    // Oppdater variabelen
    equipped[item.type] = itemId;

    // Oppdater utseendet på spillet
    applyAppearance();
    
    // Oppdater butikk-knappene hvis butikken er åpen
    if (!shopOverlay.classList.contains('hidden')) {
        filterShop(item.type);
    }
}

function applyAppearance() {
    // 1. Sett bakgrunn
    const scene = document.getElementById('game-scene');
    // Fjern alle gamle bakgrunns-klasser
    scene.className = 'scene'; 
    // Legg til den nye (finn klassenavnet fra inventory)
    const bgItem = shopData.find(i => i.id === equipped.bg);
    if (bgItem && bgItem.cssClass) scene.classList.add(bgItem.cssClass);
    else scene.classList.add('default-bg');

    // 2. Sett klær (på rotator)
    const rotator = document.getElementById('stickman-rotator');
    // Fjern animasjonsklasser midlertidig for å ikke miste dem, men fjern gamle klesklasser
    // Det enkleste er å resette className og legge tilbake animasjonene hvis de kjører (men det gjør de sjelden i butikken)
    rotator.className = 'stickman-rotator'; 
    
    const bodyItem = shopData.find(i => i.id === equipped.body);
    if (bodyItem && bodyItem.cssClass) {
        // En ting kan ha flere klasser (f.eks "shirt-blue pants-green"), split dem
        const classes = bodyItem.cssClass.split(' ');
        classes.forEach(c => rotator.classList.add(c));
    }

    // 3. Sett hatt (i accessory div)
    const accessoryDiv = document.getElementById('accessory');
    accessoryDiv.className = 'accessory'; // Reset
    
    const headItem = shopData.find(i => i.id === equipped.head);
    if (headItem && headItem.cssClass) accessoryDiv.classList.add(headItem.cssClass);
}

// Initialiser spillet
moneyDisplay.innerText = money;
applyAppearance();
