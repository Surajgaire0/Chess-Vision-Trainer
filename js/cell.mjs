export function Cell(x, y, dist = 0) {
    this.x = x;
    this.y = y;
    this.dist = dist;

    this.draw = (ctx, canvas) => {
        ctx.beginPath();
        ctx.rect(this.y * canvas.width / 8, this.x * canvas.height / 8, canvas.width / 8, canvas.height / 8);
        ctx.lineWidth = '4';
        ctx.strokeStyle = 'green';
        ctx.stroke();
        ctx.closePath();
    }
}