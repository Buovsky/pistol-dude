import * as PIXI from "pixi.js";

export function rectsIntersect(a: PIXI.Sprite, b: PIXI.Sprite): boolean {
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