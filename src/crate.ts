import * as PIXI from "pixi.js";

export function createCrate(crateTexture: PIXI.Texture): PIXI.Sprite {
    const crate = PIXI.Sprite.from(crateTexture);
    crate.anchor.set(0.5);
    crate.position.set(-30, crate.height + 30);
    crate.scale.x = 0.8;
    crate.scale.y = 0.8;
    return crate;
}