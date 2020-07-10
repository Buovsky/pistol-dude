import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 854,
    height: 480,
    backgroundColor: 0xeeeeeee
});

document.body.appendChild(app.view);

const loader = new PIXI.Loader();
//const resources = PIXI.LoaderResource;

loader.load(setup);



function setup() 
{
    //const app.stage = new PIXI.Container();
    //app.stage.addChild(app.stage);

    //const gameOverScene = new PIXI.Container();
    //app.stage.addChild(gameOverScene);

    //gameOverScene.visible = false;
    
    
    console.log("setup");
    
    const backgroundTexture = PIXI.Texture.from('assets/background.png');
    const background = PIXI.Sprite.from(backgroundTexture);
    app.stage.addChild(background);
    console.log("Background:",background.width, background.height);

    const zombie1 = PIXI.Texture.from('assets/zombie1.png');
    const zombie2 = PIXI.Texture.from('assets/zombie2.png');

    var enemies = [];

    const crateTexture = PIXI.Texture.from('assets/crate.png');
    var crates = [];
    const crateSpeed = 1;

    const playerLeft = PIXI.Texture.from('assets/playerLeft.png');
    const playerUp = PIXI.Texture.from('assets/playerUp.png');
    const playerRight = PIXI.Texture.from('assets/playerRight.png');
    const player = PIXI.Sprite.from(playerLeft);
    player.scale.x = 0.3;
    player.scale.y = 0.3;
    player.position.set(app.view.width/2,app.view.height/2+170);
    player.anchor.set(0.5);
    app.stage.addChild(player);

    var playerAlive = true;

    const bulletTexture = PIXI.Texture.from("assets/bullet.png");
    var bulletsNumber = 10;
    const bulletSpeed = 4;

    var bulletsLeft = [];
    var bulletsUp = [];
    var bulletsRight = [];

    // Keyboard variables
    var left = true;
    var up = false;
    var right = false;

    var scorePoints = 0;

    window.addEventListener('keydown', keyboardInput);

    var addScore = new PIXI.Text(scorePoints.toString());
    var removeBullet = new PIXI.Text(bulletsNumber.toString());
    drawUI();
    gameLoop();
    
    function gameLoop()
    {
        var seconds = 0;
        var spawnerSeconds = 0;
        var spawnerCrateSeconds = 0;
        var timeToSpawnCrate = 15;
        app.ticker.add((delta) => {
            seconds += delta/50;
            spawnerSeconds += delta/50;
            spawnerCrateSeconds += delta/50;

            updateBullets();
            if(spawnerSeconds > 1)
            {
                spawnZombie();
                spawnerSeconds = 0;
            }
            if(seconds > 2)
            {
                seconds = 0;
                
            }
            if(spawnerCrateSeconds > timeToSpawnCrate)
            {
                createCrate();
                if(scorePoints > 100)
                {
                    timeToSpawnCrate = 6;
                }
                spawnerCrateSeconds = 0;
            }
            

            if(playerAlive)
            {
                
                updateZombies(seconds);
                updateCrate(seconds);
                keyboardInput;
                
                for (var j = 0; j < enemies.length; j++)
                {
                    /*if(rectsIntersect(player, enemies[j]))
                    {
                        app.stage.removeChild(player);
                        playerAlive = false;
                    }*/
                }
            }
            else
            {
                
            }
            
        });
    }

    // Drawing UI

    function drawUI()
    {
        var score = new PIXI.Text("SCORE: ");
        score.position.set(80,30);
        score.anchor.set(0.5);
        score.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize:35,
            strokeThickness: 5,
            letterSpacing: 2
            
        });
        app.stage.addChild(score);

        addScore.position.set(160,30);
        addScore.anchor.set(0.5);
        addScore.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize:35,
            strokeThickness: 5,
            letterSpacing: 2
        });
        app.stage.addChild(addScore);
        
        var bulletAmount = new PIXI.Text("BULLETS: ");
        bulletAmount.position.set(705,30);
        bulletAmount.anchor.set(0.5);
        bulletAmount.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize:35,
            strokeThickness: 5,
            letterSpacing: 1
        });
        app.stage.addChild(bulletAmount);
        removeBullet.position.set(810,30);
        removeBullet.anchor.set(0.5);
        removeBullet.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Ardcade",
            fontSize:35,
            strokeThickness: 5,
            letterSpacing: 1
        });
        app.stage.addChild(removeBullet);
    }
    function scorePosition()
    {
        if(scorePoints >= 100)
        {
            addScore.x = 170;
        }
        if(scorePoints >= 1000)
        {
            addScore.x = 180;
        }
    }

    // Spawning enemies

    function spawnZombie()
    {
        var enemyNumber = 1;
        if(scorePoints > 100)
        {
            enemyNumber = 3;
        }
        if(scorePoints > 300)
        {
            enemyNumber = 5;
        }
        if(enemies.length <= enemyNumber)
        {
            console.log("SPAWN");
            var enemy = createZombie();
            enemies.push(enemy);
        }
    }
    function createZombie()
    {
        var enemy = PIXI.Sprite.from(zombie1);
        enemy.anchor.set(0.5);
        enemy.scale.x = 0.3;
        enemy.scale.y = 0.3;

        var random = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

        if(random == 1)
        {
            enemy.position.set(-30, player.y);
            app.stage.addChild(enemy);
        }
        else
        {
            enemy.position.set(884, player.y);
            app.stage.addChild(enemy);
        }

        return enemy;
    }

    function updateZombies(seconds)
    {
        for(var i = 0; i < enemies.length; i++)
        {
            if(enemies[i].x < player.x)
            {
                enemies[i].x++;
            }
            else
            {
                enemies[i].x--;
            }
            if(seconds <= 2 && seconds >= 1)
            {
                enemies[i].texture = zombie2;
            }
            if(seconds <= 1)
            {
                enemies[i].texture = zombie1;
            }
        }
    }

    function createCrate()
    {
        console.log("Crate Spawned");

        var crate = PIXI.Sprite.from(crateTexture);
        crate.anchor.set(0.5);
        crate.position.set(-30, player.y - 300);
        crate.scale.x = 0.8;
        crate.scale.y = 0.8;
        app.stage.addChild(crate);
        crates.push(crate);
    } 
    function updateCrate(seconds)
    {
        if(crates[0])
        {
            if(seconds <= 2 && seconds >= 1)
            {
                crates[0].x += crateSpeed;
                crates[0].y -= crateSpeed;
            }
            if(seconds <= 1)
            { 
                crates[0].x += crateSpeed;
                crates[0].y += crateSpeed;
            }
            if(crates[0].position.x > 854)
            {
                app.stage.removeChild(crates[0]);
                crates.splice(0,1);
            }
        }
    }


    //Bullet functionality 

    function fireBullet()
    {
        if(bulletsNumber > 0)
        {
            console.log("FIRE!");
            var bullet = createBullet();
            if(left)
            {
                bulletsLeft.push(bullet);
            }
            if(up)
            {
                bulletsUp.push(bullet);
            }
            if(right)
            {
                bulletsRight.push(bullet);
            }
            bulletsNumber--;
            removeBullet.text = bulletsNumber.toString();
        }
    }

    function createBullet()
    {
        const bullet = PIXI.Sprite.from(bulletTexture);
        bullet.anchor.set(0.5);
        if(left)
        {
            bullet.x = player.x - 27;
            bullet.y = player.y - 11;

            app.stage.addChild(bullet);
        }
        if(up)
        {
            bullet.x = player.x;
            bullet.y = player.y -  40;
            bullet.angle = 90;

            app.stage.addChild(bullet);
        }
        if(right)
        {
            bullet.x = player.x + 27;
            bullet.y = player.y - 11;

            app.stage.addChild(bullet);
        }
        console.log("Bullets Left: ", bulletsLeft.length);
        console.log("Bullets UP: ", bulletsUp.length);
        
        return bullet;
    }

    function updateBullets()
    {
        if(bulletsLeft.length >= 1)
        {
            for (var i = 0; i < bulletsLeft.length; i++)
            {
                bulletsLeft[i].position.x -= bulletSpeed;

                for (var j = 0; j < enemies.length; j++)
                {
                    if(rectsIntersect(bulletsLeft[i], enemies[j]))
                    {
                        enemies[j].position.set(enemies[j].x,enemies[j].y+1000)
                        app.stage.removeChild(enemies[j]);
                        enemies.splice(j,1);
                        app.stage.removeChild(bulletsLeft[i]);
                        bulletsLeft[i].position.set(bulletsLeft[i].x , bulletsLeft[i].y+1000);
                        scorePoints += 10;
                        addScore.text = scorePoints.toString();
                        scorePosition();
                    }
                }

                if(bulletsLeft[i].position.x < 0)
                {
                    app.stage.removeChild(bulletsLeft[i]);
                    bulletsLeft.splice(i,1);
                }
            }
        }
        if(bulletsUp.length >= 1)
        {
            for (var i = 0; i < bulletsUp.length; i++)
            {
                bulletsUp[i].position.y -= bulletSpeed;
                if(crates[0])
                {
                    if(rectsIntersect(bulletsUp[i],crates[0]))
                    {
                        crates[0].position.set(crates[0].x,crates[0].y+1000);
                        app.stage.removeChild(crates[0]);
                        crates.splice(0,1);
                        bulletsUp[i].position.set(bulletsUp[i].x,bulletsUp[i].y+1000);
                        app.stage.removeChild(bulletsUp[i]);
                        bulletsUp.splice(i,1);
                        bulletsNumber += 5;
                        removeBullet.text = bulletsNumber.toString();
                    }
                }
                if(bulletsUp.length > 0)
                {
                    if(bulletsUp[i].position.y < 0)
                    {
                        app.stage.removeChild(bulletsUp[i]);
                        bulletsUp.splice(i,1);
                    }
                    
                }
                
            }
        }
        if(bulletsRight.length >= 1)
        {
            for (var i = 0; i < bulletsRight.length; i++)
            {
                bulletsRight[i].position.x += bulletSpeed;
                
                for (var j = 0; j < enemies.length; j++)
                {
                    if(rectsIntersect(bulletsRight[i], enemies[j]))
                    {
                        enemies[j].position.set(enemies[j].x,enemies[j].y+1000)
                        app.stage.removeChild(enemies[j]);
                        enemies.splice(j,1);
                        app.stage.removeChild(bulletsRight[i]);
                        bulletsRight[i].position.set(bulletsRight[i].x , bulletsRight[i].y+1000);
                        scorePoints += 10;
                        addScore.text = scorePoints.toString();
                        scorePosition();
                    }
                }
                if(bulletsRight[i].position.x > 854)
                {
                    app.stage.removeChild(bulletsRight[i]);
                    bulletsRight.splice(i,1);
                 }
            }
        }
        
    }

    //Collision detection

    function rectsIntersect(a,b)
    {
        const aBox = a.getBounds();
        const bBox = b.getBounds();

        if(a.getBounds == null || b.getBounds  == null)
        {
            return 0;
        }
        else
        {
            return aBox.x + aBox.width > bBox.x &&
               aBox.x < bBox.x + bBox.width &&
               aBox.y + aBox.height > bBox.y &&
               aBox.y < bBox.y + bBox.height;
        }
    }

    //Capture the keyboard arrow keys

    function keyboardInput(event: KeyboardEvent)
    {
        if(playerAlive)
        {
            if(event.keyCode == 37)
            {
                console.log("Left Arrow pressed!");
                left = true;
                up = false;
                right = false;
                player.texture = playerLeft;
                console.log(left);
            }
            if(event.keyCode == 38)
            {
                console.log("Up Arrow pressed!");
                up = true
                left = false;
                right = false;
                player.texture = playerUp;
                console.log(up);
    
            }
            if(event.keyCode == 39)
            {
                console.log("Right Arrow pressed!");
                right = true;
                left = false;
                up = false;
                player.texture = playerRight;
                console.log(right);
    
            }
            if(event.keyCode == 32)
            {
                console.log("Space pressed!");
                fireBullet();
            }
        }

    }    
}