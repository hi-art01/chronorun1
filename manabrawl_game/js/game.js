class Game {
    constructor(ctx, p1Class, p2Class) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.input = new InputHandler();
        this.lastTime = 0;

        // Init players
        this.player1 = new p1Class(100, 300, 'blue');
        this.player2 = new p2Class(600, 300, 'red');
        this.player1.tag = 'p1';
        this.player2.tag = 'p2';

        this.projectiles = [];

        // Platforms (x, y, w, h)
        this.platforms = [
            { x: 300, y: 500, w: 400, h: 20 },  // Middle platform
            { x: 100, y: 350, w: 200, h: 20 },  // Left High
            { x: 700, y: 350, w: 200, h: 20 }   // Right High
        ];
    }

    addProjectile(proj) {
        this.projectiles.push(proj);
    }

    start() {
        requestAnimationFrame((time) => this.loop(time));
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.checkCollisions();
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(dt) {
        // Player 1 Controls (WASD)
        const p1Keys = {
            left: this.input.isDown('KeyA'),
            right: this.input.isDown('KeyD'),
            jump: this.input.isDown('KeyW'),
            down: this.input.isDown('KeyS'),
            attack1: this.input.isDown('KeyF'), // Defaulting attack keys
            attack2: this.input.isDown('KeyG')
        };
        this.player1.update(p1Keys, this, dt, this.platforms);

        // Player 2 Controls (Arrows)
        const p2Keys = {
            left: this.input.isDown('ArrowLeft'),
            right: this.input.isDown('ArrowRight'),
            jump: this.input.isDown('ArrowUp'),
            down: this.input.isDown('ArrowDown'),
            attack1: this.input.isDown('KeyK'), // Defaulting attack keys
            attack2: this.input.isDown('KeyL')
        };
        this.player2.update(p2Keys, this, dt, this.platforms);

        this.projectiles.forEach(p => p.update(dt));
        this.projectiles = this.projectiles.filter(p => p.active);

        // Check Death
        if (this.player1.health <= 0) this.gameOver('Player 2 Wins!');
        if (this.player2.health <= 0) this.gameOver('Player 1 Wins!');

        // Debug Log frequently (every 60 frames)
        // if (Math.random() < 0.01) console.log("P1 Y:", this.player1.y, " vy:", this.player1.vy);
    }

    gameOver(msg) {
        document.getElementById('winner-text').innerText = msg;
        document.getElementById('game-over').style.display = 'block';
        // Stop loop? Or just let it run behind
        // this.running = false; // If we had a flag
    }

    checkCollisions() {
        const p1 = this.player1;
        const p2 = this.player2;

        this.projectiles.forEach(proj => {
            let target = null;
            if (proj.owner === 'p1') target = p2;
            else if (proj.owner === 'p2') target = p1;

            if (target &&
                proj.x < target.x + target.width &&
                proj.x + proj.width > target.x &&
                proj.y < target.y + target.height &&
                proj.y + proj.height > target.y) {

                // Hit!
                target.takeDamage(proj.damage);
                proj.active = false;

                // Generic onHit hook for attacker
                let attacker = (proj.owner === 'p1') ? p1 : p2;
                if (attacker.onHit) {
                    attacker.onHit(target, proj.damage);
                }

                // Callback for mana steal etc
                if (proj.type === 'steal') {
                    if (attacker.gainMana) attacker.gainMana(20);
                    if (target.spendMana) target.spendMana(20);
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Floor
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(0, 600, this.width, 100); // Lower floor since height is 700 now

        // Platforms
        this.ctx.fillStyle = '#666';
        this.platforms.forEach(p => {
            this.ctx.fillRect(p.x, p.y, p.w, p.h);
        });

        this.player1.draw(this.ctx);
        this.player2.draw(this.ctx);

        this.projectiles.forEach(p => p.draw(this.ctx));

        // UI Updates (crude)
        this.updateUI();
    }

    updateUI() {
        // We'll update the style width of the bars
        document.getElementById('p1-health').style.width = (this.player1.health / this.player1.maxHealth * 100) + '%';
        document.getElementById('p1-mana').style.width = (this.player1.mana / this.player1.maxMana * 100) + '%';
        document.getElementById('p2-health').style.width = (this.player2.health / this.player2.maxHealth * 100) + '%';
        document.getElementById('p2-mana').style.width = (this.player2.mana / this.player2.maxMana * 100) + '%';
    }
}
