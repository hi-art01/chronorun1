class Devil extends Character {
    constructor(x, y, color) {
        super(x, y, color);
        this.maxMana = 100;
        this.mana = 0;
        this.prevAttack1 = false;
        this.prevAttack2 = false;
        this.damageMultiplier = 1;
    }

    update(keys, game, dt, platforms) {
        super.update(keys, game, dt, platforms);

        if (keys.attack1 && !this.prevAttack1) this.ability1(game);
        if (keys.attack2 && !this.prevAttack2) this.ability2(game);

        this.prevAttack1 = keys.attack1;
        this.prevAttack2 = keys.attack2;
    }

    onHit(target, damage) {
        // Gain mana on dealing damage
        this.gainMana(damage * 0.5);
    }

    ability1(game) {
        // Fireball
        if (this.spendMana(20)) {
            let dir = (this.tag === 'p1') ? 1 : -1;
            game.addProjectile(new Projectile(
                this.x + (dir === 1 ? this.width : 0),
                this.y + 30,
                dir * 12,
                1, // Slight gravity?
                this.tag,
                'red',
                20 * this.damageMultiplier,
                'fire'
            ));
        }
    }

    ability2(game) {
        // Dark Pact: Permanent Damage Boost
        if (this.spendMana(50)) {
            this.damageMultiplier += 0.5;
            this.takeDamage(10); // Sacrifice health? "devil" theme.
            console.log("Devil Dark Pact: Damage Multiplier is now " + this.damageMultiplier);
        }
    }
}
