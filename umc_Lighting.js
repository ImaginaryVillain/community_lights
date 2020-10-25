//=============================================================================
// Community Plugins - Ultra Mini Lighting system
// umc_Lighting.js
// Version: 1.45
/*=============================================================================
Forked from Terrax Lighting
=============================================================================*/
var umc = umc || {};
umc.Lighting = umc.Lighting || {};
umc.Lighting.version = 1.45;
/*:
* @plugindesc v1.2 The smallest, fastest lighting plugin!
* @author Terrax, iVillain, Aesica
*
* @param Lights Active Radius
* @parent ---Offset and Sizes---
* @desc The number of grid spaces away from the player that lights are turned on.
* Default: 20
* @default 20
*
* @param Player radius
* @parent ---Offset and Sizes---
* @desc Adjust the light radius around the player
* Default: 300
* @default 300
*
* @param Screensize X
* @parent ---Offset and Sizes---
* @desc Increase if your using a higher screen resolution then the default
* Default : 866
* @default 866
*
* @param Screensize Y
* @parent ---Offset and Sizes---
* @desc Increase if your using a higher screen resolution then the default
* Default : 630
* @default 630
*
* @help
* --------------------------------------------------------------------------
* Script Commands
* --------------------------------------------------------------------------
* umc.Lighting.tint('#333333'); //Sets the tint. #333333 can be any color.
* --------------------------------------------------------------------------
* Events Note Tag
* --------------------------------------------------------------------------
* Light radius color
* - Light		
* - radius      100, 250, etc
* - color       #ffffff, #ff0000, etc
*/

umc.Lighting = {
    event_note: [],
    event_id: [],
    event_stacknumber: [],
    event_eventcount: 0,
    parameters: PluginManager.parameters('umc_Lighting'),
    oldmap: 0,
    note_command: 0
};

umc.Lighting.getTag = function () {
    let note = this.note;
    let result = note.trim();
    return result;
};

umc.Lighting.ReloadMapEvents = function () {
    //**********************fill up new map-array *************************
    this.event_note = [];
    this.event_id = [];
    this.event_stacknumber = [];
    this.event_eventcount = $gameMap.events().length;

    for (let i = 0, n = this.event_eventcount; i < n; i++) {
        if ($gameMap.events()[i]) {
            if ($gameMap.events()[i].event()) {
                let note = this.getTag.call($gameMap.events()[i].event());
                let note_args = note.split(" ");
                umc.Lighting.note_command = note_args.shift().toLowerCase();

                if (umc.Lighting.note_command == "light") {
                    this.event_note.push(note);
                    this.event_id.push($gameMap.events()[i]._eventId);
                    this.event_stacknumber.push(i);
                }
            }
        }
    }
};

// *******************  NORMAL LIGHT SHAPE ***********************************
// Fill gradient circle
Bitmap.prototype.radialgradientFillRect = function (x1, y1, r1, r2, color1, color2, brightness) {
    let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color1);
    if (!isValidColor) {
        color1 = '#000000'
    }
    let isValidColor2 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color2);
    if (!isValidColor2) {
        color2 = '#000000'
    }

    x1 = x1 + 20;

    if (!brightness) {
        brightness = 0.0;
    }

    let context = this._context;
    let grad;

    grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
    if (brightness) {
        grad.addColorStop(0, '#FFFFFF');
    }
    grad.addColorStop(brightness, color1);
    grad.addColorStop(1, color2);

    context.save();
    context.fillStyle = grad;
    context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
    context.restore();
    this._setDirty();
};

umc.Lighting.tint = function (color) {
    $gameVariables.SetTint(color);
};

umc.Lighting.hexToRgb = function (hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    result = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return result;
};

Game_Variables.prototype.SetTint = function (value) {
    this._umc_Tint_Value = value;
};
Game_Variables.prototype.GetTint = function () {
    return this._umc_Tint_Value || '#000000';
};
Game_Variables.prototype.SetPlayerColor = function (value) {
    this._umc_Lighting_PlayerColor = value;
};
Game_Variables.prototype.GetPlayerColor = function () {
    return this._umc_Lighting_PlayerColor || '#FFFFFF';
};
Game_Variables.prototype.SetPlayerBrightness = function (value) {
    this._umc_Lighting_PlayerBrightness = value;
};
Game_Variables.prototype.GetPlayerBrightness = function (value) {
    this._umc_Lighting_PlayerBrightness = value || 0.0;
};
Game_Variables.prototype.SetRadius = function (value) {
    this._umc_Lighting_Radius = value;
};
Game_Variables.prototype.GetRadius = function () {
    return this._umc_Lighting_Radius || 150;
};

Spriteset_Map.prototype.createLightmask = function () {
    this._lightmask = new Lightmask();
    this.addChild(this._lightmask);
};

function Lightmask() {
    this.initialize.apply(this, arguments);
}

Lightmask.prototype = Object.create(PIXI.Container.prototype);
Lightmask.prototype.constructor = Lightmask;

Lightmask.prototype.initialize = function () {
    PIXI.Container.call(this);
    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];
    this._createBitmap();
};

Lightmask.prototype._createBitmap = function() {
    this._maskBitmap = new Bitmap(Number(umc.Lighting.parameters['Screensize X']) + 20, Number(umc.Lighting.parameters['Screensize Y']));   // one big bitmap to fill the intire screen with black
};

Lightmask.prototype.update = function () {
    requestAnimationFrame(this._updateMask.bind(this));
};

Lightmask.prototype._updateMask = function () {
    // Reload map events if map is changed.
    let map_id = $gameMap.mapId();
    if (map_id != umc.Lighting.oldmap) {
        umc.Lighting.oldmap = map_id;
        umc.Lighting.ReloadMapEvents();
        player_radius = Number(umc.Lighting.parameters['Player radius']);
        $gameVariables.SetRadius(player_radius);  
    }

    // reload mapevents if event_data has chanced (deleted or spawned events/saves)
    if (umc.Lighting.event_eventcount != $gameMap.events().length) {
        umc.Lighting.ReloadMapEvents();
    }

    // remove old sprites
    for (let i = 0, n = this._sprites.length; i < n; i++) {	
        this._removeSprite();
    }
    this.darkenscreen();
    
    if ($gameMap.mapId() >= 0) {      
        for (let i = 0, n = umc.Lighting.event_note.length; i < n; i++) {
            var note = umc.Lighting.event_note[i];
            var note_args = note.split(" ");
            umc.Lighting.note_command = note_args.shift().toLowerCase();
            this._addSprite(-20, 0, this._maskBitmap);
            break;
        }  
    };
};

umc.Lighting.distance = function (x1, y1, x2, y2) {
    return Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
};

Lightmask.prototype.darkenscreen = function () {
    let maxX = Number(umc.Lighting.parameters['Screensize X']);
    let maxY = Number(umc.Lighting.parameters['Screensize Y']);

    player_radius = $gameVariables.GetRadius();
    $gameVariables.SetRadius(player_radius);

    // ****** PLAYER LIGHTGLOBE ********
    let canvas = this._maskBitmap.canvas;
    let ctx = canvas.getContext("2d");
    this._maskBitmap.fillRect(0, 0, maxX + 20, maxY+20, '#000000');
    ctx.globalCompositeOperation = 'lighter';

    let playercolor = $gameVariables.GetPlayerColor();
    let playerbrightness = $gameVariables.GetPlayerBrightness();
    let iplayer_radius = Math.floor(player_radius);
    
    try{
    if (iplayer_radius > 0) {
        this._maskBitmap.radialgradientFillRect($gamePlayer.screenX(),$gamePlayer.screenY(), 0, iplayer_radius, playercolor, '#000000', playerbrightness);
    }}
    catch (e){};

    // ********** OTHER LIGHTSOURCES **************
    for (let i = 0, n = umc.Lighting.event_note.length; i < n; i++) {
        let note = umc.Lighting.event_note[i];
        let note_args = note.split(" ");
        umc.Lighting.note_command = note_args.shift().toLowerCase();

        if (umc.Lighting.note_command == "light") {
            let lightsOnRadius = Number(umc.Lighting.parameters['Lights Active Radius']);
            let distanceApart = Math.round(umc.Lighting.distance($gamePlayer.x, $gamePlayer.y, $gameMap.events()[umc.Lighting.event_stacknumber[i]]._realX, $gameMap.events()[umc.Lighting.event_stacknumber[i]]._realY));
            if (distanceApart <= lightsOnRadius) {
                let light_radius = 1;
                light_radius = note_args.shift();
                if (light_radius >= 0) {

                    let colorvalue = note_args.shift();
                    let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorvalue);
                    if (!isValidColor) {
                        colorvalue = '#FFFFFF'
                    }

                    try {
                        let lx1 = $gameMap.events()[umc.Lighting.event_stacknumber[i]].screenX();
                        let ly1 = $gameMap.events()[umc.Lighting.event_stacknumber[i]].screenY();
                        this._maskBitmap.radialgradientFillRect(lx1, ly1 - 24, 0, light_radius, colorvalue, '#000000', 0.0);
                    }
                    catch (e) { continue };
                }
            }
        } else {
            continue;
        };
    }
    ctx.globalCompositeOperation = 'lighter';
    let tint_value = $gameVariables.GetTint();

    if (tint_value !== 0){
        this._maskBitmap.FillRect(-20, 0, maxX + 20, maxY, tint_value);
    }
    // reset drawmode to normal
    ctx.globalCompositeOperation = 'source-over';
}

/**
 * @method _addSprite
 * @private
 */
Lightmask.prototype._addSprite = function (x1, y1, selectedbitmap) {
    let sprite = new Sprite(this.viewport);
    sprite.bitmap = selectedbitmap;
    sprite.opacity = 255;
    sprite.blendMode = 2;
    sprite.x = x1;
    sprite.y = y1;
    this._sprites.push(sprite);
    this.addChild(sprite);
};

Bitmap.prototype.FillRect = function (x1, y1, x2, y2, color1) {
    x1 = x1 + 20;
    let context = this._context;
    context.save();
    context.fillStyle = color1;
    context.fillRect(x1, y1, x2, y2);
    context.restore();
    this._setDirty();
};

Lightmask.prototype._removeSprite = function () {
    this.removeChild(this._sprites.pop());
};

umc.Lighting.Spriteset_Map_prototype_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function () {
    umc.Lighting.Spriteset_Map_prototype_createLowerLayer.call(this);
    this.createLightmask();
};