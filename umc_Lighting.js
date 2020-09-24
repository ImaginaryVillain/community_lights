//=============================================================================
// Community Plugins - Ultra Mini Lighting system
// umc_Lighting.js
// Version: 1.0
/*=============================================================================
Forked from Terrax Lighting
=============================================================================*/
var umc = umc || {};
umc.Lighting = umc.Lighting || {};
umc.Lighting.version = 1.0;
/*:
* @plugindesc v1.0 The smallest, fastest lighting plugin!
* @author Terrax, iVillain, Aesica
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
* umc.Lighting.on(true); //Turns the script on.
* umc.Lighting.on(false); //Turns the script off. 
* umc.Lighting.tint('#333333'); //Sets the tint. #333333 can be any color.
* --------------------------------------------------------------------------
* Events Note Tag
* --------------------------------------------------------------------------
* Light radius color [brightness] [direction]
* - Light		
* - radius      100, 250, etc
* - color       #ffffff, #ff0000, etc
* - brightness  B50, B25, etc [optional]
* - direction   D1: n.wall, D2: e.wall, D3: s.wall, D4: w.wall [optional]
*/

umc.Lighting = {
    umc_tint_target: '#000000',
    event_note: [],
    event_id: [],
    event_x: [],
    event_y: [],
    event_dir: [],
    event_moving: [],
    event_stacknumber: [],
    event_eventcount: 0,
    tint_oldseconds: 0,
    tint_timer: 0,
    parameters: PluginManager.parameters('umc_Lighting'),
    event_reload_counter: 0,
    umc_tint_target_old: '#000000',
    oldmap: 0,
    note_command: 0
};

umc.Lighting.getTag = function () {
    let note = this.note;
    let result = note.trim();
    return result;
};

umc.Lighting.on = function (option) {
    if (option === true) {
        $gameVariables.SetScriptActive(true);
    } else {
        $gameVariables.SetScriptActive(false);
    }
}

umc.Lighting.ReloadMapEvents = function () {
    //**********************fill up new map-array *************************
    this.event_note = [];
    this.event_id = [];
    this.event_x = [];
    this.event_y = [];
    this.event_dir = [];
    this.event_moving = [];
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
                    this.event_x.push($gameMap.events()[i]._realX);
                    this.event_y.push($gameMap.events()[i]._realY);
                    this.event_dir.push($gameMap.events()[i]._direction);
                    this.event_moving.push($gameMap.events()[i]._moveType || $gameMap.events()[i]._moveRouteForcing);
                    this.event_stacknumber.push(i);
                }
            }
        }
    }
};

// *******************  NORMAL LIGHT SHAPE ***********************************
// Fill gradient circle

Bitmap.prototype.radialgradientFillRect = function (x1, y1, r1, r2, color1, color2, brightness, direction) {
    let maxX = Number(umc.Lighting.parameters['Screensize X']);
    let maxY = Number(umc.Lighting.parameters['Screensize Y']);
    let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color1);
    if (!isValidColor) {
        color1 = '#000000'
    }
    let isValidColor2 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color2);
    if (!isValidColor2) {
        color2 = '#000000'
    }

    x1 = x1 + 20;

    // clipping
    let nx1 = Number(x1);
    let ny1 = Number(y1);
    let nr2 = Number(r2);

    if (nx1 - nr2 > maxX || ny1 - nr2 > maxY || nx1 + nr2 < 0 || nx1 + nr2 < 0) {

    } else {

        if (!brightness) {
            brightness = 0.0;
        }
        if (!direction) {
            direction = 0;
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
        direction = Number(direction);
        let pw = $gameMap.tileWidth() / 2;
        let ph = $gameMap.tileHeight() / 2;
        switch (direction) {
            case 0:
                context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
                break;
            case 1:
                context.fillRect(x1 - r2, y1 - ph, r2 * 2, r2 * 2);
                break;
            case 2:
                context.fillRect(x1 - r2, y1 - r2, r2 * 1 + pw, r2 * 2);
                break;
            case 3:
                context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 1 + ph);
                break;
            case 4:
                context.fillRect(x1 - pw, y1 - r2, r2 * 2, r2 * 2);
                break;
        }
        context.restore();
        this._setDirty();
    };
};

umc.Lighting.tint = function (color) {
    $gameVariables.SetTint(color);
    $gameVariables.SetTintTarget(color);
};

umc.Lighting.hexToRgb = function (hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    result = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return result;
}

Game_Variables.prototype.GetFirstRun = function () {
    if (typeof this._umc_Lighting_FirstRun == 'undefined') {
        this._umc_Lighting_FirstRun = true;
    }
    return this._umc_Lighting_FirstRun;
};
Game_Variables.prototype.SetFirstRun = function (value) {
    this._umc_Lighting_FirstRun = value;
};
Game_Variables.prototype.GetScriptActive = function () {
    if (typeof this._umc_Lighting_ScriptActive == 'undefined') {
        this._umc_Lighting_ScriptActive = false;
    }
    return this._umc_Lighting_ScriptActive;
};

Game_Variables.prototype.SetScriptActive = function (value) {
    this._umc_Lighting_ScriptActive = value;
};

Game_Variables.prototype.SetTint = function (value) {
    this._umc_Tint_Value = value;
};
Game_Variables.prototype.GetTint = function () {
    return this._umc_Tint_Value || '#000000';
};

Game_Variables.prototype.SetTintTarget = function (value) {
    this._umc_TintTarget_Value = value;
};
Game_Variables.prototype.GetTintTarget = function () {
    return this._umc_TintTarget_Value || '#000000';
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
    if (this._umc_Lighting_Radius === undefined) {
        return 150;
    } else {
        return this._umc_Lighting_Radius;
    }
};

Game_Variables.prototype.SetLightArrayId = function (value) {
    this._umc_Lighting_LightArrayId = value;
};
Game_Variables.prototype.GetLightArrayId = function () {
    let default_LAI = [];
    return this._umc_Lighting_LightArrayId || default_LAI;
};
Game_Variables.prototype.SetLightArrayState = function (value) {
    this._umc_Lighting_LightArrayState = value;
};
Game_Variables.prototype.GetLightArrayState = function () {
    let default_LAS = [];
    return this._umc_Lighting_LightArrayState || default_LAS;
};
Game_Variables.prototype.SetLightArrayColor = function (value) {
    this._umc_Lighting_LightArrayColor = value;
};
Game_Variables.prototype.GetLightArrayColor = function () {
    let default_LAS = [];
    return this._umc_Lighting_LightArrayColor || default_LAS;
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
    this._maskBitmap = new Bitmap(Number(umc.Lighting.parameters['Screensize X']) + 20, Number(umc.Lighting.parameters['Screensize Y'])); //fullscreen darken
    this.updateTimer = 0;
};

Lightmask.prototype.update = function () {
    this.updateTimer += 1;
    if (this.updateTimer >= 2) {
        this._updateMask();
        this.updateTimer = 0;
    }
};

/**
	 * @method _updateAllSprites
	 * @private
	 */
Lightmask.prototype._updateMask = function () {
    // ****** DETECT MAP CHANGES ********
    let map_id = $gameMap.mapId();
    if (map_id != umc.Lighting.oldmap) {
        umc.Lighting.oldmap = map_id;
        umc.Lighting.ReloadMapEvents();  // reload map events on map chance
    }

    // reload mapevents if event_data has chanced (deleted or spawned events/saves)
    if (umc.Lighting.event_eventcount != $gameMap.events().length) {
        umc.Lighting.ReloadMapEvents();
    }

    // remove old sprites
    for (let i = 0, n = this._sprites.length; i < n; i++) {	  // remove all old sprites
        this._removeSprite();
    }

    if ($gameVariables.GetScriptActive() === true && $gameMap.mapId() >= 0) {
        // are there lightsources on this map?
        let darkenscreen = false;
        for (let i = 0, n = umc.Lighting.event_note.length; i < n; i++) {
            var note = umc.Lighting.event_note[i];
            var note_args = note.split(" ");
            umc.Lighting.note_command = note_args.shift().toLowerCase();
            this._addSprite(-20, 0, this._maskBitmap); // light event? yes.. then turn off the lights
            darkenscreen = true;
            break;
        }
        if (darkenscreen == true) {
            this.darkenscreen = umc.Lighting.darkenscreen;
            this.darkenscreen();
        }
    }
};

umc.Lighting.darkenscreen = function () {
    let maxX = Number(umc.Lighting.parameters['Screensize X']);
    let maxY = Number(umc.Lighting.parameters['Screensize Y']);

    let firstrun = $gameVariables.GetFirstRun();
    if (firstrun === true) {
        umc_tint_speed = 60;
        umc.Lighting.umc_tint_target = '#000000';
        umc_tint_speed_old = 60;
        umc.Lighting.umc_tint_target_old = '#000000';
        $gameVariables.SetFirstRun(false);
        player_radius = Number(umc.Lighting.parameters['Player radius']);
        $gameVariables.SetRadius(player_radius);
    } else {
        player_radius = $gameVariables.GetRadius();
    }

    $gameVariables.SetRadius(player_radius);

    // ****** PLAYER LIGHTGLOBE ********
    let canvas = this._maskBitmap.canvas;
    let ctx = canvas.getContext("2d");
    this._maskBitmap.fillRect(0, 0, maxX + 20, maxY, '#000000');
    ctx.globalCompositeOperation = 'lighter';
    let pw = $gameMap.tileWidth();
    let ph = $gameMap.tileHeight();
    let dx = $gameMap.displayX();
    let dy = $gameMap.displayY();
    let px = $gamePlayer._realX;
    let py = $gamePlayer._realY;
    let x1 = (pw / 2) + ((px - dx) * pw);
    let y1 = (ph / 2) + ((py - dy) * ph);
    if (dx > $gamePlayer.x) {
        let xjump = $gameMap.width() - Math.floor(dx - px);
        x1 = (pw / 2) + (xjump * pw);
    }
    if (dy > $gamePlayer.y) {
        let yjump = $gameMap.height() - Math.floor(dy - py);
        y1 = (ph / 2) + (yjump * ph);
    }

    let playercolor = $gameVariables.GetPlayerColor();
    let playerbrightness = $gameVariables.GetPlayerBrightness();
    let iplayer_radius = Math.floor(player_radius);

    if (iplayer_radius > 0) {
        this._maskBitmap.radialgradientFillRect(x1, y1, 0, iplayer_radius, playercolor, '#000000', playerbrightness);
    }

    // ********** OTHER LIGHTSOURCES **************
    for (let i = 0, n = umc.Lighting.event_note.length; i < n; i++) {
        let note = umc.Lighting.event_note[i];
        let note_args = note.split(" ");
        umc.Lighting.note_command = note_args.shift().toLowerCase();

        if (umc.Lighting.note_command == "light") {
            let light_radius = 1;
            light_radius = note_args.shift();
            // light radius
            if (light_radius >= 0) {

                // light color
                let colorvalue = note_args.shift();
                let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorvalue);
                if (!isValidColor) {
                    colorvalue = '#FFFFFF'
                }

                // brightness and direction
                let brightness = 0.0;
                let direction = 0;

                // show light
                let lpx = 0;
                let lpy = 0;
                //let ldir = 0;
                if (umc.Lighting.event_moving[i] > 0) {
                    lpx = $gameMap.events()[umc.Lighting.event_stacknumber[i]]._realX;
                    lpy = $gameMap.events()[umc.Lighting.event_stacknumber[i]]._realY;
                    //ldir = $gameMap.events()[umc.Lighting.event_stacknumber[i]]._direction;
                } else {
                    lpx = umc.Lighting.event_x[i];
                    lpy = umc.Lighting.event_y[i];
                    //ldir = umc.Lighting.event_dir[i];
                }

                let lx1 = (pw / 2) + ((lpx - dx) * pw);
                let ly1 = (ph / 2) + ((lpy - dy) * ph);

                if ($dataMap.scrollType === 2 || $dataMap.scrollType === 3) {
                    if (dx - 10 > lpx) {
                        let lxjump = $gameMap.width() - (dx - lpx);
                        lx1 = (pw / 2) + (lxjump * pw);
                    }
                }
                if ($dataMap.scrollType === 1 || $dataMap.scrollType === 3) {
                    if (dy - 10 > lpy) {
                        let lyjump = $gameMap.height() - (dy - lpy);
                        ly1 = (ph / 2) + (lyjump * ph);
                    }
                }
                this._maskBitmap.radialgradientFillRect(lx1, ly1, 0, light_radius, colorvalue, '#000000', brightness, direction);
            }
        }
    }
    ctx.globalCompositeOperation = 'lighter';
    let tint_value = $gameVariables.GetTint();
    let tint_target = $gameVariables.GetTintTarget();

    if (umc.Lighting.umc_tint_target != umc.Lighting.umc_tint_target_old) {
        umc.Lighting.umc_tint_target_old = umc.Lighting.umc_tint_target;
        tint_target = umc.Lighting.umc_tint_target;
        $gameVariables.SetTintTarget(tint_target);
    }
    let tcolor = tint_value;
    if (tint_value != tint_target) {

        let tintdatenow = new Date();
        let tintseconds = Math.floor(tintdatenow.getTime() / 10);
        if (tintseconds > umc.Lighting.tint_oldseconds) {
            umc.Lighting.tint_oldseconds = tintseconds;
            umc.Lighting.tint_timer++;
        }

        let r = umc.Lighting.hexToRgb(tint_value).r;
        let g = umc.Lighting.hexToRgb(tint_value).g;
        let b = umc.Lighting.hexToRgb(tint_value).b;

        let r2 = umc.Lighting.hexToRgb(tint_target).r;
        let g2 = umc.Lighting.hexToRgb(tint_target).g;
        let b2 = umc.Lighting.hexToRgb(tint_target).b;

        let stepR = (r2 - r) / (60 * tint_speed);
        let stepG = (g2 - g) / (60 * tint_speed);
        let stepB = (b2 - b) / (60 * tint_speed);

        let r3 = Math.floor(r + (stepR * umc.Lighting.tint_timer));
        let g3 = Math.floor(g + (stepG * umc.Lighting.tint_timer));
        let b3 = Math.floor(b + (stepB * umc.Lighting.tint_timer));
        if (r3 < 0) {
            r3 = 0
        }
        if (g3 < 0) {
            g3 = 0
        }
        if (b3 < 0) {
            b3 = 0
        }
        if (r3 > 255) {
            r3 = 255
        }
        if (g3 > 255) {
            g3 = 255
        }
        if (b3 > 255) {
            b3 = 255
        }
        let reddone = false;
        let greendone = false;
        let bluedone = false;
        if ((stepR >= 0 && r3 >= r2) || (stepR <= 0 && r3 <= r2)) {
            reddone = true;
        }
        if ((stepG >= 0 && g3 >= g2) || (stepG <= 0 && g3 <= g2)) {
            greendone = true;
        }
        if ((stepB >= 0 && b3 >= b2) || (stepB <= 0 && b3 <= b2)) {
            bluedone = true;
        }
        if (reddone == true && bluedone == true && greendone == true) {
            $gameVariables.SetTint(tint_target);
        }
        tcolor = "#" + ((1 << 24) + (r3 << 16) + (g3 << 8) + b3).toString(16).slice(1);
    } else {
        umc.Lighting.tint_timer = 0;
    }
    this._maskBitmap.FillRect(-20, 0, maxX + 20, maxY, tcolor);

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
    /*sprite.rotation = 0;
    sprite.ax = 0;
    sprite.ay = 0;
    sprite.opacity = 255;*/
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

Bitmap.prototype.FillCircle = function (centerX, centerY, xradius, yradius, color1) {
    centerX = centerX + 20;
    let context = this._context;
    context.save();
    context.fillStyle = color1;
    context.beginPath();
    let rotation = 0;
    let start_angle = 0;
    let end_angle = 2 * Math.PI;
    for (let i = start_angle * Math.PI; i < end_angle * Math.PI; i += 0.01) {
        xPos = centerX - (yradius * Math.sin(i)) * Math.sin(rotation * Math.PI) + (xradius * Math.cos(i)) * Math.cos(rotation * Math.PI);
        yPos = centerY + (xradius * Math.cos(i)) * Math.sin(rotation * Math.PI) + (yradius * Math.sin(i)) * Math.cos(rotation * Math.PI);
        if (i == 0) {
            context.moveTo(xPos, yPos);
        } else {
            context.lineTo(xPos, yPos);
        }
    }
    context.fill();
    context.closePath();
    context.restore();
    this._setDirty();
};

/**
 * @method _removeSprite
 * @private
 */
Lightmask.prototype._removeSprite = function () {
    this.removeChild(this._sprites.pop());
};

umc.Lighting.Spriteset_Map_prototype_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function () {
    umc.Lighting.Spriteset_Map_prototype_createLowerLayer.call(this);
    this.createLightmask();
};