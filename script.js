// --- SPILL VARIABLER ---
let terms = []; 
let totals = { s: 0, f: 0, h: 0, r: 0 }; 
let position = 50; 
let money = 0; 

// Timer variabler
let timerId = null; 
let erTimerAktiv = false; 
let forrigeType = null; 
let forrigeRetning = 0; 

// --- BUTIKK DATA ---
const shopData = [
    { id: 'bg_default', type: 'bg', name: 'Standard Himmel', price: 0, cssClass: 'default-bg' },
    { id: 'bg_desert', type: 'bg', name: 'Ørken', price: 50, cssClass: 'desert-bg' },
    { id: 'bg_forest', type: 'bg', name: 'Skog', price: 100, cssClass: 'forest-bg' },
    { id: 'bg_night', type: 'bg', name: 'Natt', price: 200, cssClass: 'night-bg' },
    
    { id: 'hat_none', type: 'head', name: 'Ingen hatt', price: 0, cssClass: '' },
    { id: 'hat_cowboy', type: 'head', name: 'Cowboyhatt', price: 150, cssClass: 'hat-cowboy' },
    { id: 'hat_caps', type: 'head', name: 'Rød Caps', price: 100, cssClass: 'hat-caps' },
    { id: 'hat_glasses', type: 'head', name: 'Briller', price: 80, cssClass: 'hat-glasses' },

    { id: 'body_none', type: 'body', name: 'Standard strek', price: 0, cssClass: '' },
    { id: 'shirt_red', type: 'body', name: 'Rød T-skjorte', price: 120, cssClass: 'shirt-red' },
    { id: 'shirt_blue', type: 'body', name: 'Blå T-skjorte', price: 120, cssClass: 'shirt-blue' },
    { id: 'pants_jeans', type: 'body', name: 'Dongeribukse', price: 120, cssClass: 'pants-jeans' },
    { id: 'full_outfit', type: 'body', name: 'Grønn drakt', price: 300, cssClass: 'shirt-blue pants-green' }
];

let inventory = ['bg_default', 'hat_none', 'body_none'];
let equipped = { bg: 'bg_default', head: 'hat_none', body: 'body_none' };

// --- HENT ELEMENTER SIKKERT ---
// Vi bruker en trygg metode for å finne elementer så ikke hele spillet krasjer hvis ett mangler
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.error("Fant ikke elementet med ID:", id);
    return el;
}

const stickman = getEl('stickman');
const expressionDisplay = getEl('expression');
const controlsDiv = getEl('controls');
const solveBtn = getEl('solve-btn');
const solutionArea = getEl('solution-area');
const feedbackText = getEl('feedback');
const moneyDisplay = getEl('money'); // VIKTIG: I index.html må det stå id="money", ikke id="score"
const nextRoundBtn = getEl('next-round-btn');
const shopOverlay = getEl('shop-overlay');

// --- SPILL LOGIKK ---

function move(type, value) {
    if(!stickman) return; // Sikkerhet

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
    if (!expressionDisplay) return;
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

    if(stickman) stickman.style.left = position + "%";

    const rotator = document.getElementById('stickman-rotator');
    if(rotator) {
        rotator.classList.remove('jump-anim', 'roll-anim');
        void rotator.offsetWidth; 
        if (type === 'h') rotator.classList.add('jump-anim');
        if (type === 'r') rotator.classList.add('roll-anim');
    }
}

function startSolving() {
    if (terms.length === 0) { alert("Gå litt først!"); return; }
    
    // Stopp timer
    clearTimeout(timerId);
    erTimerAktiv = false;

    // Bytt visning
    if(controlsDiv) controlsDiv.classList.add('hidden');
    if(solveBtn) solveBtn.classList.add('hidden');
    if(solutionArea) solutionArea.classList.remove('hidden');
    
    // Tøm input
    if(getEl('input-s')) getEl('input-s').value = '';
    if(getEl('input-f')) getEl('input-f').value = '';
    if(getEl('input-h')) getEl('input-h').value = '';
    if(getEl('input-r')) getEl('input-r').value = '';
    if(feedbackText) feedbackText.innerText = '';
}

function checkAnswer() {
    // Vi bruker try-catch for å fange feil hvis noe kræsjer
    try {
        let uS = parseInt(document.getElementById('input-s').value) || 0;
        let uF = parseInt(document.getElementById('input-f').value) || 0;
        let uH = parseInt(document.getElementById('input-h').value) || 0;
        let uR = parseInt(document.getElementById('input-r').value) || 0;

        // Debugging: Hvis du lurer på hva fasiten er
        console.log("Ditt svar:", uS, uF, uH, uR);
        console.log("Fasit:", totals.s, totals.f, totals.h, totals.r);

        if (uS === totals.s && uF === totals.f && uH === totals.h && uR === totals.r) {
            let points = terms.length * 10;
            money += points;
            
            if(moneyDisplay) moneyDisplay.innerText = money;
            else alert("Fant ikke pengetelleren (moneyDisplay). Sjekk at du bruker riktig HTML.");

            if(feedbackText) {
                feedbackText.innerText = `Riktig! Du tjente ${points} kr.`;
                feedbackText.style.color = 'green';
            }
            if(nextRoundBtn) nextRoundBtn.classList.remove('hidden');
        } else {
            if(feedbackText) {
                feedbackText.innerText = "Feil svar. Prøv igjen!";
                feedbackText.style.color = 'red';
            }
        }
    } catch (error) {
        alert("Noe gikk galt i sjekk-svar funksjonen: " + error.message);
        console.error(error);
    }
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0, r: 0 }; 
    position = 50;
    
    clearTimeout(timerId);
    erTimerAktiv = false;
    forrigeType = null;
    
    if(expressionDisplay) expressionDisplay.innerText = "Gjør en bevegelse for å starte...";
    if(stickman) stickman.style.left = "50%";
    
    const rotator = document.getElementById('stickman-rotator');
    if(rotator) rotator.classList.remove('jump-anim', 'roll-anim');
    
    if(solutionArea) solutionArea.classList.add('hidden');
    if(nextRoundBtn) nextRoundBtn.classList.add('hidden');
    if(controlsDiv) controlsDiv.classList.remove('hidden');
    if(solveBtn) solveBtn.classList.remove('hidden');
    if(feedbackText) feedbackText.innerText = "";
}

// --- BUTIKK FUNKSJONER ---

function toggleShop() {
    if(shopOverlay) {
        shopOverlay.classList.toggle('hidden');
        if (!shopOverlay.classList.contains('hidden')) {
            filterShop('bg'); 
        }
    }
}

function filterShop(category) {
    const container = document.getElementById('shop-items');
    if(!container) return;
    
    container.innerHTML = ""; 

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
        if(moneyDisplay) moneyDisplay.innerText = money;
        inventory.push(itemId);
        equipItem(itemId); 
        filterShop(item.type); 
    } else {
        alert("Du har ikke nok penger!");
    }
}

function equipItem(itemId) {
    const item = shopData.find(i => i.id === itemId);
    equipped[item.type] = itemId;
    applyAppearance();
    if (shopOverlay && !shopOverlay.classList.contains('hidden')) {
        filterShop(item.type);
    }
}

function applyAppearance() {
    const scene = document.getElementById('game-scene');
    if(scene) {
        scene.className = 'scene'; 
        const bgItem = shopData.find(i => i.id === equipped.bg);
        if (bgItem && bgItem.cssClass) scene.classList.add(bgItem.cssClass);
        else scene.classList.add('default-bg');
    }

    const rotator = document.getElementById('stickman-rotator');
    if(rotator) {
        rotator.className = 'stickman-rotator'; 
        const bodyItem = shopData.find(i => i.id === equipped.body);
        if (bodyItem && bodyItem.cssClass) {
            const classes = bodyItem.cssClass.split(' ');
            classes.forEach(c => rotator.classList.add(c));
        }
    }

    const accessoryDiv = document.getElementById('accessory');
    if(accessoryDiv) {
        accessoryDiv.className = 'accessory'; 
        const headItem = shopData.find(i => i.id === equipped.head);
        if (headItem && headItem.cssClass) accessoryDiv.classList.add(headItem.cssClass);
    }
}

// Initialiser spillet
if(moneyDisplay) moneyDisplay.innerText = money;
applyAppearance();
