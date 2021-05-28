export function Cell(x, y, dist = 0) {
    this.x = x;
    this.y = y;
    this.dist = dist;

    this.draw = (ctx, canvas, color) => {
        ctx.beginPath();
        ctx.rect(this.y * canvas.width / 8, this.x * canvas.height / 8, canvas.width / 8, canvas.height / 8);
        ctx.lineWidth = '5';
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }
}