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
    const zombie = PIXI.Sprite.from(zombie1);
    zombie.scale.x = 0.3;
    zombie.scale.y = 0.3;
    zombie.position.set(100,50);
    zombie.anchor.set(0.5);
    zombie.position.set(app.view.width,app.view.height/2+170);
    app.stage.addChild(zombie);

    const playerLeft = PIXI.Texture.from('assets/playerLeft.png');
    const playerUp = PIXI.Texture.from('assets/playerUp.png');
    const playerRight = PIXI.Texture.from('assets/playerRight.png');
    const player = PIXI.Sprite.from(playerLeft);
    player.scale.x = 0.3;
    player.scale.y = 0.3;
    player.position.set(app.view.width/2,app.view.height/2+170);
    player.anchor.set(0.5);
    app.stage.addChild(player);

    const bulletTexture = PIXI.Texture.from("assets/bullet.png");
    
    const bulletSpeed = 4;

    var bulletsLeft = [];
    var bulletsUp = [];
    var bulletsRight = [];

    // Keyboard variables
    var left = false;
    var up = false;
    var right = false;
    var space = false;

    window.addEventListener('keydown', keyboardInput);
    
    gameLoop();
    
    function gameLoop()
    {
        var seconds = 0;
        app.ticker.add((delta) => {
            seconds += delta/50;

            updateBullets();
            
            if(seconds >= 0.5)
            {
                zombie.texture = zombie2;
                seconds = 0;
            }
            else
            {
                zombie.texture = zombie1;
            }

            zombie.x--;

            keyboardInput;
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

                if(bulletsRight[i].position.x > 854)
                {

                    app.stage.removeChild(bulletsRight[i]);
                }
            }
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
            console.log(left);

        }
        if(event.keyCode == 39)
        {
            console.log("Right Arrow pressed!");
            right = true;
            left = false;
            up = false;
            player.texture = playerRight;
            console.log(left);

        }
        if(event.keyCode == 32)
        {
            console.log("Space pressed!");
            fireBullet();
        }

        
        // if(space && left)
        // {
        //    /* console.log("PIFF PAFF")
        //     bullet.position.set(app.view.width/2-27,app.view.height/2+159);
        //     app.stage.addChild(bullet);*/
        //     space = false;
        //     fireBullet();
        // }
    }
}

/*function gameLoop(delta)
{
    app.ticker.add((delta) => {
        zombie;
    });
}*/



