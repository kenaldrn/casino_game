let balance = 100;

function goToGame() {
    window.location.href = "game.html";
}

function goToRules() {
    window.location.href = "rules.html";
}

function goToMenu() {
    window.location.href = "index.html";
}

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function playGame() {
    let bet = parseInt(document.getElementById("bet").value);

    if (!bet || bet <= 0) {
        alert("Enter valid bet");
        return;
    }

    if (bet > balance) {
        alert("Not enough balance");
        return;
    }

    let p1 = rollDie();
    let p2 = rollDie();
    let d1 = rollDie();
    let d2 = rollDie();

    animateDice("playerDie1", p1);
    animateDice("playerDie2", p2);
    animateDice("dealerDie1", d1);
    animateDice("dealerDie2", d2);

    let playerTotal = p1 + p2;
    let dealerTotal = d1 + d2;

    document.getElementById("playerTotal").innerText = "Total: " + playerTotal;
    document.getElementById("dealerTotal").innerText = "Total: " + dealerTotal;

    let resultText = determineWinner(playerTotal, dealerTotal, bet);

    document.getElementById("result").innerText = resultText;
    document.getElementById("balance").innerText = "Balance: $" + balance;
}

function determineWinner(player, dealer, bet) {

    if (player === 7 && dealer !== 7) {
        balance += bet * 2;
        return "Exact 7! You win 2:1!";
    }

    if (dealer === 7 && player !== 7) {
        balance -= bet;
        return "Dealer hit 7. You lose.";
    }

    if (player === 7 && dealer === 7) {
        return "Both hit 7. Push!";
    }

    let playerDist = Math.abs(7 - player);
    let dealerDist = Math.abs(7 - dealer);

    if (playerDist < dealerDist) {
        balance += bet;
        return "You are closer to 7! You win!";
    } 
    else if (dealerDist < playerDist) {
        balance -= bet;
        return "Dealer is closer. You lose.";
    } 
    else {
        return "Push!";
    }
}

function animateDice(id, value) {
    let dice = document.getElementById(id);
    dice.classList.add("roll");

    setTimeout(() => {
        dice.classList.remove("roll");
        drawDots(dice, value);
    }, 800);
}

function drawDots(dice, value) {
    dice.innerHTML = "";

    const positions = {
        1: [[35,35]],
        2: [[15,15],[55,55]],
        3: [[15,15],[35,35],[55,55]],
        4: [[15,15],[55,15],[15,55],[55,55]],
        5: [[15,15],[55,15],[35,35],[15,55],[55,55]],
        6: [[15,15],[55,15],[15,35],[55,35],[15,55],[55,55]]
    };

    positions[value].forEach(pos => {
        let dot = document.createElement("div");
        dot.classList.add("dot");
        dot.style.left = pos[0] + "px";
        dot.style.top = pos[1] + "px";
        dice.appendChild(dot);
    });
}

