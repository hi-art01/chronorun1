class Character {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpForce = 22; // Increased to ensure top platforms are reachable
        this.grounded = false;
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 0;
        this.maxMana = 100;
        this.damageMultiplier = 1;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }

    gainMana(amount) {
        this.mana += amount;
        if (this.mana > this.maxMana) this.mana = this.maxMana;
    }

    spendMana(amount) {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }

    update(keys, game, dt, platforms) {
        // Store previous position for collision logic
        const prevY = this.y;

        // Apply Gravity
        this.vy += 1;

        // Horizontal Movement
        this.vx = 0;
        if (keys.left) this.vx = -this.speed;
        if (keys.right) this.vx = this.speed;

        // Jump
        if (keys.jump && this.grounded) {
            this.vy = -this.jumpForce;
            this.grounded = false;
        }

        // Apply Velocity
        this.x += this.vx;
        this.y += this.vy;

        this.grounded = false; // Assume falling until collision found

        // Floor Collision (Floor at y=600)
        if (this.y + this.height >= 600) {
            this.y = 600 - this.height;
            this.vy = 0;
            this.grounded = true;
        }

        // Platform Collision
        // Removed drop-down check to ensure stability first
        if (platforms) {
            platforms.forEach(p => {
                // Horizontal overlap
                if (this.x + this.width > p.x && this.x < p.x + p.w) {
                    this.lastPlatY = p.y; // For debug display

                    // Vertical check: was character's feet above platform in previous frame?
                    const prevFeet = prevY + this.height;
                    if (this.vy >= 0 && prevFeet <= p.y && this.y + this.height >= p.y) {
                        this.y = p.y - this.height;
                        this.vy = 0;
                        this.grounded = true;
                    }
                }
            });
        }

        // Screen Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 1000) this.x = 1000 - this.width;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Debug Version Text
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`v1.6 Y:${Math.floor(this.y)} VY:${Math.floor(this.vy)}`, this.x, this.y - 10);

        // Visualize the feet
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y + this.height - 2, this.width, 4);

        if (this.lastPlatY) {
            ctx.fillStyle = 'yellow';
            ctx.fillText(`LastPlat: ${this.lastPlatY}`, this.x, this.y - 30);
        }
    }
}
