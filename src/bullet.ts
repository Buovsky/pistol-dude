import * as PIXI from "pixi.js";
import {rectsIntersect} from "./collision";

export function createBullet(bulletTexture : PIXI.Texture, x : number, y : number, angle : number): PIXI.Sprite {
    const bullet = PIXI.Sprite.from(bulletTexture);
    bullet.anchor.set(0.5);
    bullet.x = x;
    bullet.y = y;
    bullet.angle = angle;
    return bullet;
}


export function moveBullets(bullets : Array<PIXI.Sprite>, speedX : number, speedY : number) {
    for(const bullet of bullets) {
        bullet.x += speedX;
        bullet.y += speedY;
    }
}

export function checkBulletsCollisionWithEnemies(bullets : Array<PIXI.Sprite>, enemies : Array<PIXI.Sprite>, app : PIXI.Application, playerStats : any) {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (rectsIntersect(bullets[i], enemies[j])) {
                enemies[j].position.set(enemies[j].x, enemies[j].y + 1000)
                app.stage.removeChild(enemies[j]);
                enemies.splice(j, 1);
                app.stage.removeChild(bullets[i]);
                bullets[i].position.set(bullets[i].x, bullets[i].y + 1000);
                playerStats.scorePoints += 10;
            }
        }
    }
}

export function checkBulletsCollisionWithCrates(bullets : Array<PIXI.Sprite>, crates : Array<PIXI.Sprite>, app : PIXI.Application, playerStats : any) {
    for (let i = 0; i < bullets.length; i++) {
        if (crates[0]) {
            if (rectsIntersect(bullets[i], crates[0])) {
                crates[0].position.set(crates[0].x, crates[0].y + 1000);
                app.stage.removeChild(crates[0]);
                crates.splice(0, 1);
                bullets[i].position.set(bullets[i].x, bullets[i].y + 1000);
                app.stage.removeChild(bullets[i]);
                bullets.splice(i, 1);
                playerStats.bulletsNumber += 5;
            }
        }
    }
}

export function checkBulletIsOnScreen(bullets : Array<PIXI.Sprite>, app : PIXI.Application) {
    if (bullets.length >= 1) {
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].position.x < 0 || bullets[i].position.x > 854 || bullets[i].position.y < 0) {
                app.stage.removeChild(bullets[i]);
                bullets.splice(i, 1);
            }
        }
    }
}