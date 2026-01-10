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
    { id: 'full_outfit', type: 'body', name: 'Grønn drakt', price: 300, cssClass: 'shirt-blue pants-green' },

    { id: 'pet_none', type: 'pet', name: 'Ingen dyr', price: 0, cssClass: '' },
    { id: 'pet_dog', type: 'pet', name: 'Hund', price: 250, cssClass: 'pet-dog' },
    { id: 'pet_robot', type: 'pet', name: 'Robot', price: 400, cssClass: 'pet-robot' },
    { id: 'pet_blob', type: 'pet', name: 'Matte-Blob', price: 350, cssClass: 'pet-blob' },

    { id: 'trail_none', type: 'trail', name: 'Ingen spor', price: 0, cssClass: '' },
    { id: 'trail_fire', type: 'trail', name: 'Ild', price: 300, cssClass: 'trail-fire' },
    { id: 'trail_rainbow', type: 'trail', name: 'Regnbue', price: 350, cssClass: 'trail-rainbow' },
    { id: 'trail_math', type: 'trail', name: 'Tall-dryss', price: 200, cssClass: 'trail-math' },

    { id: 'skin_default', type: 'skin', name: 'Standard', price: 0, cssClass: 'skin-default' },
    { id: 'skin_chalkboard', type: 'skin', name: 'Tavle', price: 150, cssClass: 'skin-chalkboard' },
    { id: 'skin_neon', type: 'skin', name: 'Neon', price: 250, cssClass: 'skin-neon' },
    { id: 'skin_parchment', type: 'skin', name: 'Pergament', price: 150, cssClass: 'skin-parchment' },

    { id: 'vic_none', type: 'victory', name: 'Ingen feiring', price: 0, cssClass: '' },
    { id: 'vic_confetti', type: 'victory', name: 'Konfetti', price: 200, cssClass: 'confetti' },
    { id: 'vic_disco', type: 'victory', name: 'Disco Lys', price: 300, cssClass: 'disco-bg' }
];

let inventory = ['bg_default', 'hat_none', 'body_none', 'pet_none', 'trail_none', 'skin_default', 'vic_none'];
let equipped = { 
    bg: 'bg_default', head: 'hat_none', body: 'body_none', pet: 'pet_none', trail: 'trail_none', skin: 'skin_default', victory: 'vic_none'
};

// --- HJELPERE ---
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.warn("Fant ikke elementet:", id);
    return el;
}

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
    const disp = getEl('expression');
    if (!disp) return;
    if (terms.length === 0) {
        disp.innerText = "Gjør en bevegelse for å starte...";
        return;
    }
    let str = "";
    terms.forEach((term, i) => {
        let sign = term.val >= 0 ? "+" : "-";
        if (i === 0) str += term.val < 0 ? `-${Math.abs(term.val)}${term.type}` : `${Math.abs(term.val)}${term.type}`;
        else str += ` ${sign} ${Math.abs(term.val)}${term.type}`;
    });
    disp.innerText = str;
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

    const stickman = getEl('stickman');
    if(stickman) stickman.style.left = position + "%";

    const rotator = getEl('stickman-rotator');
    if(rotator) {
        rotator.classList.remove('jump-anim', 'roll-anim');
        void rotator.offsetWidth; 
        if (type === 'h') rotator.classList.add('jump-anim');
        if (type === 'r') rotator.classList.add('roll-anim');
    }
}

function startSolving() {
    if (terms.length === 0) { alert("Gå litt først!"); return; }
    
    clearTimeout(timerId);
    erTimerAktiv = false;
    getEl('controls').classList.add('hidden');
    getEl('solve-btn').classList.add('hidden');
    getEl('solution-area').classList.remove('hidden');
    
    ['input-s', 'input-f', 'input-h', 'input-r'].forEach(id => {
        if(getEl(id)) getEl(id).value = '';
    });
    getEl('feedback').innerText = '';
}

function checkAnswer() {
    try {
        let uS = parseInt(getEl('input-s').value) || 0;
        let uF = parseInt(getEl('input-f').value) || 0;
        let uH = parseInt(getEl('input-h').value) || 0;
        let uR = parseInt(getEl('input-r').value) || 0;

        if (uS === totals.s && uF === totals.f && uH === totals.h && uR === totals.r) {
            let points = terms.length * 10;
            money += points;
            getEl('money').innerText = money;
            saveGame(); // LAGRE SPILLET

            getEl('feedback').innerText = `Riktig! Du tjente ${points} kr.`;
            getEl('feedback').style.color = 'green';
            getEl('next-round-btn').classList.remove('hidden');
            playVictoryAnimation();
        } else {
            getEl('feedback').innerText = "Feil svar. Prøv igjen!";
            getEl('feedback').style.color = 'red';
        }
    } catch (e) { console.error(e); }
}

function playVictoryAnimation() {
    const vicType = equipped.victory;
    if (vicType === 'vic_confetti') {
        const container = getEl('victory-container');
        container.innerHTML = '';
        for(let i=0; i<30; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(conf);
        }
    } else if (vicType === 'vic_disco') {
        getEl('game-scene').classList.add('disco-bg');
    }
}

function resetRound() {
    terms = [];
    totals = { s: 0, f: 0, h: 0, r: 0 }; 
    position = 50;
    
    clearTimeout(timerId);
    erTimerAktiv = false;
    forrigeType = null;
    
    updateExpressionDisplay();
    getEl('stickman').style.left = "50%";
    getEl('stickman-rotator').classList.remove('jump-anim', 'roll-anim');
    
    getEl('solution-area').classList.add('hidden');
    getEl('next-round-btn').classList.add('hidden');
    getEl('controls').classList.remove('hidden');
    getEl('solve-btn').classList.remove('hidden');
    getEl('feedback').innerText = "";
    getEl('victory-container').innerHTML = '';
    getEl('game-scene').classList.remove('disco-bg');
}

// --- BUTIKK & LAGRING ---

function toggleShop() {
    const shop = getEl('shop-overlay');
    shop.classList.toggle('hidden');
    if (!shop.classList.contains('hidden')) { filterShop('bg'); }
}

function filterShop(category) {
    const container = getEl('shop-items');
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
            buttonHtml = `<button class="buy-btn" onclick="buyItem('${item.id}')" ${canAfford ? "" : "disabled"}>Kjøp (${item.price} kr)</button>`;
        }
        itemDiv.innerHTML = `<h4>${item.name}</h4><p>${item.price} kr</p>${buttonHtml}`;
        container.appendChild(itemDiv);
    });
}

function buyItem(itemId) {
    const item = shopData.find(i => i.id === itemId);
    if (money >= item.price) {
        money -= item.price;
        getEl('money').innerText = money;
        inventory.push(itemId);
        equipItem(itemId);
        saveGame(); // LAGRE
    } else { alert("Ikke nok penger!"); }
}

function equipItem(itemId) {
    const item = shopData.find(i => i.id === itemId);
    equipped[item.type] = itemId;
    applyAppearance();
    saveGame(); // LAGRE
    if (!getEl('shop-overlay').classList.contains('hidden')) { filterShop(item.type); }
}

function applyAppearance() {
    const scene = getEl('game-scene');
    scene.className = 'scene'; 
    const bgItem = shopData.find(i => i.id === equipped.bg);
    if(bgItem) scene.classList.add(bgItem.cssClass); else scene.classList.add('default-bg');

    const rotator = getEl('stickman-rotator');
    rotator.className = 'stickman-rotator'; 
    const bodyItem = shopData.find(i => i.id === equipped.body);
    if (bodyItem && bodyItem.cssClass) { bodyItem.cssClass.split(' ').forEach(c => rotator.classList.add(c)); }

    const acc = getEl('accessory');
    acc.className = 'accessory';
    const headItem = shopData.find(i => i.id === equipped.head);
    if(headItem) acc.classList.add(headItem.cssClass);

    const petDiv = getEl('pet-display');
    petDiv.innerHTML = '';
    const petItem = shopData.find(i => i.id === equipped.pet);
    if(petItem && petItem.cssClass) {
        const p = document.createElement('div');
        p.className = petItem.cssClass;
        petDiv.appendChild(p);
    }

    const trailDiv = getEl('trail-display');
    trailDiv.className = 'trail-container';
    const trailItem = shopData.find(i => i.id === equipped.trail);
    if(trailItem) trailDiv.classList.add(trailItem.cssClass);

    const mathDiv = getEl('math-container');
    mathDiv.className = 'math-display';
    const skinItem = shopData.find(i => i.id === equipped.skin);
    if(skinItem) mathDiv.classList.add(skinItem.cssClass); else mathDiv.classList.add('skin-default');
}

// --- LOCALSTORAGE FUNKSJONER ---
function saveGame() {
    const saveData = {
        money: money,
        inventory: inventory,
        equipped: equipped
    };
    localStorage.setItem('algebraGameSave', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('algebraGameSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            money = data.money || 0;
            inventory = data.inventory || inventory;
            equipped = data.equipped || equipped;
            
            getEl('money').innerText = money;
            applyAppearance();
        } catch (e) {
            console.error("Kunne ikke laste lagring", e);
        }
    }
}

function clearSave() {
    if(confirm("Er du sikker på at du vil slette lagringen og starte på nytt?")) {
        localStorage.removeItem('algebraGameSave');
        location.reload();
    }
}

// Start spillet
loadGame();
