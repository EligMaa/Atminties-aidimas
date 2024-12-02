// Paveikslėlių masyvas su vaisių vaizdais
const paveiksliukai = [
    "ananasas.jpg", "apelsinas.jpg", "arbuzas.jpg",
    "obuolys.jpg", "vynuoge.jpg", "vysnios.jpg",
    "citrina.jpg", "braske.jpg", "banana.jpg", "kriause.jpg",
    "melionas.jpg", "slyva.jpg", "mangas.jpg", "avokadas.jpg", "persikas.jpg"
];

// Pasirinktas lygis ir porų skaičius
let pasirinktasLygis = 5; // Numatytas lygis (vidutinis lygis)
const lygioSelect = document.getElementById('lygiai');

// Pasirinkto lygio keitimo įvykis
lygioSelect.addEventListener('change', function () {
    pasirinktasLygis = parseInt(this.value); // Atnaujina pasirinktą lygį pagal vartotojo įvestį
});

const zaidimas = document.querySelector('.zaidimas'); // Žaidimo lenta
let rezultatas = 0; // Pradinis rezultatas
let pirmaPoraRasta = false; // Ar pirmoji pora jau surasta
const rezultatasElementas = document.querySelector('.rezultatas'); // Elementas, kuris rodys rezultatą
const vardasInput = document.getElementById('vardas'); // Vartotojo vardo įvesties laukas
const klaidaElementas = document.getElementById('klaida'); // Elementas klaidų rodymui
const geriausiRezultataiElementas = document.getElementById('geriausi-rezultatai'); // Geriausių rezultatų lentelė
const zaidimoContainer = document.getElementById('zaidimo-container'); // Žaidimo konteineris

// Paslėpti žaidimo lentą, kol žaidimas nepradėtas
function pradetiZaisti() {
    document.getElementById('pradzia').style.display = 'none'; // Paslepia pradžios ekraną
    zaidimoContainer.style.display = 'block'; // Parodo žaidimo lentą

    // Pasirinkti atsitiktinius paveikslėlius pagal vartotojo pasirinkimą
    const pasirinktosKorteles = paveiksliukai.slice(0, pasirinktasLygis);

    // Sukurti poras ir sumaišyti atsitiktine tvarka
    const kortelesData = [...pasirinktosKorteles, ...pasirinktosKorteles].sort(() => Math.random() - 0.5);

    // Generuoti korteles ir pridėti jas į žaidimo lentą
    kortelesData.forEach(img => {
        const kortele = document.createElement('div');
        kortele.className = 'kortele';
        kortele.innerHTML = `<img src="${img}" alt="${img}">`; // Sukurti HTML su vaizdu
        zaidimas.appendChild(kortele); // Pridėti kortelę į žaidimo lentą
    });
}

let pasirinktosKorteles = []; // Pasirinktos poros saugojimui
let uzrakintaLenta = false; // Užrakinama lenta tikrinimo metu, kad išvengtume klaidų

// Įvykis paspaudus ant kortelės
zaidimas.addEventListener('click', (e) => {
    const paspausta = e.target.closest('.kortele'); // Tikriname, ar paspaustas elementas yra kortelė
    if (!paspausta || paspausta.classList.contains('flipped') || uzrakintaLenta) return; // Jei kortelė jau apversta arba lenta užrakinta, nieko nedarome

    paspausta.classList.add('flipped'); // Apverčiame kortelę
    pasirinktosKorteles.push(paspausta); // Pridedame kortelę į pasirinktas korteles

    if (pasirinktosKorteles.length === 2) { // Jei pasirinktos dvi kortelės, tikriname porą
        uzrakintaLenta = true; // Užrakiname lentą, kad laukimo metu negalėtume spausti kitų kortelių
        tikrintiAtitikima(); // Tikriname, ar kortelės sutampa
    }
});

// Funkcija tikrinti ar kortelės sutampa
function tikrintiAtitikima() {
    const [pirma, antra] = pasirinktosKorteles;
    const pirmaPav = pirma.querySelector('img').src;
    const antraPav = antra.querySelector('img').src;

    if (pirmaPav === antraPav) { // Jei vaizdai sutampa
        rezultatas += 300; // Pridedame taškų už atitinkančias korteles
        pirmaPoraRasta = true; // Pažymime, kad radome porą
        setTimeout(() => {
            // Paslepiame atitinkančias korteles
            pasirinktosKorteles.forEach((kortele) => {
                kortele.style.visibility = 'hidden';
                kortele.querySelector('img').style.visibility = 'hidden';
            });
            pasirinktosKorteles = [];
            uzrakintaLenta = false; // Atrakinti lentą po tikrinimo
            patikrintiLaimejima(); // Tikriname, ar visos poros rastos
        }, 500);
    } else {
        setTimeout(() => {
            pasirinktosKorteles.forEach(kortele => kortele.classList.remove('flipped')); // Jei kortelės nesutampa, apverčiame jas atgal
            pasirinktosKorteles = [];
            uzrakintaLenta = false;

            if (pirmaPoraRasta) {
                rezultatas -= 50; // Atimame taškų, jei buvo rasta pora anksčiau
            }
            atnaujintiRezultata(); // Atnaujiname rezultatą
        }, 1000);
    }
    atnaujintiRezultata(); // Atnaujiname rezultatą po bandymo
}

// Funkcija atnaujinti rezultatą
function atnaujintiRezultata() {
    rezultatasElementas.textContent = rezultatas; // Atnaujiname rezultatą vartotojo sąsajoje
}

// Tikriname, ar visos kortelės jau surastos
function patikrintiLaimejima() {
    const visosKortos = document.querySelectorAll('.kortele:not([style*="visibility: hidden"])');

    // Jei nėra likusių kortelių, vartotojas laimėjo
    if (visosKortos.length === 0) {
        setTimeout(() => {
            alert(`Sveikiname, ${vardasInput.value || 'Anonimas'}! Jūs laimėjote su ${rezultatas} taškais!`); // Rodo laimėjimo pranešimą

            // Išsaugome geriausią rezultatą ir atnaujiname rezultatų lentelę
            issaugotiGeriausiaRezultata();
            rodytiGeriausiusRezultatus();

            geriausiRezultataiElementas.style.display = 'block'; // Parodome rezultatų lentelę vartotojui

            rezultatas = 0; // Nustatome rezultatą iš naujo
            pirmaPoraRasta = false; // Iš naujo nustatome, kad poros nerastos
            atnaujintiRezultata(); // Atnaujiname rezultatą vartotojo sąsajoje
            location.reload();

        }, 500);
    }
}

// Funkcija rodyti geriausius rezultatus
function rodytiGeriausiusRezultatus() {
    const geriausi = JSON.parse(sessionStorage.getItem('geriausiRezultatai')) || { easy: [], medium: [], hard: [] };
    
    geriausiRezultataiElementas.innerHTML = '';
    ['easy', 'medium', 'hard'].forEach(level => {
        const levelTitle = level === 'easy' ? 'Lengvo' : level === 'medium' ? 'Vidutinio' : 'Sunkaus';
        const levelResults = geriausi[level];
        
        const title = document.createElement('h3');
        title.textContent = `${levelTitle} lygio rezultatai:`;
        geriausiRezultataiElementas.appendChild(title);

        // Sukuriame sąrašą su geriausiais rezultatais šiame lygyje (unordered list)
        const ul = document.createElement('ul');

        // Iteruojame per visus geriausius rezultatus šiame lygyje
        levelResults.forEach((rez) => {
            // Sukuriame naują sąrašo elementą
            const li = document.createElement('li');

            // Pridedame tekstą su vardu ir rezultatu
            li.textContent = `${rez.vardas}: ${rez.rezultatas} taškų`;

            // Pridedame sąrašo elementą prie sąrašo
            ul.appendChild(li);
        });
        geriausiRezultataiElementas.appendChild(ul);
    });

    geriausiRezultataiElementas.style.display = 'block'; // Parodome rezultatų lentelę
}

// Funkcija išsaugoti geriausią rezultatą
function issaugotiGeriausiaRezultata() {
    const vardas = vardasInput.value.trim() || 'Anonimas'; // Gauti vartotojo vardą, jei neužpildytas - "Anonimas"
    const geriausi = JSON.parse(sessionStorage.getItem('geriausiRezultatai')) || { easy: [], medium: [], hard: [] };

    const levelKey = pasirinktasLygis === 5 ? 'easy' : pasirinktasLygis === 10 ? 'medium' : 'hard';

    // Tikriname, ar šis vartotojas jau turi rezultatą šiame lygyje
    const existingPlayer = geriausi[levelKey].find((rez) => rez.vardas === vardas);
    if (existingPlayer) {
        if (rezultatas > existingPlayer.rezultatas) {
            existingPlayer.rezultatas = rezultatas; // Atnaujiname rezultatą, jei naujas yra geresnis
        }
    } else {
        geriausi[levelKey].push({ vardas, rezultatas }); // Pridedame naują rezultatą
    }

    // Surūšiuojame rezultatus nuo didžiausio iki mažiausio
    geriausi[levelKey].sort((a, b) => b.rezultatas - a.rezultatas);
    sessionStorage.setItem('geriausiRezultatai', JSON.stringify(geriausi)); // Išsaugome geriausius rezultatus naršyklės sesijos saugykloje
}

// Įvykis, kai spaudžiamas "Pradėti" mygtukas
document.querySelector('.Pradeti').addEventListener('click', () => {
    const vardas = vardasInput.value.trim();
    if (!vardas) {
        klaidaElementas.style.display = 'block'; // Jei vardas neįvestas, rodome klaidos pranešimą
        return;
    }

    klaidaElementas.style.display = 'none'; // Paslėpti klaidą
    pradetiZaisti(); // Pradėti žaidimą
});

// Įvykis, kai spaudžiamas "Perkrauti" mygtukas
document.querySelector('.Perkrauti').addEventListener('click', () => {
    rezultatas = 0; // Nustatome rezultatą iš naujo
    pirmaPoraRasta = false; // Iš naujo nustatome, kad poros nerastos
    atnaujintiRezultata(); // Atnaujiname rezultatą vartotojo sąsajoje
    location.reload(); // Perkrauname puslapį
});

// Rodyti geriausius rezultatus puslapio atidarymo metu
rodytiGeriausiusRezultatus();
