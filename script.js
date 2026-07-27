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

const SPRAVNE_HESLO = "tester123!"; 

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
    
    if (inputEl.value === SPRAVNE_HESLO) {
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
        if (segs > 1) { ctx.strokeStyle = fZlata; ctx.lineWidth = isMain ? 2 : 1; ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + r * Math.cos(a), c + r * Math.sin(a)); ctx.stroke(); }
        ctx.save(); ctx.translate(c, c); ctx.rotate(a + arc / 2); ctx.textAlign = "right"; ctx.fillStyle = (ctx.fillStyle === fBiela) ? "#121214" : "#ffffff";
        ctx.font = `bold ${isMain ? 13 : 11}px sans-serif`; ctx.fillText((zVset.indexOf(zDost[i]) + 1).toString(), r - (isMain ? 20 : 10), 4); ctx.restore();
    }
    ctx.strokeStyle = fZlata; ctx.lineWidth = isMain ? 6 : 4; ctx.beginPath(); ctx.arc(c, c, r, 0, 2 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(c, c, isMain ? 16 : 8, 0, 2 * Math.PI); ctx.fillStyle = fZlata; ctx.fill();
}

function spin(cId, bId, rId, zoznam, key, onComp) {
    const canvas = document.getElementById(cId), btn = document.getElementById(bId), res = document.getElementById(rId);
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    btn.disabled = true; res.textContent = "Točím...";
    const dur = 4000, start = angles[key], add = (Math.random() * 4 * Math.PI) + 8 * Math.PI, target = start + add, sTime = performance.now(), arc = (2 * Math.PI) / zoznam.length;
    let lastSeg = -1;
    function anim(cTime) {
        const el = cTime - sTime;
        if (el < dur) {
            angles[key] = start + (add * (1 - Math.pow(1 - (el / dur), 4))); canvas.style.transform = `rotate(${angles[key] * (180 / Math.PI)}deg)`;
            if (Math.floor(angles[key] / arc) !== lastSeg) { playClickSound(); lastSeg = Math.floor(angles[key] / arc); }
            requestAnimationFrame(anim);
        } else {
            angles[key] = target; canvas.style.transform = `rotate(${target * (180 / Math.PI)}deg)`; btn.disabled = false;
            const item = zoznam[Math.floor(((2 * Math.PI - (target % (2 * Math.PI))) % (2 * Math.PI) + (3 * Math.PI / 2)) % (2 * Math.PI) / arc) % zoznam.length];
            res.textContent = `Dnes sa ${mnozneCisloJedla.includes(item) ? "budú" : "bude"} pripravovať: ${item} dobrú chuť!`;
            if (onComp) onComp(item);
            if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        }
    }
    requestAnimationFrame(anim);
}
