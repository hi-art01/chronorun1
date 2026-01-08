class Fighter extends Character {
    constructor(x, y, color) {
        super(x, y, color);
        this.maxMana = 100;
        this.mana = 0;
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.prevAttack1 = false;
        this.prevAttack2 = false;
    }

    update(keys, game, dt, platforms) {
        super.update(keys, game, dt, platforms);

        // Reset combo if too slow (1 second window)
        if (Date.now() - this.lastAttackTime > 1000 && this.comboCount > 0) {
            this.comboCount = 0;
            console.log("Combo Reset");
        }

        if (keys.attack1 && !this.prevAttack1) this.ability1(game);
        if (keys.attack2 && !this.prevAttack2) this.ability2(game);

        this.prevAttack1 = keys.attack1;
        this.prevAttack2 = keys.attack2;
    }

    ability1(game) {
        // Combo Attack
        // hit 3 keys to do first special
        this.comboCount++;
        this.lastAttackTime = Date.now();
        console.log("Combo: " + this.comboCount);

        if (this.comboCount >= 3) {
            // Trigger Special: Mana Steal Punch
            const dir = (this.tag === 'p1') ? 1 : -1;
            game.addProjectile(new Projectile(
                this.x + (dir === 1 ? this.width : 0),
                this.y + 20,
                dir * 15,
                0,
                this.tag,
                'orange',
                25,
                'steal' // Special type handled in Game.js
            ));
            this.comboCount = 0; // Reset
        } else {
            // Normal small punch
            const dir = (this.tag === 'p1') ? 1 : -1;
            game.addProjectile(new Projectile(
                this.x + (dir === 1 ? this.width : 0),
                this.y + 20,
                dir * 15,
                0,
                this.tag,
                'white',
                5,
                'normal'
            ));
        }
    }

    ability2(game) {
        // Kick (Uses mana stolen)
        if (this.spendMana(30)) {
            const dir = (this.tag === 'p1') ? 1 : -1;
            game.addProjectile(new Projectile(
                this.x + (dir === 1 ? this.width : 0),
                this.y + 40,
                dir * 20,
                0,
                this.tag,
                'brown',
                40,
                'heavy'
            ));
        }
    }
}
