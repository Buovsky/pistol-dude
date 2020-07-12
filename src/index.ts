import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 854,
    height: 480,
    backgroundColor: 0xeeeeeee
});

document.body.appendChild(app.view);

const loader = new PIXI.Loader();
loader.load(setup);

function setup() {
    const backgroundTexture = PIXI.Texture.from('assets/background.png');
    const background = PIXI.Sprite.from(backgroundTexture);
    app.stage.addChild(background);
    const zombie1 = PIXI.Texture.from('assets/zombie1.png');
    const zombie2 = PIXI.Texture.from('assets/zombie2.png');

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
    let bulletsNumber = 10;
    const bulletSpeed = 4;

    let bulletsLeft = [];
    let bulletsUp = [];
    let bulletsRight = [];

    // Keyboard letiables
    let left = true;
    let up = false;
    let right = false;

    let scorePoints = 0;

    window.addEventListener('keydown', keyboardInput);

    let addScore = new PIXI.Text(scorePoints.toString());
    let removeBullet = new PIXI.Text(bulletsNumber.toString());
    drawUI();
    gameLoop();

    function gameLoop() {
        let seconds = 0;
        let spawnerSeconds = 0;
        let spawnerCrateSeconds = 0;
        let timeToSpawnCrate = 15;
        let endScreen = new PIXI.Text("GAME OVER\nPress  R  to restart!");
        app.ticker.add((delta) => {
            seconds += delta / 50;
            spawnerSeconds += delta / 50;
            spawnerCrateSeconds += delta / 50;

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
                    createCrate();
                    if (scorePoints > 100) {
                        timeToSpawnCrate = 6;
                    }
                    spawnerCrateSeconds = 0;
                }
            }

            if (playerAlive) {

                updateZombies(seconds);
                updateCrate(seconds);
                keyboardInput;

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
        let score = new PIXI.Text("SCORE: ");
        score.position.set(80, 30);
        score.anchor.set(0.5);
        score.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize: 35,
            strokeThickness: 5,
            letterSpacing: 2

        });
        app.stage.addChild(score);

        addScore.position.set(160, 30);
        addScore.anchor.set(0.5);
        addScore.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize: 35,
            strokeThickness: 5,
            letterSpacing: 2
        });
        app.stage.addChild(addScore);

        let bulletAmount = new PIXI.Text("BULLETS: ");
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
    function drawEndScreen(endScreen) {
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
    function scorePosition() {
        if (scorePoints >= 100) {
            addScore.x = 170;
        }
        if (scorePoints >= 1000) {
            addScore.x = 180;
        }
    }

    // Spawning enemies

    function spawnZombie() {
        let enemyNumber = 1;
        if (scorePoints > 100) {
            enemyNumber = 3;
        }
        if (scorePoints > 300) {
            enemyNumber = 5;
        }
        if (enemies.length <= enemyNumber) {
            let enemy = createZombie();
            enemies.push(enemy);
        }
    }
    function createZombie(): PIXI.Sprite {
        let enemy = PIXI.Sprite.from(zombie1);
        enemy.anchor.set(0.5);
        enemy.scale.x = 0.3;
        enemy.scale.y = 0.3;

        let random = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

        if (random == 1) {
            enemy.position.set(-30, player.y);
            app.stage.addChild(enemy);
        }
        else {
            enemy.position.set(884, player.y);
            app.stage.addChild(enemy);
        }

        return enemy;
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
                enemies[i].texture = zombie2;
            }
            if (seconds <= 1) {
                enemies[i].texture = zombie1;
            }
        }
    }

    function createCrate() {
        let crate = PIXI.Sprite.from(crateTexture);
        crate.anchor.set(0.5);
        crate.position.set(-30, player.y - 300);
        crate.scale.x = 0.8;
        crate.scale.y = 0.8;
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


    //Bullet functionality 

    function fireBullet() {
        if (bulletsNumber > 0) {
            let bullet = createBullet();
            if (left) {
                bulletsLeft.push(bullet);
            }
            if (up) {
                bulletsUp.push(bullet);
            }
            if (right) {
                bulletsRight.push(bullet);
            }
            bulletsNumber--;
            removeBullet.text = bulletsNumber.toString();
        }
    }

    function createBullet(): PIXI.Sprite {
        const bullet = PIXI.Sprite.from(bulletTexture);
        bullet.anchor.set(0.5);
        if (left) {
            bullet.x = player.x - 27;
            bullet.y = player.y - 11;

            app.stage.addChild(bullet);
        }
        if (up) {
            bullet.x = player.x;
            bullet.y = player.y - 40;
            bullet.angle = 90;

            app.stage.addChild(bullet);
        }
        if (right) {
            bullet.x = player.x + 27;
            bullet.y = player.y - 11;

            app.stage.addChild(bullet);
        }

        return bullet;
    }

    function updateBullets() {
        if (bulletsLeft.length >= 1) {
            for (let i = 0; i < bulletsLeft.length; i++) {
                bulletsLeft[i].position.x -= bulletSpeed;

                for (let j = 0; j < enemies.length; j++) {
                    if (rectsIntersect(bulletsLeft[i], enemies[j])) {
                        enemies[j].position.set(enemies[j].x, enemies[j].y + 1000)
                        app.stage.removeChild(enemies[j]);
                        enemies.splice(j, 1);
                        app.stage.removeChild(bulletsLeft[i]);
                        bulletsLeft[i].position.set(bulletsLeft[i].x, bulletsLeft[i].y + 1000);
                        scorePoints += 10;
                        addScore.text = scorePoints.toString();
                        scorePosition();
                    }
                }

                if (bulletsLeft[i].position.x < 0) {
                    app.stage.removeChild(bulletsLeft[i]);
                    bulletsLeft.splice(i, 1);
                }
            }
        }
        if (bulletsUp.length >= 1) {
            for (let i = 0; i < bulletsUp.length; i++) {
                bulletsUp[i].position.y -= bulletSpeed;
                if (crates[0]) {
                    if (rectsIntersect(bulletsUp[i], crates[0])) {
                        crates[0].position.set(crates[0].x, crates[0].y + 1000);
                        app.stage.removeChild(crates[0]);
                        crates.splice(0, 1);
                        bulletsUp[i].position.set(bulletsUp[i].x, bulletsUp[i].y + 1000);
                        app.stage.removeChild(bulletsUp[i]);
                        bulletsUp.splice(i, 1);
                        bulletsNumber += 5;
                        removeBullet.text = bulletsNumber.toString();
                    }
                }
                if (bulletsUp.length > 0) {
                    if (bulletsUp[i].position.y < 0) {
                        app.stage.removeChild(bulletsUp[i]);
                        bulletsUp.splice(i, 1);
                    }

                }

            }
        }
        if (bulletsRight.length >= 1) {
            for (let i = 0; i < bulletsRight.length; i++) {
                bulletsRight[i].position.x += bulletSpeed;

                for (let j = 0; j < enemies.length; j++) {
                    if (rectsIntersect(bulletsRight[i], enemies[j])) {
                        enemies[j].position.set(enemies[j].x, enemies[j].y + 1000)
                        app.stage.removeChild(enemies[j]);
                        enemies.splice(j, 1);
                        app.stage.removeChild(bulletsRight[i]);
                        bulletsRight[i].position.set(bulletsRight[i].x, bulletsRight[i].y + 1000);
                        scorePoints += 10;
                        addScore.text = scorePoints.toString();
                        scorePosition();
                    }
                }
                if (bulletsRight[i].position.x > 854) {
                    app.stage.removeChild(bulletsRight[i]);
                    bulletsRight.splice(i, 1);
                }
            }
        }
    }

    //Collision detection

    function rectsIntersect(a: PIXI.Sprite, b: PIXI.Sprite): boolean {
        const aBox = a.getBounds();
        const bBox = b.getBounds();

        if (a.getBounds == null || b.getBounds == null) {
            return false;
        }
        else {
            return aBox.x + aBox.width > bBox.x &&
                aBox.x < bBox.x + bBox.width &&
                aBox.y + aBox.height > bBox.y &&
                aBox.y < bBox.y + bBox.height;
        }
    }

    //Capture the keyboard arrow keys

    function keyboardInput(event: KeyboardEvent) {
        if (playerAlive) {
            if (event.keyCode == 37) {
                left = true;
                up = false;
                right = false;
                player.texture = playerLeft;
            }
            if (event.keyCode == 38) {
                up = true
                left = false;
                right = false;
                player.texture = playerUp;
            }
            if (event.keyCode == 39) {
                right = true;
                left = false;
                up = false;
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
}
