const cScript = document.createElement('script');
cScript.src = "https://jsdelivr.net";
document.head.appendChild(cScript);

const vsetkyRecepty = ["Sviečková", "Segedínsky guľáš", "Špagety s bolognskou omáčkou", "Granatír", "Francúzske zemiaky", "Rezne", "Pečené bravčové mäso", "Koložvárska kapusta", "Pečené kura s ryžou", "Vyprážaný syr", "Rizoto", "Restovaná bravčová panenka", "Špenát", "Pečené kačacie stehná, kapusta, knedľa", "Plnená paprika, knedľa", "Vyprážaný karfiol", "Bratislavské pliecko", "Chrenová omáčka s mäsom", "Čevabčiči", "Fašírky", "Jaternice", "Bravčové na šampiňónoch", "Perkelt", "Paprikáš", "Bravčové na korení", "Vyprážané šampiňóny", "Bravčové na zelenine", "Tekvicový prívarok", "Cestoviny s kuracím mäsom", "Kôprová omáčka", "Bryndzové halušky"];
const vsetkyPolievky = ["Fazuľová", "Šošovicová", "Kapustnica", "Cesnaková", "Zeleninová", "Rascová", "Hlivová", "Omáčka zemiaková"];
const vsetkyDezerty = ["Parené buchty", "Palacinky", "Mrkvové šatôčky", "Makový/Jablkový koláč", "Šišky", "Bublanina"];
const mnozneCisloJedla = ["Parené buchty", "Palacinky", "Šišky", "Mrkvové šatôčky", "Špagety s bolognskou omáčkou", "Francúzske zemiaky", "Rezne", "Pečené kačacie stehná, kapusta, knedľa", "Fašírky", "Jaternice", "Vyprážané šampiňóny", "Cestoviny s kuracím mäsom", "Bryndzové halušky"];

const fZlata = "#e5c158", fCervena = "#c92a2a", fBiela = "#f8f9fa", fPrechod = "#7a1c1c";
const BLOKOVANIE_MS = 21 * 24 * 60 * 60 * 1000;
let dostupneRecepty = [], dostupnePolievky = [], dostupneDezerty = [], angles = { main: 0, soup: 0, dessert: 0 };

// Bezpečný odtlačok pre heslo "tester123!"
const SPRAVNE_HESLO_HASH = "7c2a71556942c7aa7c191a3c79a4055b85434d31481e1a5f6e80b6dc36b41297";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (!audioCtx) return;
    const osc1 = audioCtx.createOscillator(), osc2 = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc1.type = 'triangle'; osc1.frequency.setValueAtTime(150, audioCtx.currentTime); osc1.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.03);
    osc2.type = 'sine'; osc2.frequency.setValueAtTime(1200, audioCtx.currentTime); osc2.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.01);
    g.gain.setValueAtTime(0.2, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc1.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
    osc1.start(); osc2.start(); osc1.stop(audioCtx.currentTime + 0.03); osc2.stop(audioCtx.currentTime + 0.03);
}

// Čistý matematický algoritmus SHA-256 nezávislý od prehliadača
function sha256(ascii) {
    function rightRotate(value, amount) { return (value>>>amount) | (value<<(32 - amount)); }
    var mathPow = Math.pow; var maxWord = mathPow(2, 32); var lengthProperty = 'length'; var i, j; var result = ''; var words = []; var asciiLength = ascii[lengthProperty];
    var hash = [], k = []; var primeCounter = 0; var isPrime = {};
    for (var hashIndex = 2; primeCounter < 64; hashIndex++) {
        if (!isPrime[hashIndex]) {
            for (i = 0; i < 300; i += hashIndex) { isPrime[i] = true; }
            if (primeCounter < 8) { hash[primeCounter] = (mathPow(hashIndex, .5) * maxWord) | 0; }
            k[primeCounter] = (mathPow(hashIndex, 1/3) * maxWord) | 0; primeCounter++;
        }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) { ascii += '\x00'; }
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i); if (j >> 8) return; words[i >> 2] |= j << ((3 - i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0; words[words[lengthProperty]] = (asciiLength * 8);
    for (j = 0; j < words[lengthProperty]; j += 16) {
        var w = words.slice(j, j + 16); var oldHash = hash.slice(0);
        for (i = 0; i < 64; i++) {
            if (i >= 16) {
                var w15 = w[i - 15], w2 = w[i - 2];
                var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
                var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
                w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
            }
            var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            var s0_h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
            var s1_h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
            var t1 = (hash[7] + s1_h + ch + k[i] + (w[i] || 0)) | 0; var t2 = (s0_h + maj) | 0;
            hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0; hash.length = 8;
        }
        for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? '0' : '') + b.toString(16); }
    }
    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('kuchynaOverena') === 'true') pustitDoAplikacie();
    document.getElementById('login-btn')?.addEventListener('click', overHeslo);
    document.getElementById('password-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') overHeslo(); });

    const bindReset = (bId, sKey, rId) => document.getElementById(bId)?.addEventListener('click', () => { localStorage.removeItem(sKey); document.getElementById(rId).textContent = "Resetované"; aktualizujVsetkyKolesa(); });
    bindReset('reset-main-btn', 'uvareneRecepty', 'result-display');
    bindReset('reset-soup-btn', 'uvarenePolievky', 'soup-result');
    bindReset('reset-dessert-btn', 'uvareneDezerty', 'dessert-result');

    document.getElementById('spin-btn')?.addEventListener('click', () => spin('wheelCanvas', 'spin-btn', 'result-display', dostupneRecepty, 'main', (v) => { ulozDoHistorie('uvareneRecepty', v); setTimeout(aktualizujVsetkyKolesa, 1200); }));
    document.getElementById('spin-soup-btn')?.addEventListener('click', () => spin('soupCanvas', 'spin-soup-btn', 'soup-result', dostupnePolievky, 'soup', (v) => { ulozDoHistorie('uvarenePolievky', v); setTimeout(aktualizujVsetkyKolesa, 1200); }));
    document.getElementById('spin-dessert-btn')?.addEventListener('click', () => spin('dessertCanvas', 'spin-dessert-btn', 'dessert-result', dostupneDezerty, 'dessert', (v) => { ulozDoHistorie('uvareneDezerty', v); setTimeout(aktualizujVsetkyKolesa, 1200); }));
});

function overHeslo() {
    const inputEl = document.getElementById('password-input'), errorEl = document.getElementById('login-error');
    if (!inputEl) return;
    
    // Porovnanie cez natívny algoritmus fungujúci všade
    if (sha256(inputEl.value) === SPRAVNE_HESLO_HASH) {
        sessionStorage.setItem('kuchynaOverena', 'true');
        pustitDoAplikacie();
    } else {
        if (errorEl) errorEl.textContent = "Nesprávne heslo do kuchyne!";
        inputEl.value = "";
    }
}

function pustitDoAplikacie() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    aktualizujVsetkyKolesa();
}

function ziskajHistoriu(key) {
    const data = JSON.parse(localStorage.getItem(key)) || {}, teraz = Date.now(), upData = {};
    for (const [item, cas] of Object.entries(data)) { if (teraz - cas < BLOKOVANIE_MS) upData[item] = cas; }
    localStorage.setItem(key, JSON.stringify(upData)); return upData;
}

function ulozDoHistorie(key, item) {
    const data = JSON.parse(localStorage.getItem(key)) || {};
    data[item] = Date.now(); localStorage.setItem(key, JSON.stringify(data));
}

function aktualizujVsetkyKolesa() {
    if (sessionStorage.getItem('kuchynaOverena') !== 'true') return;
    const hMain = ziskajHistoriu('uvareneRecepty'), hSoup = ziskajHistoriu('uvarenePolievky'), hDessert = ziskajHistoriu('uvareneDezerty');
    dostupneRecepty = vsetkyRecepty.filter(r => !Object.keys(hMain).includes(r));
    dostupnePolievky = vsetkyPolievky.filter(p => !Object.keys(hSoup).includes(p));
    dostupneDezerty = vsetkyDezerty.filter(d => !Object.keys(hDessert).includes(d));

    const bList = document.getElementById('blocked-list');
    if (bList) {
        bList.innerHTML = "";
        const pridaj = (obj, pfx) => Object.entries(obj).forEach(([item, cas]) => {
            const li = document.createElement('li'); li.textContent = `❌ [${pfx}] ${item} (ešte ${Math.ceil((BLOKOVANIE_MS - (Date.now() - cas)) / (1000 * 60 * 60 * 24))} dní)`; bList.appendChild(li);
        });
        pridaj(hMain, "Hlavné"); pridaj(hSoup, "Polievka"); pridaj(hDessert, "Dezert");
    }
    if (dostupneRecepty.length === 0) { localStorage.removeItem('uvareneRecepty'); aktualizujVsetkyKolesa(); return; }
    if (dostupnePolievky.length === 0) { localStorage.removeItem('uvarenePolievky'); aktualizujVsetkyKolesa(); return; }
    if (dostupneDezerty.length === 0) { localStorage.removeItem('uvareneDezerty'); aktualizujVsetkyKolesa(); return; }
    draw('wheelCanvas', dostupneRecepty, vsetkyRecepty, true);
    draw('soupCanvas', dostupnePolievky, vsetkyPolievky, false);
    draw('dessertCanvas', dostupneDezerty, vsetkyDezerty, false);
}

function draw(cId, zDost, zVset, isMain) {
    const canvas = document.getElementById(cId); if (!canvas) return;
    const ctx = canvas.getContext('2d'), segs = zDost.length, c = canvas.width / 2, r = c - 8, arc = (2 * Math.PI) / segs;
    ctx.clearRect(0, 0, canvas.width, canvas.height); if (segs === 0) return;
    for (let i = 0; i < segs; i++) {
        const a = i * arc; ctx.fillStyle = (i === segs - 1 && segs % 2 === 0) ? fPrechod : ((i % 2 === 0) ? fCervena : fBiela);
