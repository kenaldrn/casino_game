// Navigation
function goToMenu(){ window.location.href='index.html'; }
function goToDashboard(){ window.location.href='dashboard.html'; }
function goToRules(){ window.location.href='rules.html'; }
function startCasino(){
    let name = document.getElementById('playerName').value.trim();
    if(!name){ alert("Enter name"); return; }
    localStorage.setItem('playerName', name);
    if(!localStorage.getItem('balance')) localStorage.setItem('balance', 100);
    if(!localStorage.getItem('wins')) localStorage.setItem('wins', 0);
    if(!localStorage.getItem('losses')) localStorage.setItem('losses', 0);
    if(!localStorage.getItem('pushes')) localStorage.setItem('pushes', 0);
    updateLeaderboard();
    goToDashboard();
}

// Player Data
let balance = parseInt(localStorage.getItem('balance')) || 100;
let bet = 0;
let wins = parseInt(localStorage.getItem('wins')) || 0;
let losses = parseInt(localStorage.getItem('losses')) || 0;
let pushes = parseInt(localStorage.getItem('pushes')) || 0;

// Chips
document.querySelectorAll('.chip').forEach(chip=>{
    chip.onclick = () => { bet = parseInt(chip.dataset.value); }
});

// Dice
function rollDie(){ return Math.floor(Math.random()*6) + 1; }

function rollLucky7(){
    if(bet <= 0 || bet > balance){ alert("Place valid bet"); return; }
    let p1 = rollDie(), p2 = rollDie(), d1 = rollDie(), d2 = rollDie();
    animateDice('playerDie1', p1);
    animateDice('playerDie2', p2);
    animateDice('dealerDie1', d1);
    animateDice('dealerDie2', d2);
    let playerTotal = p1 + p2, dealerTotal = d1 + d2;
    document.getElementById('playerTotal').innerText = 'Total: ' + playerTotal;
    document.getElementById('dealerTotal').innerText = 'Total: ' + dealerTotal;
    setTimeout(()=>{
        let res = determineWinner(playerTotal, dealerTotal);
        document.getElementById('result').innerText = res;
        document.getElementById('balance').innerText = 'Balance: $' + balance;
        document.getElementById('wins')?.innerText = wins;
        document.getElementById('losses')?.innerText = losses;
        document.getElementById('pushes')?.innerText = pushes;
        saveData();
    },1000);
}

function determineWinner(player, dealer){
    if(player === 7 && dealer !== 7){ balance += bet*2; wins++; return 'Exact 7! You win 2:1!'; }
    if(dealer === 7 && player !== 7){ balance -= bet; losses++; return 'Dealer hit 7. You lose.'; }
    if(player === 7 && dealer === 7){ pushes++; return 'Both hit 7. Push!'; }
    let pd = Math.abs(7 - player), dd = Math.abs(7 - dealer);
    if(pd < dd){ balance += bet; wins++; return 'You are closer! You win!'; }
    else if(dd < pd){ balance -= bet; losses++; return 'Dealer is closer. You lose.'; }
    else{ pushes++; return 'Push!'; }
}

// Dice Animation
function animateDice(id, value){
    let dice = document.getElementById(id);
    dice.style.transform = `rotateX(${Math.random()*720}deg) rotateY(${Math.random()*720}deg)`;
    setTimeout(()=> drawDots(dice, value), 800);
}

function drawDots(dice, value){
    dice.innerHTML = '';
    const pos = {
        1: [[35,35]],
        2: [[15,15],[55,55]],
        3: [[15,15],[35,35],[55,55]],
        4: [[15,15],[55,15],[15,55],[55,55]],
        5: [[15,15],[55,15],[35,35],[15,55],[55,55]],
        6: [[15,15],[55,15],[15,35],[55,35],[15,55],[55,55]]
    };
    pos[value].forEach(p=>{
        let d = document.createElement('div');
        d.classList.add('dot');
        d.style.left = p[0] + 'px';
        d.style.top = p[1] + 'px';
        dice.appendChild(d);
    });
}

// Slots
const slotSymbols = ['🍒','🍋','7️⃣','🍀'];

function rollSlots(){
    if(bet <= 0 || bet > balance){ alert("Place valid bet"); return; }
    let reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    let results = [];
    reels.forEach((r,i)=>{
        r.style.animation = 'spinReel 0.5s ease';
        setTimeout(()=>{
            let sym = slotSymbols[Math.floor(Math.random()*slotSymbols.length)];
            r.innerText = sym; results.push(sym);
        },300);
    });
    setTimeout(()=>{
        let counts = {};
        results.forEach(s => counts[s] = (counts[s] || 0) + 1);
        let resText = 'You lose.';
        if(Object.values(counts).includes(3)){ balance += bet*5; wins++; resText='JACKPOT! 3 match! 5:1 payout!'; flashJackpot(); }
        else if(Object.values(counts).includes(2)){ balance += bet*2; wins++; resText='2 match! 2:1 payout!'; }
        else{ balance -= bet; losses++; }
        document.getElementById('balance').innerText = 'Balance: $'+balance;
        document.getElementById('result').innerText = resText;
        document.getElementById('wins')?.innerText = wins;
        document.getElementById('losses')?.innerText = losses;
        document.getElementById('pushes')?.innerText = pushes;
        saveData();
    },500);
}

function flashJackpot(){
    document.body.style.background = '#ff0';
    setTimeout(()=>document.body.style.background = '#060018', 300);
}

// Save Data
function saveData(){
    localStorage.setItem('balance', balance);
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    localStorage.setItem('pushes', pushes);
    updateLeaderboard();
}

// Leaderboard
function updateLeaderboard(){
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
    let name = localStorage.getItem('playerName') || 'Player';
    leaderboard[name] = balance;
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    if(document.getElementById('leaderboard')){
        let lb = document.getElementById('leaderboard');
        lb.innerHTML = '';
        Object.entries(leaderboard).sort((a,b)=>b[1]-a[1]).forEach(([n,bal])=>{
            let li = document.createElement('li');
            li.innerText = `${n}: $${bal}`;
            lb.appendChild(li);
        });
    }
}

// Display player name and balance on all pages
window.onload = ()=>{
    let name = localStorage.getItem('playerName') || 'Player';
    if(document.getElementById('playerDisplay')) document.getElementById('playerDisplay').innerText = 'Player: ' + name;
    if(document.getElementById('balance')) document.getElementById('balance').innerText = 'Balance: $' + balance;
    updateLeaderboard();
}

