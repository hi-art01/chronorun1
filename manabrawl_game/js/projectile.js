class Projectile {
    constructor(x, y, vx, vy, owner, color, damage, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.owner = owner; // 'p1' or 'p2'
        this.width = 20;
        this.height = 20;
        this.color = color;
        this.damage = damage;
        this.type = type; // 'normal', 'steal', etc.
        this.active = true;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.duration) {
            this.duration--;
            if (this.duration <= 0) this.active = false;
        }

        // Out of bounds
        if (this.x < -100 || this.x > 1100 || this.y < -100 || this.y > 800) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
