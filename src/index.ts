import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 854,
    height: 480,
    backgroundColor: 0xeeeeeee
});

document.body.appendChild(app.view);

const player = PIXI.Sprite.from("player.png");

player.scale.x = 0.4;
player.scale.y = 0.4;


app.ticker.add((delta) => {
    player.x++;
});

app.stage.addChild(player);