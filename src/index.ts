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
    var zombie = PIXI.Sprite.from(zombie1);
    zombie.scale.x = 0.3;
    zombie.scale.y = 0.3;
    zombie.position.set(100,50);
    zombie.anchor.set(0.5);
    zombie.position.set(app.view.width - 100,app.view.height/2+170);
    app.stage.addChild(zombie);

    const zombie3 = PIXI.Sprite.from(zombie1);
    zombie3.scale.x = 0.3;
    zombie3.scale.y = 0.3;
    zombie3.position.set(100,50);
    zombie3.anchor.set(0.5);
    zombie3.position.set(app.view.width,app.view.height/2+170);
    app.stage.addChild(zombie3);

    var zombieDead = false;

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
    
    const bulletSpeed = 4;

    var bulletsLeft = [];
    var bulletsUp = [];
    var bulletsRight = [];

    // Keyboard variables
    var left = true;
    var up = false;
    var right = false;

    window.addEventListener('keydown', keyboardInput);
    
    gameLoop();
    
    function gameLoop()
    {
        var seconds = 0;
        app.ticker.add((delta) => {
            seconds += delta/50;

            updateBullets();
            
            /*if(seconds >= 0.5)
            {
                zombie.texture = zombie2;
                seconds = 0;
            }
            else
            {
                zombie.texture = zombie1;
            }
            */

            if(playerAlive)
            {
                keyboardInput;

                if(rectsIntersect(player, zombie))
                {
                    app.stage.removeChild(player);
                    playerAlive = false;
                }
                
                zombie.x--;
            }
            else
            {

            }
            
        });
    }
    
    //Bullet functionality 

    function fireBullet()
    {
        console.log("FIRE!");
        const bullet = createBullet();
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

                if(bulletsLeft[i].position.x < 0)
                {
                    app.stage.removeChild(bulletsLeft[i]);
                }
            }
        }
        if(bulletsUp.length >= 1)
        {
            for (var i = 0; i < bulletsUp.length; i++)
            {
                bulletsUp[i].position.y -= bulletSpeed;

                if(bulletsUp[i].position.y < 0)
                {;
                    app.stage.removeChild(bulletsUp[i]);
                }
            }
        }
        if(bulletsRight.length >= 1)
        {
            for (var i = 0; i < bulletsRight.length; i++)
            {
                bulletsRight[i].position.x += bulletSpeed;

                if(!zombieDead)
                {
                    if(rectsIntersect(bulletsRight[i], zombie))
                    {
                        zombie.position.set(zombie.x,zombie.y+1000)
                        app.stage.removeChild(zombie);
                        app.stage.removeChild(bulletsRight[i]);
                    }
                }
                if(bulletsRight[i].position.x > 854)
                {

                    app.stage.removeChild(bulletsRight[i]);
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

/*function gameLoop(delta)
{
    app.ticker.add((delta) => {
        zombie;
    });
}*/



