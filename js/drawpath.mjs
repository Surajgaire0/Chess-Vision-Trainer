export let drawPath = (sprite, ctx, canvas, minpath) => {
    let tox, toy, fromx, fromy;
    for (let i = 0; i < minpath.length - 1; i++) {
        fromx = minpath[i].y * canvas.width / 8;
        fromy = minpath[i].x * canvas.height / 8;
        tox = minpath[i + 1].y * canvas.width / 8;
        toy = minpath[i + 1].x * canvas.height / 8;

        ctx.save();
        let angle = Math.atan2((toy - fromy), (tox - fromx));
        ctx.translate(fromx + canvas.width / 16 + 2 * Math.cos(angle), fromy + canvas.height / 16 + 2 * Math.sin(angle));
        ctx.rotate(angle);
        ctx.drawImage(sprite, 0, 0, Math.sqrt((toy - fromy) ** 2 + (tox - fromx) ** 2) - 15, 13);
        ctx.restore();
    }
};