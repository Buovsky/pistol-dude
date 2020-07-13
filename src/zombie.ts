import * as PIXI from "pixi.js";

export function createZombie(playerY : number, zombieTexture : PIXI.Texture): PIXI.Sprite {

    const enemy = PIXI.Sprite.from(zombieTexture);

    enemy.anchor.set(0.5);
    enemy.scale.x = 0.3;
    enemy.scale.y = 0.3;

    const random = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

    if (random == 1) {
        enemy.position.set(-30, playerY);
    }
    else {
        enemy.position.set(884, playerY);
    }

    return enemy;
}
