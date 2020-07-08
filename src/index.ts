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
    console.log("Zombie:",zombie.width, zombie.height);

    const playerLeft = PIXI.Texture.from('assets/playerLeft.png');
    const playerUp = PIXI.Texture.from('assets/playerUp.png');
    const playerRight = PIXI.Texture.from('assets/playerRight.png');
    const player = PIXI.Sprite.from(playerLeft);
    player.scale.x = 0.3;
    player.scale.y = 0.3;
    player.position.set(app.view.width/2,app.view.height/2+170);
    player.anchor.set(0.5);
    
    console.log(player.position);

    app.stage.addChild(player);

    //Capture the keyboard arrow keys

    window.addEventListener('keydown', keyboardInput);
    function keyboardInput(event: KeyboardEvent)
{
    if(event.keyCode == 37)
    {
        console.log("Left Arrow pressed!");
        player.texture = playerLeft;
    }
    if(event.keyCode == 38)
    {
        console.log("Up Arrow pressed!");
        player.texture = playerUp;
    }
    if(event.keyCode == 39)
    {
        console.log("Right Arrow pressed!");
        player.texture = playerRight;
    }
}

    var seconds = 0;
    app.ticker.add((delta) => {
        seconds += delta/50;

        //console.log(seconds);
        
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

/*function keyboardInput(event: KeyboardEvent)
{
    if(event.keyCode == 37)
    {
        console.log("Left Arrow pressed!");
        player.texture = playerLeft;
    }
    if(event.keyCode == 38)
    {
        console.log("Up Arrow pressed!");
        player.texture = playerUp;
    }
    if(event.keyCode == 39)
    {
        console.log("Right Arrow pressed!");
        player.texture = playerRight;
    }

}*/

/*function gameLoop(delta)
{
    app.ticker.add((delta) => {
        zombie;
    });
}*/



