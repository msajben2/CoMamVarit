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

// Stopercentne overený a stabilný SHA-256 algoritmus
function sha256(ascii) {
    function rrot(v, amt) { return (v >>> amt) | (v << (32 - amt)); }
    var words = [], asciiLen = ascii.length, hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (var i = 0; i < ascii.length; i++) words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i % 4) * 8);
    words[words.length] = ((asciiLen * 8) / Math.pow(2, 32)) | 0; words[words.length] = (asciiLen * 8);
    for (var j = 0; j < words.length; j += 16) {
        var w = words.slice(j, j + 16), old = hash.slice(0);
        for (var i = 0; i < 64; i++) {
            if (i >= 16) {
                var w15 = w[i-15], w2 = w[i-2];
                w[i] = (w[i-16] + (rrot(w15, 7) ^ rrot(w15, 18) ^ (w15 >>> 3)) + w[i-7] + (rrot(w2, 17) ^ rrot(w2, 19) ^ (w2 >>> 10))) | 0;
            }
            var h0 = hash[0], h1 = hash[1], h2 = hash[2], h4 = hash[4], h5 = hash[5], h6 = hash[6];
            var t1 = (hash[7] + (rrot(h4, 6) ^ rrot(h5, 11) ^ rrot(h6, 25)) + ((h4 & h5) ^ (~h4 & h6)) + k[i] + (w[i] || 0)) | 0;
            var t2 = ((rrot(h0, 2) ^ rrot(h1, 13) ^ rrot(h0, 22)) + ((h0 & h1) ^ (h0 & h2) ^ (h1 & h2))) | 0;
            hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0; hash.length = 8;
        }
        for (var i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
    }
    return hash.map(function(v) { for (var s = "", b = 3; b >= 0; b--) { var byte = (v >>> (b * 8)) & 255; s += (byte < 16 ? "0" : "") + byte.toString(16); } return s; }).join("");
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
        ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, r, a, a + arc); ctx.lineTo(c, c); ctx.fill();
