import * as PIXI from 'pixi.js';
import {createZombie} from './zombie';
import {createCrate} from "./crate";
import {createBullet, checkBulletIsOnScreen, checkBulletsCollisionWithCrates, checkBulletsCollisionWithEnemies,
    moveBullets, } from "./bullet";
import {rectsIntersect} from "./collision";

const app = new PIXI.Application({
    width: 854,
    height: 480,
    backgroundColor: 0xeeeeeee
});

document.body.appendChild(app.view);

const backgroundTexture = PIXI.Texture.from('assets/background.png');
const background = PIXI.Sprite.from(backgroundTexture);
app.stage.addChild(background);

const zombieTextureFrame0 = PIXI.Texture.from('assets/zombie1.png');
const zombieTextureFrame1 = PIXI.Texture.from('assets/zombie2.png');

const enemies = [];

const crateTexture = PIXI.Texture.from('assets/crate.png');
const crates = [];
const crateSpeed = 1;

const playerLeft = PIXI.Texture.from('assets/playerLeft.png');
const playerUp = PIXI.Texture.from('assets/playerUp.png');
const playerRight = PIXI.Texture.from('assets/playerRight.png');
const player = PIXI.Sprite.from(playerLeft);
player.scale.x = 0.3;
player.scale.y = 0.3;
player.position.set(app.view.width / 2, app.view.height / 2 + 170);
player.anchor.set(0.5);
app.stage.addChild(player);

let playerAlive = true;

const bulletTexture = PIXI.Texture.from("assets/bullet.png");
const playerStats = {
    bulletsNumber: 10,
    scorePoints: 0
};

const bulletSpeed = 4;

const bulletsLeft = [];
const bulletsUp = [];
const bulletsRight = [];

enum Direction {
    LEFT,
    UP,
    RIGHT
}

let playerDirection = Direction.LEFT;

window.addEventListener('keydown', keyboardInput);

const scoreText = new PIXI.Text(playerStats.scorePoints.toString());
const removeBullet = new PIXI.Text(playerStats.bulletsNumber.toString());
drawUI();

const loader = new PIXI.Loader();
loader.load(startGame);

function startGame() {
    let seconds = 0;
    let spawnerSeconds = 0;
    let spawnerCrateSeconds = 0;
    let timeToSpawnCrate = 15;
    const endScreen = new PIXI.Text("GAME OVER\nPress  R  to restart!");

    app.ticker.add((delta) => {
        seconds += delta / 50;
        spawnerSeconds += delta / 50;
        spawnerCrateSeconds += delta / 50;

        removeBullet.text = playerStats.bulletsNumber.toString();
        scoreText.text = playerStats.scorePoints.toString();

        updateBullets();
        if (spawnerSeconds > 1) {
            spawnZombie();
            spawnerSeconds = 0;
        }
        if (seconds > 2) {
            seconds = 0;

        }
        if (spawnerCrateSeconds > timeToSpawnCrate) {
            if (playerAlive) {
                spawnCrate();
                if (playerStats.scorePoints > 100) {
                    timeToSpawnCrate = 6;
                }
                spawnerCrateSeconds = 0;
            }
        }

        if (playerAlive) {
            updateZombies(seconds);
            updateCrate(seconds);
            for (let j = 0; j < enemies.length; j++) {
                if (rectsIntersect(player, enemies[j])) {
                    app.stage.removeChild(player);
                    playerAlive = false;
                }
            }
        }
        else {
            drawEndScreen(endScreen);
        }

    });
}

// Drawing UI

function drawUI() {
    const score = new PIXI.Text("SCORE: ");
    score.position.set(20, 10);
    score.anchor.set(0);
    score.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontFamily: "Ardcade",
        fontSize: 35,
        strokeThickness: 5,
        letterSpacing: 2

    });
    app.stage.addChild(score);

    scoreText.position.set(150, 10);
    scoreText.anchor.set(0);
    scoreText.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontFamily: "Ardcade",
        fontSize: 35,
        strokeThickness: 5,
        letterSpacing: 2
    });
    app.stage.addChild(scoreText);

    const bulletAmount = new PIXI.Text("BULLETS: ");
    bulletAmount.position.set(705, 30);
    bulletAmount.anchor.set(0.5);
    bulletAmount.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontFamily: "Ardcade",
        fontSize: 35,
        strokeThickness: 5,
        letterSpacing: 1
    });
    app.stage.addChild(bulletAmount);
    removeBullet.position.set(810, 30);
    removeBullet.anchor.set(0.5);
    removeBullet.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontFamily: "Ardcade",
        fontSize: 35,
        strokeThickness: 5,
        letterSpacing: 1
    });
    app.stage.addChild(removeBullet);
}

function drawEndScreen(endScreen : PIXI.Text) {
    endScreen.position.set(app.stage.width / 2, app.stage.height / 2);
    endScreen.anchor.set(0.5);
    endScreen.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontFamily: "Ardcade",
        fontSize: 40,
        strokeThickness: 5,
        letterSpacing: 2

    });
    app.stage.addChild(endScreen);
}

function spawnZombie() {
    let enemyNumber = 1;
    if (playerStats.scorePoints > 100) {
        enemyNumber = 3;
    }
    if (playerStats.scorePoints > 300) {
        enemyNumber = 5;
    }
    if (enemies.length <= enemyNumber) {
        const enemy = createZombie(player.y, zombieTextureFrame0);
        app.stage.addChild(enemy);
        enemies.push(enemy);
    }
}

function updateZombies(seconds: number) {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x < player.x) {
            enemies[i].x++;
        }
        else {
            enemies[i].x--;
        }
        if (seconds <= 2 && seconds >= 1) {
            enemies[i].texture = zombieTextureFrame1;
        }
        if (seconds <= 1) {
            enemies[i].texture = zombieTextureFrame0;
        }
    }
}

function spawnCrate() {
    const crate = createCrate(crateTexture);
    app.stage.addChild(crate);
    crates.push(crate);
}

function updateCrate(seconds: number) {
    if (crates[0]) {
        if (seconds <= 2 && seconds >= 1) {
            crates[0].x += crateSpeed;
            crates[0].y -= crateSpeed;
        }
        if (seconds <= 1) {
            crates[0].x += crateSpeed;
            crates[0].y += crateSpeed;
        }
        if (crates[0].position.x > 854) {
            app.stage.removeChild(crates[0]);
            crates.splice(0, 1);
        }
    }
}

function fireBullet() {
    if (playerStats.bulletsNumber > 0) {
        if (playerDirection === Direction.LEFT) {
            const bullet = createBullet(bulletTexture, player.x - 27, player.y - 11, 0);
            bulletsLeft.push(bullet);
            app.stage.addChild(bullet);
        } else if (playerDirection === Direction.UP) {
            const bullet = createBullet(bulletTexture, player.x, player.y - 40, 90);
            bulletsUp.push(bullet);
            app.stage.addChild(bullet);
        } else if (playerDirection === Direction.RIGHT) {
            const bullet = createBullet(bulletTexture, player.x  + 27, player.y - 11, 0);
            bulletsRight.push(bullet);
            app.stage.addChild(bullet);
        }
        playerStats.bulletsNumber--;
        removeBullet.text = playerStats.bulletsNumber.toString();
    }
}

function updateBullets() {
    moveBullets(bulletsLeft, -bulletSpeed, 0);
    moveBullets(bulletsRight, bulletSpeed, 0);
    moveBullets(bulletsUp, 0, -bulletSpeed);

    checkBulletsCollisionWithEnemies(bulletsLeft, enemies, app, playerStats);
    checkBulletsCollisionWithEnemies(bulletsRight, enemies, app, playerStats);
    checkBulletsCollisionWithCrates(bulletsUp, crates, app, playerStats);

    checkBulletIsOnScreen(bulletsLeft, app);
    checkBulletIsOnScreen(bulletsUp, app);
    checkBulletIsOnScreen(bulletsRight, app);
}

function keyboardInput(event: KeyboardEvent) {
    if (playerAlive) {
        if (event.keyCode == 37) {
            playerDirection = Direction.LEFT;
            player.texture = playerLeft;
        }
        if (event.keyCode == 38) {
            playerDirection = Direction.UP;
            player.texture = playerUp;
        }
        if (event.keyCode == 39) {
            playerDirection = Direction.RIGHT;
            player.texture = playerRight;
        }
        if (event.keyCode == 32) {
            fireBullet();
        }
    }
    else {
        if (event.keyCode == 82) {
            window.location.reload(true);
        }
    }
}
