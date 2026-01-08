const charMap = {
    'Priest': Priest,
    'Devil': Devil,
    'Fighter': Fighter,
    'Mage': Mage
};

const charInfo = {
    'Priest': {
        passive: "Passive: Regenerate Mana over time.",
        a1: "Heal (Cost: 40)",
        a2: "Light Beam (Cost: 20)"
    },
    'Devil': {
        passive: "Passive: Gain Mana by dealing damage.",
        a1: "Fireball (Cost: 20)",
        a2: "Dark Pact (Cost: 50, +Dmg, -HP)"
    },
    'Fighter': {
        passive: "Passive: Land 3 hits to charge Mana Steal.",
        a1: "Punch (Generates Combo)",
        a2: "Kick (Cost: 30, High Dmg)"
    },
    'Mage': {
        passive: "Passive: High Max Mana, No Regen.",
        a1: "Ice Shard (Cost: 10)",
        a2: "Thunder (Cost: 50, Large AoE)"
    }
};

let p1Selected = null;
let p2Selected = null;

window.onload = () => {
    // Setup Selection UI
    document.querySelectorAll('#p1-select .char-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#p1-select .char-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            p1Selected = e.target.getAttribute('data-char');
            updateInfo('p1', p1Selected);
            checkStart();
        });
    });

    document.querySelectorAll('#p2-select .char-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#p2-select .char-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            p2Selected = e.target.getAttribute('data-char');
            updateInfo('p2', p2Selected);
            checkStart();
        });
    });

    document.getElementById('start-btn').addEventListener('click', startGame);

    // Enter key to start
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && p1Selected && p2Selected) {
            startGame();
        }
    });

    // Add hint text
    const hint = document.createElement('div');
    hint.className = 'key-hint';
    hint.textContent = "Press Enter to Start when ready";
    document.querySelector('#selection-screen').appendChild(hint);
};

function updateInfo(player, charName) {
    const info = charInfo[charName];
    const el = document.getElementById(player + '-info');

    let keys = (player === 'p1') ? "[F] / [G]" : "[K] / [L]";
    if (player === 'p1') {
        el.innerHTML = `
            <div>${info.passive}</div>
            <div><strong>[F]</strong>: ${info.a1}</div>
            <div><strong>[G]</strong>: ${info.a2}</div>
        `;
    } else {
        el.innerHTML = `
            <div>${info.passive}</div>
            <div><strong>[K]</strong>: ${info.a1}</div>
            <div><strong>[L]</strong>: ${info.a2}</div>
        `;
    }
}

function checkStart() {
    const btn = document.getElementById('start-btn');
    if (p1Selected && p2Selected) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function startGame() {
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const p1Class = charMap[p1Selected];
    const p2Class = charMap[p2Selected];

    const game = new Game(ctx, p1Class, p2Class);
    game.start();
}
