//=============================================================================
// Community Plugins - Lighting system
// Community_Lighting.js
/*=============================================================================
Forked from Terrax Lighting
=============================================================================*/

if (typeof require !== "undefined" && typeof module != "undefined") {
  var {
    Game_Player,
    Game_Interpreter,
    Game_Event,
    Game_Variables,
    Game_Map,
  } = require("../rpg_objects");
  var {
    PluginManager,
    BattleManager,
    ConfigManager,
  } = require("../rpg_managers");
  var { Window_Base, Window_Options } = require("../rpg_windows");
  var { Spriteset_Map, Spriteset_Battle } = require("../rpg_sprites");
  var { Scene_Map } = require("../rpg_scenes");
  var { Bitmap, Tilemap, ShaderTilemap } = require("../rpg_core");
}
var Community = Community || {};
Community.Lighting = Community.Lighting || {};
Community.Lighting.name = "Community_Lighting";
Community.Lighting.parameters = PluginManager.parameters(Community.Lighting.name);
Community.Lighting.version = 4.6;
var Imported = Imported || {};
Imported[Community.Lighting.name] = true;
/*:
* @plugindesc v4.6 Creates an extra layer that darkens a map and adds lightsources! Released under the MIT license!
* @author Terrax, iVillain, Aesica, Eliaquim, Alexandre, Nekohime1989
*
* @param ---General Settings---
* @default
*
* @param Options Menu Entry
* @parent ---General Settings---
* @desc Adds an option to disable this plugin's lighting effects to the options menu (leave blank to omit)
* @default Lighting Effects
*
* @param Use smoother lights
* @parent ---General Settings---
* @desc Instead of looking like spotlights, the lights get blended further. Does not work on old browsers.
* @type boolean
* @default false
*
* @param Light event required
* @parent ---General Settings---
* @desc At least one light event on the current is needed to make the plugin active (as in original TerraxLighting)
* @type boolean
* @default false
*
* @param Shift lights with events
* @parent ---General Settings---
* @desc Should a light be shifted 6 pixel up if its associated event does?
* @type boolean
* @default false
*
* @param Lights Active Radius
* @parent ---Offset and Sizes---
* @desc The number of grid spaces away from the player that lights are turned on. (0 to not use this functionality)
* Default: 0
* @default 0
*
* @param Daynight Cycle
* @parent ---General Settings---
* @desc Should the brightness change over time
* @type boolean
* @default true
*
* @param Reset Lights
* @parent ---General Settings---
* @desc Resets the conditional lights on map change
* @type boolean
* @default false
*
* @param Kill Switch
* @parent ---General Settings---
* @desc Possible values A,B,C,D. If Selfswitch X is switched ON, the event's lightsource will be disabled.
* @type select
* @option None
* @option A
* @option B
* @option C
* @option D
* @default None
*
* @param Kill Switch Auto
* @parent ---General Settings---
* @desc If a conditional light is OFF(ON), lock the Kill Switch to ON(OFF)?
* @type boolean
* @default false
*
* @param Note Tag Key
* @parent ---General Settings---
* @desc Specify a key (<Key: Light 25 ...>) to be used with all note tags or leave blank for Terrax compatibility (Light 25 ...)
* @default cl
*
* @param ---DayNight Settings---
* @default
*
* @param Daynight Initial Speed
* @parent ---DayNight Settings---
* @desc What is the initial speed of the DayNight cycle?
* @type number
* @min 0
* @default 10
*
* @param Save DaynightHours
* @parent ---DayNight Settings---
* @desc Game variable the time of day (0-23) can be stored in.  Disable: 0
* @type number
* @min 0
* @default 0
*
* @param Save DaynightMinutes
* @parent ---DayNight Settings---
* @desc Game variable the time of day (0-59) can be stored in.  Disable: 0
* @type number
* @min 0
* @default 0
*
* @param Save DaynightSeconds
* @parent ---DayNight Settings---
* @desc Game variable the time of day (0-59) can be stored in.  Disable: 0
* @type number
* @min 0
* @default 0
*
* @param Save Night Switch
* @parent ---DayNight Settings---
* @desc Game switch to set as ON during night and OFF during day.  Disable: 0
* @type number
* @min 0
* @default 0
*
* @param No Autoshadow During Night
* @parent ---DayNight Settings---
* @desc Hide autoshadow during night?
* @type number
* @type boolean
* @default false
*
* @param Night Hours
* @parent ---DayNight Settings---
* @desc Comma-separated list of night hours.  Not used/relevant if Save Night Switch set to 0.
* @default 0, 1, 2, 3, 4, 5, 6, 19, 20, 21, 22, 23
*
* @param DayNight Colors
* @parent ---DayNight Settings---
* @desc Set DayNight colors. Each color represents 1 hour of the day
* @default ["#6666ff","#6666ff","#6666ff","#6666ff","#6666ff","#6666ff","#9999ff","#ccccff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffcc88","#9999ff","#6666ff","#6666ff","#6666ff","#6666ff"]
* @type text[]
*
* @param Daynight Initial Hour
* @parent ---DayNight Settings---
* @desc What is the initial hour?
* @type number
* @min 0
* @default 0
*
* @param ---Offset and Sizes---
* @default
*
* @param Player radius
* @parent ---Offset and Sizes---
* @desc Adjust the light radius around the player
* Default: 300
* @type number
* @min 0
* @default 300
*
* @param Flashlight offset
* @parent ---Offset and Sizes---
* @desc Increase this setting to move up the flashlight for double height characters.
* Default: 0
* @type number
* @min -100
* @max 100
* @default 0
*
* @param Flashlight X offset
* @parent ---Offset and Sizes---
* @desc Use this setting for characters larger than one space.
* Default: 0
* @type number
* @min -100
* @max 100
* @default 0
*
* @param Screensize X
* @parent ---Offset and Sizes---
* @desc Increase if your using a higher screen resolution then the default
* Default : 816
* @default 816
* @type number
* @min 0
*
* @param Screensize Y
* @parent ---Offset and Sizes---
* @desc Increase if your using a higher screen resolution then the default
* Default : 624
* @default 624
* @type number
* @min 0
*
* @param Lightmask Padding
* @parent ---Offset and Sizes---
* @desc Offscreen x-padding size for the light mask
* @type number
* @min 0
* @default 32
*
* @param ---Battle Settings---
* @default
*
* @param Battle Tinting
* @parent ---Battle Settings---
* @desc Add a tint layer to the battle screen? If set to false, no light effect will occur during battles.
* @type boolean
* @default true
*
* @param Light Mask Position
* @parent ---Battle Settings---
* @desc Place the light mask above the battlers, or between the battleground and the battlers?
* @type select
* @option Above Battlers
* @value Above Background and Battler
* @option Between Background and Battlers
* @value Between
* @default Above
*
* @help
*
* --------------------------------------------------------------------------
* Important info about note tags and the note tag key plugin parameter:
*
* 1. This plugin features an optional note tag key that lets this plugin's
* note tags work alongside those of other plugins--a feature not found in the
* original Terrax Lighting plugin. If a note tag key is set in the plugin
* parameters, all of these commands must be enclosed in a note tag with that
* particular key in in order to be recognized.
*
* This note tag key applies to anything this plugin would have placed inside
* a note box, such as "DayNight" on a map or "Light/Fire/etc on an event.
*
* Examples:
*
* With the default note tag key, "CL" (not case sensitive):
* <cl: light 250 #ffffff>
* <cl: daynight>
* ...etc
*
* Without a note tag key set:
* light 250 #ffffff
* daynight
* ...etc
*
* Using a note tag key is recommended since it allows for other things
* (plugins, or even your own personal notes) to make use of the note box
* without breaking things. Omitting the key is intended primarily as legacy
* support, allowing this plugin to be used with older projects that have
* been upgraded from Terrax Lighting so you don't have to go back and
* change a bunch of event and map notes.

*
* 2. New with version 4.2+ is the option to place the lighting note tag 
* anywhere in an event page's comment field instead of the note box, as
* long as the comment field is the first thing on the page.  This allows
* for more advanced lighting tricks to be done on a per-page basis.  Page
* Comment note tags will be prioritized over general note tags, allowing
* tags in the general note box to serve as a default that 1 or more pages
* can override.
*
* It's important to note that active lighting events are only updated
* periodically to avoid needlessly looping through events on the map
* that have nothing to do with lighting.  As such, if your event's note
* box is empty and page 1 has no lighting tag set, but page 2 does, there
* will be a brief delay before the light comes on when you switch to page
* 2.  You can get around this by setting a default empty light note tag
* <cl: light 0 #000> in the general note box.
*
* Finally, this feature isn't available in Terrax compatibility mode (when
* there's no note tag key set).  This is to avoid conflicts when a comment
* appears at the top of a page that has nothing to do with this plugin.
*
* --------------------------------------------------------------------------
* List of Note Tags
* --------------------------------------------------------------------------
*
* Notation legend:
* []   These values are optional (the brightness parameter in light, etc)
* |    Select the value from the specified list (on|off, etc)
*
* Do not include these in the actual note tags or plugin commands.
*
* --------------------------------------------------------------------------
* Events
* --------------------------------------------------------------------------
* DayNight
* - Activates day/night cycle.  Put in map note or event note
*
* Light radius [cycle] color [day|night] [brightness] [direction] [x] [y] [id]
* - Light
* - radius      100, 250, etc
* - cycle       Allows any number of color + duration pairs to follow that will be
*               cycled through before repeating from the beginning:
*               <cl: light 100 cycle #f00 15 #0f0 15 #00f 15 ...etc>
*               In Terrax Lighting, there was a hard limit of 4, but now you can use
*               as many as you want. [optional]
* - color       #ffffff, #ff0000, etc
* - day         Causes the light to only come on during the day [optional]
* - night       Causes the light to only come on during the night [optional]
* - brightness  B50, B25, etc [optional]
* - direction   D1: n.wall, D2: e.wall, D3: s.wall, D4: w.wall
*               D5 n.+e. walls, D6 s.+e. walls, D7 s.+w. walls,
*               D8 n.+w. walls, D9 n.-e. corner, D10 s.-e. corner
*               D11 s.-w. corner, D12 n.-w. corner  [optional]
* - x           x offset [optional] (0.5: half tile, 1 = full tile, etc)
* - y           y offset [optional]
* - id          1, 2, 2345, etc--an id number for plugin commands [optional]
*
* Fire ...params
* - Same as Light params above, but adds a subtle flicker
*
* Flashlight [bl] [bw] [c] [onoff] [sdir] [x] [y] [id]
* - Sets the light as a flashlight with beam length (bl) beam width (bw) color (c),
*      0|1 (onoff), and 1=up, 2=right, 3=down, 4=left for static direction (sdir)
* - bl:       Beam length:  Any number, optionally preceded by "L", so 8, L8
* - bw:       Beam width:  Any number, optionally preceded by "W", so 12, W12
* - cycle     Allows any number of color + duration pairs to follow that will be
*             cycled through before repeating from the beginning:
*             <cl: Flashlight l8 w12 cycle #f00 15 #ff0 15 #0f0 15 on someId d3>
*             There's no limit to how many colors can cycled. [optional]
* - onoff:    Initial state:  0, 1, off, on
* - sdir:     Forced direction (optional): 0:auto, 1:up, 2:right, 3:down, 4:left
*             Can be preceded by "D", so D4.  If omitted, defaults to 0
* - x         x[offset] Work the same as regular light [optional]
* - y         y[offset] [optional]
* - day       Sets the event's light to only show during the day [optional]
* - night     Sets the event's light to only show during night time [optional]
* - id        1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*             Those should not begin with 'd', 'x' or 'y' otherwise
*             they will be mistaken for one of the previous optional parameters.
*
* Example note tags:
*
* <cl: light 250 #ffffff>
* Creates a basic light
*
* <cl: light 300 cycle #ff0000 15 #ffff00 15 #00ff00 15 #00ffff 15 #0000ff 15>
* Creates a cycling light that rotates every 15 frames.  Great for parties!
*
* <cl: fire 150 #ff8800 b15 night>
* Creates a fire that only lights up at night
*
* <cl: Flashlight l8 w12 #ff0000 on asdf>
* Creates a flashlight beam with id asdf which can be turned on or off via
* plugin commands
*
* --------------------------------------------------------------------------
* Easy hex color references
* --------------------------------------------------------------------------
* white - #FFFFFF
* blue - #0000FF
* red - #FF0000
* orange - #FFA500
* green - #008000
* cyan - #00FFFF
* yellow - #FFFF00
* purple - #800080
* pink - #FFC0CB
* black - #000000
* -------------------------------------------------------------------------------
* Migrating from Khas Ultra Lights
* -------------------------------------------------------------------------------
* Using the smooth lights options make it look extremely close.
* The default light radius that Khas appears to be around 122. Smooth lights
* need to be turned on to get similar effects. 
* 
* All [light_size] tags should be combined with the initial light radius tag.
*
* Eg. 
* Original: 
* [light cyan]
* [light size 75]
*
* Replacement: 
* <cl: light 75 #00FFFF>
*
* All [region_light] tags need to be replaced with <cl: region light> tags.
* Eg.
* Original:
* [region_light 5 red]
*
* Replacement:
* <cl: RegionLight 5 #FF0000 122>
* -------------------------------------------------------------------------------
* Maps
* -------------------------------------------------------------------------------
* DayNight [speed]
* Activates day/night cycle.  Put in map note or event note
* - speed     Optional parameter to alter the speed at which time passes.  10 is
*         the default speed, higher numbers are slower, lower numbers are
*         faster, and 0 stops the flow of time entirely.  If speed is not
*         specified, then the current speed is used.
* RegionLight id ON c r
* - Turns on lights for tile tag or region tag (id) using color (c) and radius (r)
* - Replace ON with OFF to turn them off
* - Put in map note
*
* RegionFire, RegionGlow
* - Same as above, but different lighting effects
*
* RegionBlock id ON color
* - Turns on light blocking for tile with region id (id) using color (color)
*
* RegionBlock id OFF
* - Turns off light blocking for tile with region id (id)
*
* defaultbrightness
* - Sets the default brightness of all the lights in the map
* Tint set c
* - Sets the current screen tint to the color (c)
* Tint daylight
* - Sets the tint based on the current hour.
* -------------------------------------------------------------------------------
* Plugin Commands
* -------------------------------------------------------------------------------
* Light deactivate|activate
* - Completely disables the lighting effects of this plugin
*
* Light on id
* - Turn on light with matching id number
*
* Light off id
* - Turn off light with matching id number
*
* Light color id c
* - Change the color (c) of lightsource with id (id)
* - Work even if the associated light is currently off.
* - Will be in effect until conditional lights are resetted
* - If c is set to 'defaultcolor' (without the quotes),
*      it will reset the light back to its initial color.
*
* Light switch reset
* - Reset all conditional lights.
*
* Light radius r c b
* - Change player light radius (r), color (c), and brightness (b)
*
* Light radiusgrow r c b t
* - Same as above, but apply changes over time.
*		The duration is either (t) frames or 500 frames if (t) isn't specified.
*
* Setfire r s
* - Alters fire settings with radius shift (r) and red/yellow color shift (s)
*
* Flashlight on bl bw c bd
* - turn on flashlight for player with beam length (bl), beam width (hw), color (c),
*      and beam density (bd)
*
* Flashlight off
* - Turn off the flashlight.  yup.
*
* Daynight speed n
* - Changes the speed by which hours pass ingame in relation to real life seconds
*
* Daynight hour h m
* - Sets the ingame time to hh:mm
*
* Daynight color h c
* - Sets the hour (h) to use color (c)
*
* Daynight add h m
* - Adds the specified hours (h) and minutes (m) to the ingame clock
*
* Daynight show
* - Shows the current time of day in the upper right corner of the map screen (h:mm)
*
* Daynight showseconds
* - Shows the current time of day in the upper right corner of the map screen (h:mm:ss)
*
* Daynight hide
* - Hides the current time of day mini-window
*
* Daynight hoursinday h
* - Sets the number of hours in a day to [h] (set hour colors  if doing this)
*
* Tint set c
* - Sets the current screen tint to the color (c)
*
* Tint fade c s
* - Same as above, but fades (1 = fast, 20 = very slow)
*
* Tint daylight
* - Sets the tint based on the current hour.
*
* TileLight   id ON c r
* RegionLight id ON c r
* - Turns on lights for tile tag or region tag (id) using color (c) and radius (r)
* - Replace ON with OFF to turn them off
*
* TileFire, TileGlow, RegionFire, RegionGlow
* - Same as above, but different lighting effects
*
* TileBlock id ON color
* - Turns on light blocking for tile with tiletag id (id) using color (color)
*
* TileBlock id OFF
* - Turns off light blocking for tile with tiletag id (id)
*
* RegionBlock id ON color
* - Turns on light blocking for tile with region id (id) using color (color)
*
* RegionBlock id OFF
* - Turns off light blocking for tile with region id (id)
*
* RegionBlock id ON color shape xoffset yoffset width height
* - id			id of region
* - color		color of block (usually #000000)
* - shape		1=square, 2=oval
* - xoffset	x offset
* - yoffset	y offset
* - width		width of shape
* - height		height of shape
*
* --------------------------------------------------------------------------
* Kill Switch and conditional lighting
* --------------------------------------------------------------------------
*
* If the 'Kill Switch Auto' parameter has been set to true, any event with
* a (non) active conditional light have their killswitch locked to ON(OFF).
* You can use this difference to give alternate appearances to these events.
* For example, a conditional light event can have a page where it shows a
* burning candle, and second page (active only when the kill switch is ON)
* who shows an unlit candle
*
* -------------------------------------------------------------------------------
* Plugin in battle
* -------------------------------------------------------------------------------
*
* If the plugin is active while a battle begin, the battle screen will
* be tinted like it was on the map. Too dark color will be automatically set
* to '#666666' (dark gray).
*
* If there is no map to take the tint from (ex: battle test),
* the screen will not be tinted.
*
* You can manually tint the battle screen with the following plugin commands.
* Note that these commands affect only the current battle,
* and will have no effect on the map.
*
* -------------------------------------------------------------------------------
* Plugin Commands - Battle
* -------------------------------------------------------------------------------
*
* TintBattle set [color]
* - Tint the battle screen to the color used as argument.
* - Automatically set too dark color to '#666666' (dark gray).
*
* TintBattle reset
* - Reset the battle screen to its original color.
*
* TintBattle fade [color] [speed]
* - Fade the battle screen to the color used as first argument.
* - The second argument is speed of the fade (1 very fast, 20 more slow)
* - Still automatically set too dark color to '#666666' (dark gray).
*
* --------------------------------------------------------------------------
* Lights Active Radius
* --------------------------------------------------------------------------
* This allows you to decide how far away from the player lights are active,
* anything beyond this range will not light up until the player gets
* closer to it.
* 
* It can be changed in the plugin parameters, or using the script call...
*
* $gameVariables.SetActiveRadius(#)
*
* ....where # is the max distance you want in tiles.
*/

(function ($$) {
  let Community_tint_speed = 60;
  let Community_tint_target = '#000000';
  let colorcycle_count = [1000];
  let colorcycle_timer = [1000];
  let eventObjId = [];
  let event_note = [];
  let event_id = [];
  let event_x = [];
  let event_y = [];
  let event_dir = [];
  let event_moving = [];
  let event_stacknumber = [];
  let event_eventcount = 0;
  let tile_lights = [];
  let tile_blocks = [];

  let parameters = $$.parameters;
  let lightMaskPadding = Number(parameters["Lightmask Padding"]) || 0;
  let useSmootherLights = eval(String(parameters['Use smoother lights'])) || false;
  let light_event_required = eval(parameters["Light event required"]) || false;
  let shift_lights_with_events = eval(String(parameters['Shift lights with events'])) || false;
  let player_radius = Number(parameters['Player radius']) || 0;
  let reset_each_map = eval(String(parameters['Reset Lights'])) || false;
  let noteTagKey = parameters["Note Tag Key"] !== "" ? parameters["Note Tag Key"] : false;
  let dayNightSaveHours = Number(parameters['Save DaynightHours']) || 0;
  let dayNightSaveMinutes = Number(parameters['Save DaynightMinutes']) || 0;
  let dayNightSaveSeconds = Number(parameters['Save DaynightSeconds']) || 0;
  let dayNightSaveNight = Number(parameters["Save Night Switch"]) || 0;
  let dayNightNoAutoshadow = eval(parameters["No Autoshadow During Night"]) || false;
  let hideAutoShadow = false;
  let brightnessOverTime = eval(parameters['Daynight Cycle']) || true;
  let dayNightList = (function (dayNight, nightHours) {
    let result = [];
    try {
      dayNight = JSON.parse(dayNight);
      nightHours = nightHours.split(",").map(x => x = +x);
      result = [];
      for (let i = 0; i < dayNight.length; i++)
        result[i] = { "color": dayNight[i], "isNight": nightHours.contains(i) };
    }
    catch (e) {
      console.log("CommunityLighting: Night Hours and/or DayNight Colors contain invalid JSON data - cannot parse.");
      result = new Array(24).fill(undefined).map(x => x = { "color": "#000000", "isNight": false });
    }
    return result;
  })(parameters["DayNight Colors"], parameters["Night Hours"]);
  let flashlightYoffset = Number(parameters['Flashlight offset']) || 0;
  let flashlightXoffset = Number(parameters['Flashlight X offset']) || 0;
  let killswitch = parameters['Kill Switch'] || 'None';
  if (killswitch !== 'A' && killswitch !== 'B' && killswitch !== 'C' && killswitch !== 'D') {
    killswitch = 'None'; //Set any invalid value to no switch
  }
  let killSwitchAuto = eval(String(parameters['Kill Switch Auto'])) || false;
  let optionText = parameters["Options Menu Entry"] || "";
  let lightInBattle = eval(String(parameters['Battle Tinting'])) || false;
  let battleMaskPosition = parameters['Light Mask Position'] || 'Above';
  if (battleMaskPosition !== 'Above' && battleMaskPosition !== 'Between') {
    battleMaskPosition = 'Above'; //Get rid of any invalid value
  }

  let options_lighting_on = true;
  let maxX = (Number(parameters['Screensize X']) || 816) + 2 * lightMaskPadding;
  let maxY = Number(parameters['Screensize Y']) || 624;
  let tint_oldseconds = 0;
  let tint_timer = 0;
  let oldseconds = 0;
  let event_reload_counter = 0;
  let Community_tint_speed_old = 60;
  let Community_tint_target_old = '#000000';
  let tileglow = 0;
  let glow_oldseconds = 0;
  let glow_dir = 1;
  let cyclecolor_counter = 0;
  //let darkcount = 0;
  //let daynightset = false;
  //let averagetime = [];
  //let averagetimecount = 0;
  let notetag_reg = RegExp("<" + noteTagKey + ":[ ]*([^>]+)>", "i");
  let radialColor2 = useSmootherLights == true ? "#00000000" : "#000000";
  let isValidColorRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^#[0-9A-F]{8}$)/i;
  $$.getFirstComment = function () {
    let result = null;
    let page = this.page();
    if (page && page.list[0] != null) {
      if (page.list[0].code === 108) {
        result = page.list[0].parameters[0] || "";
        let line = 1;
        while (page.list[line].code === 408) {
          result += "\n" + (page.list[line].parameters[0] || "");
          line++;
        }
      }
    }
    return result;
  };

  /**
   * 
   * @param {String} note 
   * @returns {String}
   */
  $$.getCLTag = function (note) {
    let result = false;
    note = String(note);
    if (noteTagKey) {
      result = note.match(notetag_reg);
      result = result ? result[1].trim() : "";
    }
    else result = note.trim();
    return result;
  };
  Game_Event.prototype.getCLTag = function () {
    let result;
    let pageNote = noteTagKey ? $$.getFirstComment.call(this) : null;
    let note = this.event().note;
    if (pageNote) result = $$.getCLTag(pageNote);
    if (!result) result = $$.getCLTag(note);
    return result || "";
  };
  $$.validateColor = function (color, defaultColor = "#ffffff") {
    let isValid = /^#(?:[A-Fa-f0-9]{3}){1,2}$/.test(color);
    if (!isValid) console.log("Community_Lighting_MZ - Invalid Color: " + color);
    let result = isValid ? color : defaultColor;
    return result.length < 7 ? result[0] + result[1] + result[1] + result[2] + result[2] + result[3] + result[3] : result;
  };
  $$.getDayNightList = function () {
    return dayNightList;
  };
  $$.saveTime = function (hh, mm, ss = null) {
    let dayNightList = $gameVariables.GetDaynightColorArray();
    if (dayNightSaveHours > 0) $gameVariables.setValue(dayNightSaveHours, hh);
    if (dayNightSaveMinutes > 0) $gameVariables.setValue(dayNightSaveMinutes, mm);
    if (dayNightSaveSeconds > 0 && ss !== null) $gameVariables.setValue(dayNightSaveSeconds, ss);
    if (dayNightSaveNight > 0 && dayNightList[hh] instanceof Object) $gameSwitches.setValue(dayNightSaveNight, dayNightList[hh].isNight);
    if (dayNightNoAutoshadow && dayNightList[hh] instanceof Object && dayNightList[hh].isNight !== hideAutoShadow) {
      hideAutoShadow = dayNightList[hh].isNight; // We can not use $$.isNight because DaynightCycle hasn't been updated yet!
      // Update the shadow manually
      if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._tilemap) {
        SceneManager._scene._spriteset._tilemap.refresh();
      }
    }
  };
  $$.isNight = function () {
    let hour = $gameVariables.GetDaynightCycle();
    return dayNightList[hour] instanceof Object ? dayNightList[hour].isNight : false;
  };
  $$.hours = function () {
    return $gameVariables.GetDaynightCycle();
  };
  $$.minutes = function () {
    return Math.floor($gameVariables.GetDaynightTimer() / $gameVariables.GetDaynightSpeed());
  };
  $$.seconds = function () {
    let speed = $gameVariables.GetDaynightSpeed();
    let value = Math.floor($gameVariables.GetDaynightTimer() - speed * $$.minutes());
    return Math.floor(value / speed * 60);
  };
  $$.time = function (showSeconds) {
    let result = $$.hours() + ":" + $$.minutes().padZero(2);
    if (showSeconds) result = result + ":" + $$.seconds().padZero(2);
    return result;
  };
  // Event note tag caching
  Game_Event.prototype.resetLightData = function () {
    this._clType = undefined;
    this._lastLightPage = undefined;
    this._clRadius = undefined;
    this._clColor = undefined;
    this._clCycle = undefined;
    this._clBrightness = undefined;
    this._clSwitch = undefined;
    this._clDirection = undefined;
    this._clXOffset = undefined;
    this._clYOffset = undefined;
    this._clId = undefined;
    this._clBeamColor = undefined;
    this._clBeamLength = undefined;
    this._clBeamWidth = undefined;
    this._clFlashlightDirection = undefined;
    this._clOnOff = undefined;
    this._clCycleTimer = undefined;
    this._clCycleIndex = undefined;
    this.initLightData();
  };
  Game_Event.prototype.initLightData = function () {
    this._lastLightPage = this._pageIndex;
    let tagData = this.getCLTag().toLowerCase().split(/\s+/);
    let needsCycleDuration = false;
    this._clType = tagData.shift();
    if (this._clType === "light" || this._clType === "fire") {
      this._clRadius = undefined;
      for (let x of tagData) {
        if (!isNaN(+x) && this._clRadius === undefined) this._clRadius = +x;
        else if (x === "cycle" && this._clColor === undefined) this._clCycle = [];
        else if (this._clCycle && !needsCycleDuration && x[0] === "#") {
          this._clCycle.push({ "color": $$.validateColor(x), "duration": 1 });
          needsCycleDuration = true;
        }
        else if (this._clCycle && needsCycleDuration && !isNaN(+x)) {
          this._clCycle[this._clCycle.length - 1].duration = +x || 1;
          needsCycleDuration = false;
        }
        else if (x[0] === "#" && this._clColor === undefined) this._clColor = $$.validateColor(x);
        else if (x[0] === "b" && this._clBrightness === undefined) {
          this._clBrightness = Number(+(x.substr(1, x.length)) / 100).clamp(0, 1);
        }
        else if ((x === "night" || x === "day") && this._clSwitch === undefined) this._clSwitch = x;
        else if (x[0] === "d" && this._clDirection === undefined) this._clDirection = +(x.substr(1, x.length));
        else if (x[0] === "x" && this._clXOffset === undefined) this._clXOffset = +(x.substr(1, x.length));
        else if (x[0] === "y" && this._clYOffset === undefined) this._clYOffset = +(x.substr(1, x.length));
        else if (x.length > 0 && this._clId === undefined) this._clId = x;
      }
    }
    else if (this._clType === "flashlight") {
      this._clBeamLength = undefined;
      this._clBeamWidth = undefined;
      this._clOnOff = undefined;
      this._clFlashlightDirection = undefined;
      this._clRadius = 1;
      for (let x of tagData) {
        if (!isNaN(+x) && this._clBeamLength === undefined) this._clBeamLength = +x;
        else if (!isNaN(+x) && this._clBeamWidth === undefined) this._clBeamWidth = +x;
        else if (x[0] === "l" && this._clBeamLength === undefined) this._clBeamLength = this._clBeamLength = +(x.substr(1, x.length));
        else if (x[0] === "w" && this._clBeamWidth === undefined) this._clBeamWidth = this._clBeamWidth = +(x.substr(1, x.length));
        else if (x === "cycle" && this._clColor === undefined) this._clCycle = [];
        else if (this._clCycle && !needsCycleDuration && x[0] === "#") {
          this._clCycle.push({ "color": $$.validateColor(x), "duration": 1 });
          needsCycleDuration = true;
        }
        else if (this._clCycle && needsCycleDuration && !isNaN(+x)) {
          this._clCycle[this._clCycle.length - 1].duration = +x || 1;
          needsCycleDuration = false;
        }
        else if (x[0] === "#" && this._clBeamColor === undefined) this._clColor = $$.validateColor(x);
        else if (!isNaN(+x) && this._clOnOff === undefined) this._clOnOff = +x;
        else if (!isNaN(+x) && this._clFlashlightDirection === undefined) this._clFlashlightDirection = +x;
        else if (x === "on" && this._clOnOff === undefined) this._clOnOff = 1;
        else if (x === "off" && this._clOnOff === undefined) this._clOnOff = 0;
        else if ((x === "night" || x === "day") && this._clSwitch === undefined) this._clSwitch = x;
        else if (x[0] === "d" && this._clFlashlightDirection === undefined) this._clFlashlightDirection = +(x.substr(1, x.length));
        else if (x[0] === "x" && this._clXOffset === undefined) this._clXOffset = +(x.substr(1, x.length));
        else if (x[0] === "y" && this._clYOffset === undefined) this._clYOffset = +(x.substr(1, x.length));
        else if (x.length > 0 && this._clId === undefined) this._clId = x;
      }
    }
    this._clRadius = this._clRadius || 0;
    this._clColor = this._clColor || "#000000";
    this._clBrightness = this._clBrightness || 0;
    this._clDirection = this._clDirection || 0;
    this._clId = this._clId || 0;
    this._clBeamWidth = this._clBeamWidth || 0;
    this._clBeamLength = this._clBeamLength || 0;
    this._clOnOff = this._clOnOff || 0;
    this._clFlashlightDirection = this._clFlashlightDirection || 0;
    this._clXOffset = this._clXOffset || 0;
    this._clYOffset = this._clYOffset || 0;
    this._clCycle = this._clCycle || null;
    this._clCycleTimer = 0;
    this._clCycleIndex = 0;
  };
  Game_Event.prototype.getLightType = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clType;
  };
  Game_Event.prototype.getLightRadius = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clRadius;
  };
  Game_Event.prototype.getLightColor = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clColor;
  };
  Game_Event.prototype.getLightBrightness = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clBrightness;
  };
  Game_Event.prototype.getLightDirection = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clDirection;
  };
  Game_Event.prototype.getLightId = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clId;
  };
  Game_Event.prototype.getLightFlashlightLength = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clBeamLength;
  };
  Game_Event.prototype.getLightFlashlightWidth = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clBeamWidth;
  };
  Game_Event.prototype.getLightFlashlightDirection = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clFlashlightDirection;
  };
  Game_Event.prototype.getLightXOffset = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clXOffset;
  };
  Game_Event.prototype.getLightYOffset = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clYOffset;
  };
  Game_Event.prototype.getLightEnabled = function () {
    let type = this.getLightType();
    let result = false;
    if (this._clSwitch === undefined) {
      if (type === "flashlight" && this._clOnOff === 1) result = true;
      else result = true;
    }
    else (result = this._clSwitch === "night" && $$.isNight())
      || (result = this._clSwitch === "day" && !$$.isNight())
    return result;
  };
  Game_Event.prototype.getLightCycle = function () {
    if (this._clType === undefined) this.initLightData();
    return this._clCycle;
  };
  Game_Event.prototype.incrementLightCycle = function () {
    if (this._clCycle) {
      this._clCycleTimer--;
      if (this._clCycleTimer < 1) {
        let cycleList = this.getLightCycle();
        this._clCycleIndex++;
        if (this._clCycleIndex >= cycleList.length) this._clCycleIndex = 0;
        this._clColor = cycleList[this._clCycleIndex].color;
        this._clCycleTimer = cycleList[this._clCycleIndex].duration;
      }
    }
  };
  let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (typeof command != 'undefined') {
      this.communityLighting_Commands(command, args);
    }
  };

  let _Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;

  Game_Player.prototype.clearTransferInfo = function () {
    _Game_Player_clearTransferInfo.call(this);
    if (reset_each_map) {
      $gameVariables.SetLightArrayId([]);
      $gameVariables.SetLightArrayState([]);
      $gameVariables.SetLightArrayColor([]);
      $$.defaultBrightness = 0;
      $$.mapBrightness = undefined;
      $gameVariables.SetTint(null);
    }
  };
  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.communityLighting_Commands = function (command, args) {
    command = command.toLowerCase();

    const allCommands = {
      tileblock: 'tileType', regionblock: 'tileType', tilelight: 'tileType', regionlight: 'tileType', tilefire: 'tileType', regionfire: 'tileType',
      tileglow: 'tileType', regionglow: 'tileType', tint: 'tint', daynight: 'dayNight', flashlight: 'flashLight', setfire: 'setFire', fire: 'fire', light: 'light',
      script: 'scriptF', reload: 'reload', tintbattle: 'tintbattle'
    };
    const result = allCommands[command];
    if (result) {
      this[result](command, args);
    }
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.tileType = function (command, args) {
    const cmdArr = ['', 'tileblock', 'regionblock', 'tilelight', 'regionlight', 'tilefire', 'regionfire', 'tileglow', 'regionglow'];
    const tiletype = cmdArr.indexOf(command);
    if (tiletype > 0) {
      $$.tile(tiletype, args);
    }
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.tint = function (command, args) {
    $$.tint(args);
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.dayNight = function (command, args) {
    $$.DayNight(args);
  };

  /**
     *
     * @param {String} command
     * @param {String[]} args
     */
  Game_Interpreter.prototype.flashLight = function (command, args) {
    $$.flashlight(args);
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.setFire = function (command, args) {
    flickerradiusshift = args[0];
    flickercolorshift = args[1];
    $gameVariables.SetFireRadius(flickerradiusshift);
    $gameVariables.SetFireColorshift(flickercolorshift);
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.fire = function (command, args) {
    if (args.contains("radius") || args.contains("radiusgrow")) $gameVariables.SetFire(true);
    if (args[0] === "deactivate" || (args[0].toLowerCase() === "off" && args.length == 1)) {
      $gameVariables.SetScriptActive(false);
    } else {
      $gameVariables.SetScriptActive(true);
    }
    $$.fireLight(args);
  };

  /**
   * 
   * @param {String} command 
   * @param {String[]} args 
   */
  Game_Interpreter.prototype.light = function (command, args) {
    if (args.contains("radius") || args.contains("radiusgrow")) $gameVariables.SetFire(false);
    if (args[0].toLowerCase() === "deactivate" || (args[0].toLowerCase() === "off" && args.length == 1)) {
      $gameVariables.SetScriptActive(false);
    } else {
      $gameVariables.SetScriptActive(true);
    }
    $$.fireLight(args);
  };

  Game_Interpreter.prototype.scriptF = function (command, args) {
    if (args[0] === "deactivate" || (args[0].toLowerCase() === "off" && args.length == 1)) {
      $gameVariables.SetScriptActive(true);
    } else if (args[0] === "activate") {
      $gameVariables.SetScriptActive(false);
    }
  };

  /**
   * 
   * @param {String} command 
   * @param {String[]} args 
   */
  Game_Interpreter.prototype.reload = function (command, args) {
    if (args[0] === "events") {
      $$.ReloadMapEvents();
    }
  };

  Game_Interpreter.prototype.tintbattle = function (command, args) {
    if ($gameParty.inBattle()) {

      if (args[0].toLowerCase() === 'reset') {
        $gameTemp._BattleTint = $gameTemp._MapTint;
        $gameTemp._BattleTintSpeed = 0;
      } else if (args[0] === "set") {
        $gameTemp._BattleTint = this.determineBattleTint(args[1]);
        $gameTemp._BattleTintSpeed = 0;

      } else if (args[0].toLowerCase() === 'fade') {

        $gameTemp._BattleTintFade = $gameTemp._BattleTint;
        $gameTemp._BattleTintTimer = 0;
        $gameTemp._BattleTint = this.determineBattleTint(args[1]);
        $gameTemp._BattleTintSpeed = args[2];
      }
    }
  };

  Game_Interpreter.prototype.determineBattleTint = function (tintColor) {
    if (!tintColor || tintColor.length < 7) {
      return '#666666' // Not an hex color string
    }
    var redhex = tintColor.substring(1, 3);
    var greenhex = tintColor.substring(3, 5);
    var bluehex = tintColor.substring(5);
    var red = parseInt(redhex, 16);
    var green = parseInt(greenhex, 16);
    var blue = parseInt(bluehex, 16);
    var color = red + green + blue;
    if (color < 300 && red < 100 && green < 100 && blue < 100) { // Check for NaN values or too dark colors
      return '#666666' // The player have to see something
    }
    return tintColor;
  }

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

  //Updates the Lightmask for each frame.

  Lightmask.prototype.update = function () {
    this._updateMask();
  };

  //@method _createBitmaps

  Lightmask.prototype._createBitmap = function () {
    this._maskBitmap = new Bitmap(maxX + lightMaskPadding, maxY);   // one big bitmap to fill the intire screen with black
    let canvas = this._maskBitmap.canvas;             // a bit larger then setting to take care of screenshakes
  };

  let _Game_Map_prototype_setupEvents = Game_Map.prototype.setupEvents;

  Game_Map.prototype.setupEvents = function () {
    _Game_Map_prototype_setupEvents.call(this);
    $$.ReloadMapEvents();
  }

  /**
   * @method _updateAllSprites
   * @private
   */
  Lightmask.prototype._updateMask = function () {
    // ****** DETECT MAP CHANGES ********
    let map_id = $gameMap.mapId();
    if (map_id != $gameVariables.GetOldMapId()) {
      $gameVariables.SetOldMapId(map_id);

      // recalc tile and region tags.
      $$.ReloadTagArea();

      //clear color cycle arrays
      for (let i = 0; i < 1000; i++) {
        colorcycle_count[i] = 0;
        colorcycle_timer[i] = 0;
      }

      $$.ReloadMapEvents();  // reload map events on map chance
    }

    // reload mapevents if event_data has chanced (deleted or spawned events/saves)
    if (event_eventcount != $gameMap.events().length) {
      $$.ReloadMapEvents();
    }

    // remove old sprites
    for (let i = 0, len = this._sprites.length; i < len; i++) {	  // remove all old sprites
      this._removeSprite();
    }

    if (map_id <= 0) return;								// No lighting on map 0
    if (options_lighting_on !== true) return;				// Plugin deactivated in the option
    if ($gameVariables.GetScriptActive() !== true) return;	// Plugin deactivated by plugin command


    // reload map events every 200 cycles just in case or when a refresh is requested
    event_reload_counter++;
    if (event_reload_counter > 200) {
      event_reload_counter = 0;
      $$.ReloadMapEvents()
    }

    if (light_event_required && eventObjId.length <= 0) return; // If no lightsources on this map, no lighting if light_event_required set to true.

    this._addSprite(-lightMaskPadding, 0, this._maskBitmap);

    // ******** GROW OR SHRINK GLOBE PLAYER *********
    let firstrun = $gameVariables.GetFirstRun();
    if (firstrun === true) {
      Community_tint_speed = 60;
      Community_tint_target = '#000000';
      Community_tint_speed_old = 60;
      Community_tint_target_old = '#000000';
      $gameVariables.SetFirstRun(false);
      player_radius = Number(parameters['Player radius']);
      $gameVariables.SetRadius(player_radius);
    } else {
      player_radius = $gameVariables.GetRadius();
    }
    let lightgrow_value = player_radius;
    let lightgrow_target = $gameVariables.GetRadiusTarget();
    let lightgrow_speed = $gameVariables.GetRadiusSpeed();

    if (lightgrow_value < lightgrow_target) {
      lightgrow_value = lightgrow_value + lightgrow_speed;
      if (lightgrow_value > lightgrow_target) {
        //other wise it can keep fliping back and forth between > and <
        lightgrow_value = lightgrow_target;
      }
      player_radius = lightgrow_value;
    }
    if (lightgrow_value > lightgrow_target) {
      lightgrow_value = lightgrow_value - lightgrow_speed;
      if (lightgrow_value < lightgrow_target) {
        //other wise it can keep fliping back and forth between > and <
        lightgrow_value = lightgrow_target;
      }
      player_radius = lightgrow_value;
    }

    $gameVariables.SetRadius(player_radius);

    // ****** PLAYER LIGHTGLOBE ********

    let canvas = this._maskBitmap.canvas;
    let ctx = canvas.getContext("2d");
    this._maskBitmap.fillRect(0, 0, maxX + lightMaskPadding, maxY, '#000000');

    ctx.globalCompositeOperation = 'lighter';
    let pw = $gameMap.tileWidth();
    let ph = $gameMap.tileHeight();
    let dx = $gameMap.displayX();
    let dy = $gameMap.displayY();
    let px = $gamePlayer._realX;
    let py = $gamePlayer._realY;
    let pd = $gamePlayer._direction;
    let x1 = (pw / 2) + ((px - dx) * pw);
    let y1 = (ph / 2) + ((py - dy) * ph);
    let paralax = false;
    // paralax does something weird with coordinates.. recalc needed
    if (dx > $gamePlayer.x) {
      let xjump = $gameMap.width() - Math.floor(dx - px);
      x1 = (pw / 2) + (xjump * pw);
    }
    if (dy > $gamePlayer.y) {
      let yjump = $gameMap.height() - Math.floor(dy - py);
      y1 = (ph / 2) + (yjump * ph);
    }

    let playerflashlight = $gameVariables.GetFlashlight();
    let playercolor = $gameVariables.GetPlayerColor();
    let flashlightlength = $gameVariables.GetFlashlightLength();
    let flashlightwidth = $gameVariables.GetFlashlightWidth();
    let playerflicker = $gameVariables.GetFire();
    let playerbrightness = $gameVariables.GetPlayerBrightness();


    let iplayer_radius = Math.floor(player_radius);

    if (iplayer_radius > 0) {
      if (playerflashlight == true) {
        this._maskBitmap.radialgradientFillRect2(x1, y1, lightMaskPadding, iplayer_radius, playercolor, radialColor2, pd, flashlightlength, flashlightwidth);
      }
      x1 = x1 - flashlightXoffset;
      y1 = y1 - flashlightYoffset;
      if (iplayer_radius < 100) {
        // dim the light a bit at lower lightradius for a less focused effect.
        let red = hexToRgb(playercolor).r;
        let green = hexToRgb(playercolor).g;
        let blue = hexToRgb(playercolor).b;
        let alpha = hexToRgb(playercolor).a;
        green = green - 50;
        red = red - 50;
        blue = blue - 50;
        if (green < 0) {
          green = 0;
        }
        if (red < 0) {
          red = 0;
        }
        if (blue < 0) {
          blue = 0;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        let newcolor = rgba2hex(red, green, blue, alpha);

        this._maskBitmap.radialgradientFillRect(x1, y1, 0, iplayer_radius, newcolor, radialColor2, playerflicker, playerbrightness);
      } else {
        this._maskBitmap.radialgradientFillRect(x1, y1, lightMaskPadding, iplayer_radius, playercolor, radialColor2, playerflicker, playerbrightness);
      }

    }


    // *********************************** DAY NIGHT CYCLE TIMER **************************

    let daynightspeed = $gameVariables.GetDaynightSpeed();

    if (daynightspeed > 0 && daynightspeed < 5000 && brightnessOverTime) {

      let datenow = new Date();
      let seconds = Math.floor(datenow.getTime() / 10);
      if (seconds > oldseconds) {

        let daynighttimer = $gameVariables.GetDaynightTimer();     // timer = minutes * speed
        let daynightcycle = $gameVariables.GetDaynightCycle();     // cycle = hours
        let daynighthoursinday = $gameVariables.GetDaynightHoursinDay();   // 24

        oldseconds = seconds;
        daynighttimer = daynighttimer + 1;
        let daynightminutes = Math.floor(daynighttimer / daynightspeed);
        let daynighttimeover = daynighttimer - (daynightspeed * daynightminutes);
        let daynightseconds = Math.floor(daynighttimeover / daynightspeed * 60);

        if (daynighttimer >= (daynightspeed * 60)) {
          daynightcycle = daynightcycle + 1;
          if (daynightcycle >= daynighthoursinday) daynightcycle = 0;
          daynighttimer = 0;
        }
        $$.saveTime(daynightcycle, daynightminutes, daynightseconds);
        $gameVariables.SetDaynightTimer(daynighttimer);     // timer = minutes * speed
        $gameVariables.SetDaynightCycle(daynightcycle);     // cycle = hours
      }
    }

    // ********** OTHER LIGHTSOURCES **************



    for (let i = 0, len = eventObjId.length; i < len; i++) {
      let evid = event_id[i];
      let cur = $gameMap.events()[eventObjId[i]];
      if (cur._lastLightPage !== cur._pageIndex) cur.resetLightData();

      let lightsOnRadius = $gameVariables.GetActiveRadius();
      if (lightsOnRadius > 0) {
        let distanceApart = Math.round(Community.Lighting.distance($gamePlayer.x, $gamePlayer.y, cur._realX, cur._realY));
        if (distanceApart > lightsOnRadius) {
          continue;
        }
      }

      let lightType = cur.getLightType();
      if (lightType === "light" || lightType === "fire" || lightType === "flashlight") {
        let objectflicker = lightType === "fire";
        let light_radius = cur.getLightRadius();
        let flashlength = cur.getLightFlashlightLength();
        let flashwidth = cur.getLightFlashlightWidth();
        let xoffset = cur.getLightXOffset() * $gameMap.tileWidth();
        let yoffset = cur.getLightYOffset() * $gameMap.tileHeight();
        if (light_radius >= 0) {

          // light color
          let colorvalue = cur.getLightColor();

          // Cycle colors
          cur.incrementLightCycle();

          // brightness and direction

          let brightness = cur.getLightBrightness();
          let direction = cur.getLightDirection();
          // conditional lighting
          let lightid = cur.getLightId();
          let state = cur.getLightEnabled();
          if (lightid) {
            state = false;
            let lightarray_id = $gameVariables.GetLightArrayId();
            let lightarray_state = $gameVariables.GetLightArrayState();
            let lightarray_color = $gameVariables.GetLightArrayColor();

            for (let j = 0, jlen = lightarray_id.length; j < jlen; j++) {
              if (lightarray_id[j] == lightid) {
                // idfound = true;
                state = lightarray_state[j];
                let newcolor = lightarray_color[j];
                if (newcolor != 'defaultcolor') {
                  colorvalue = newcolor;
                }
              }
            }

            // Set kill switch to ON if the conditional light is deactivated,
            // or to OFF if it is active.
            if (killSwitchAuto && killswitch !== 'None') {
              key = [map_id, evid, killswitch];
              if ($gameSelfSwitches.value(key) === state) $gameSelfSwitches.setValue(key, !state);
            }
          }

          // kill switch
          if (killswitch !== 'None' && state) {
            key = [map_id, evid, killswitch];
            if ($gameSelfSwitches.value(key) === true) state = false;
          }

          // show light
          if (state === true) {
            let lx1 = $gameMap.events()[event_stacknumber[i]].screenX();
            let ly1 = $gameMap.events()[event_stacknumber[i]].screenY() - 24;
            if (!shift_lights_with_events) {
              ly1 += $gameMap.events()[event_stacknumber[i]].shiftY();
            }

            // apply offsets
            lx1 += +xoffset;
            ly1 += +yoffset;

            if (lightType === "flashlight") { // flashlight
              let ldir = 0;
              if (event_moving[i] > 0) {
                ldir = $gameMap.events()[event_stacknumber[i]]._direction;
              } else {
                ldir = event_dir[i];
              }

              let tldir = cur.getLightFlashlightDirection();
              if (!isNaN(tldir)) {
                switch (tldir) {
                  case 1:
                    ldir = 8;
                    break;
                  case 2:
                    ldir = 6;
                    break;
                  case 3:
                    ldir = 2;
                    break;
                  case 4:
                    ldir = 4;
                    break;
                  default:
                    break;
                }
              }
              this._maskBitmap.radialgradientFillRect2(lx1, ly1, 0, light_radius, colorvalue, '#000000', ldir, flashlength, flashwidth);
            } else { // regular light
              this._maskBitmap.radialgradientFillRect(lx1, ly1, 0, light_radius, colorvalue, '#000000', objectflicker, brightness, direction);
            }
          }
        }
      }
    }


    // *************************** TILE TAG *********************
    //glow/colorfade
    let glowdatenow = new Date();
    let glowseconds = Math.floor(glowdatenow.getTime() / 100);

    if (glowseconds > glow_oldseconds) {
      glow_oldseconds = glowseconds;
      tileglow = tileglow + glow_dir;

      if (tileglow > 120) {
        glow_dir = -1;
      }
      if (tileglow < 1) {
        glow_dir = 1;
      }
    }

    tile_lights = $gameVariables.GetLightTags();
    tile_blocks = $gameVariables.GetBlockTags();

    // Tile lights
    for (let i = 0, len = tile_lights.length; i < len; i++) {
      let tilestr = tile_lights[i];

      let tileargs = tilestr.split(";");
      let x = tileargs[0];
      let y = tileargs[1];
      let tile_type = tileargs[2];
      let tile_radius = tileargs[3];
      let tile_color = tileargs[4];
      let brightness = tileargs[5];

      let x1 = (pw / 2) + (x - dx) * pw;
      let y1 = (ph / 2) + (y - dy) * ph;

      if ($dataMap.scrollType === 2 || $dataMap.scrollType === 3) {
        if (dx - 5 > x) {
          let lxjump = $gameMap.width() - (dx - x);
          x1 = (pw / 2) + (lxjump * pw);
        }
      }
      if ($dataMap.scrollType === 1 || $dataMap.scrollType === 3) {
        if (dy - 5 > y) {
          let lyjump = $gameMap.height() - (dy - y);
          y1 = (ph / 2) + (lyjump * ph);
        }
      }

      if (tile_type == 3 || tile_type == 4) {
        this._maskBitmap.radialgradientFillRect(x1, y1, 0, tile_radius, tile_color, radialColor2, false, brightness); // Light
      } else if (tile_type == 5 || tile_type == 6) {
        this._maskBitmap.radialgradientFillRect(x1, y1, 0, tile_radius, tile_color, radialColor2, true, brightness);  // Fire

      } else {

        let r = hexToRgb(tile_color).r;
        let g = hexToRgb(tile_color).g;
        let b = hexToRgb(tile_color).b;
        let a = hexToRgb(tile_color).a;

        r = Math.floor(r + (60 - tileglow));
        g = Math.floor(g + (60 - tileglow));
        b = Math.floor(b + (60 - tileglow));
        a = Math.floor(a + (60 - tileglow));

        if (r < 0) {
          r = 0;
        }
        if (g < 0) {
          g = 0;
        }
        if (b < 0) {
          b = 0;
        }
        if (a < 0) {
          a = 0;
        }
        if (r > 255) {
          r = 255;
        }
        if (g > 255) {
          g = 255;
        }
        if (b > 255) {
          b = 255;
        }
        if (a > 255) {
          a = 255;
        }
        let newtile_color = rgba2hex(r, g, b, a)
        this._maskBitmap.radialgradientFillRect(x1, y1, 0, tile_radius, newtile_color, radialColor2, false, brightness);
      }
    }

    // Tile blocks
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0, len = tile_blocks.length; i < len; i++) {
      let tilestr = tile_blocks[i];
      let tileargs = tilestr.split(";");

      let x = tileargs[0];
      let y = tileargs[1];
      let shape = tileargs[2];
      let xo1 = tileargs[3];
      let yo1 = tileargs[4];
      let xo2 = tileargs[5];
      let yo2 = tileargs[6];
      let tile_color = tileargs[7];


      let x1 = (x - dx) * pw;
      let y1 = (y - dy) * ph;

      if ($dataMap.scrollType === 2 || $dataMap.scrollType === 3) {
        if (dx - 5 > x) {
          let lxjump = $gameMap.width() - (dx - x);
          x1 = (lxjump * pw);
        }
      }
      if ($dataMap.scrollType === 1 || $dataMap.scrollType === 3) {
        if (dy - 5 > y) {
          let lyjump = $gameMap.height() - (dy - y);
          y1 = (lyjump * ph);
        }
      }
      if (shape == 0) {
        this._maskBitmap.FillRect(x1, y1, pw, ph, tile_color);
      }
      if (shape == 1) {
        x1 = x1 + Number(xo1);
        y1 = y1 + Number(yo1);
        this._maskBitmap.FillRect(x1, y1, Number(xo2), Number(yo2), tile_color);
      }
      if (shape == 2) {
        x1 = x1 + Number(xo1);
        y1 = y1 + Number(yo1);
        this._maskBitmap.FillCircle(x1, y1, Number(xo2), Number(yo2), tile_color);
      }
    }
    ctx.globalCompositeOperation = 'lighter';


    // *********************************** DAY NIGHT CYCLE FILTER **************************
    if ($$.daynightset) {

      let daynighttimer = $gameVariables.GetDaynightTimer();     // timer = minutes * speed
      let daynightcycle = $gameVariables.GetDaynightCycle();     // cycle = hours
      let daynighthoursinday = $gameVariables.GetDaynightHoursinDay();   // 24
      let daynightcolors = $gameVariables.GetDaynightColorArray();
      let r, g, b;
      let color1 = daynightcolors[daynightcycle].color;

      if (daynightspeed > 0) {
        let nextcolor = daynightcycle + 1;
        if (nextcolor >= daynighthoursinday) {
          nextcolor = 0;
        }
        let color2 = daynightcolors[nextcolor].color;
        let rgb = hexToRgb(color1);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
        a = rgb.a;

        rgb = hexToRgb(color2);
        let r2 = rgb.r;
        let g2 = rgb.g;
        let b2 = rgb.b;
        let a2 = rgb.a;

        let stepR = (r2 - r) / (60 * daynightspeed);
        let stepG = (g2 - g) / (60 * daynightspeed);
        let stepB = (b2 - b) / (60 * daynightspeed);
        let stepA = (a2 - a) / (60 * daynightspeed);

        r = Math.floor(r + (stepR * daynighttimer));
        g = Math.floor(g + (stepG * daynighttimer));
        b = Math.floor(b + (stepB * daynighttimer));
        a = Math.floor(a + (stepA * daynighttimer));
      }
      color1 = rgba2hex(r, g, b, a);

      this._maskBitmap.FillRect(-lightMaskPadding, 0, maxX + lightMaskPadding, maxY, color1);
    }
    // *********************************** TINT **************************
    else {
      let tint_value = $gameVariables.GetTint();
      let tint_target = $gameVariables.GetTintTarget();
      let tint_speed = $gameVariables.GetTintSpeed();


      if (Community_tint_target != Community_tint_target_old) {
        Community_tint_target_old = Community_tint_target;
        tint_target = Community_tint_target;
        $gameVariables.SetTintTarget(tint_target);
      }
      if (Community_tint_speed != Community_tint_speed_old) {
        Community_tint_speed_old = Community_tint_speed;
        tint_speed = Community_tint_speed;
        $gameVariables.SetTintSpeed(tint_speed);
      }
      let tcolor = tint_value;
      if (tint_value != tint_target) {

        let tintdatenow = new Date();
        let tintseconds = Math.floor(tintdatenow.getTime() / 10);
        if (tintseconds > tint_oldseconds) {
          tint_oldseconds = tintseconds;
          tint_timer++;
        }

        let r = hexToRgb(tint_value).r;
        let g = hexToRgb(tint_value).g;
        let b = hexToRgb(tint_value).b;
        let a = hexToRgb(tint_value).a;

        let r2 = hexToRgb(tint_target).r;
        let g2 = hexToRgb(tint_target).g;
        let b2 = hexToRgb(tint_target).b;
        let a2 = hexToRgb(tint_target).a;

        let stepR = (r2 - r) / (60 * tint_speed);
        let stepG = (g2 - g) / (60 * tint_speed);
        let stepB = (b2 - b) / (60 * tint_speed);
        let stepA = (a2 - a) / (60 * tint_speed);

        let r3 = Math.floor(r + (stepR * tint_timer));
        let g3 = Math.floor(g + (stepG * tint_timer));
        let b3 = Math.floor(b + (stepB * tint_timer));
        let a3 = Math.floor(a + (stepA * tint_timer));
        if (r3 < 0) {
          r3 = 0
        }
        if (g3 < 0) {
          g3 = 0
        }
        if (b3 < 0) {
          b3 = 0
        }
        if (a3 < 0) {
          a3 = 0;
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
        if (a3 > 255) {
          a3 = 255;
        }
        let reddone = false;
        let greendone = false;
        let bluedone = false;
        let alphadone = false;

        //Greater than


        if (stepR >= 0 && r3 >= r2) {
          reddone = true;
        }
        if (stepG >= 0 && g3 >= g2) {
          greendone = true;
        }
        if (stepB >= 0 && b3 >= b2) {
          greendone = true;
        }
        if (stepA >= 0 && a3 >= a2) {
          alphadone = true;
        }


        // Less than   

        if (stepR <= 0 && r3 <= r2) {
          bluedone = true;
        }
        if (stepG <= 0 && g3 <= g2) {
          greendone = true;
        }
        if (stepB <= 0 && b3 <= b2) {
          bluedone = true;
        }
        if (stepA <= 0 && a3 <= a2) {
          alphadone = true;
        }

        if (reddone == true && bluedone == true && greendone == true && alphadone == true) {
          $gameVariables.SetTint(tint_target);
        }

        let hex = rgba2hex(r3, g3, b3, a3);
        tcolor = hex;
      } else {
        tint_timer = 0;
      }
      this._maskBitmap.FillRect(-lightMaskPadding, 0, maxX + lightMaskPadding, maxY, tcolor);
    }

    // reset drawmode to normal
    ctx.globalCompositeOperation = 'source-over';
  };

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
    sprite.rotation = 0;
    sprite.ax = 0;
    sprite.ay = 0;
    sprite.opacity = 255;
  };

  /**
   * @method _removeSprite
   * @private
   */
  Lightmask.prototype._removeSprite = function () {
    this.removeChild(this._sprites.pop());
  };


  // *******************  NORMAL BOX SHAPE ***********************************

  /**
   * 
   * @param {Number} x1 
   * @param {Number} y1 
   * @param {Number} x2 
   * @param {Number} y2 
   * @param {String} color1 
   */
  Bitmap.prototype.FillRect = function (x1, y1, x2, y2, color1) {
    x1 = x1 + lightMaskPadding;
    //x2=x2+lightMaskPadding;
    let context = this._context;
    context.save();
    context.fillStyle = color1;
    context.fillRect(x1, y1, x2, y2);
    context.restore();
    this._setDirty();
  };

  // *******************  CIRCLE/OVAL SHAPE ***********************************
  // from http://scienceprimer.com/draw-oval-html5-canvas
  /**
   * @param {Number} centerX 
   * @param {Number} centerY 
   * @param {Number} xradius 
   * @param {Number} yradius 
   * @param {String} color1 
   */
  Bitmap.prototype.FillCircle = function (centerX, centerY, xradius, yradius, color1) {
    centerX = centerX + lightMaskPadding;

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
   *
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   * @param {Number} a
   * @returns {String}
   */
  function rgba(r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }



  /**
   * Function to convert the
   * RGB code to Hex color code
   * @param {Number} R 
   * @param {Number} G 
   * @param {Number} B
   * @param {Number} A
   * @returns {String}
   */
  function rgba2hex(R, G, B, A = 255) {
    if ((R >= 0 && R <= 255)
      && (G >= 0 && G <= 255)
      && (B >= 0 && B <= 255) &&
      (A >= 0 && A <= 255)) {

      let hexCode = "#";
      let redHex = R.toString(16);
      if (redHex.length < 2) {
        redHex = "0" + redHex;
      }

      let greenHex = G.toString(16);
      if (greenHex.length < 2) {
        greenHex = "0" + greenHex;
      }

      let blueHex = B.toString(16);
      if (blueHex.length < 2) {
        blueHex = "0" + blueHex;
      }

      let alphaHex = A.toString(16);
      if (alphaHex.length < 2) {
        alphaHex = "0" + alphaHex;
      }

      hexCode += redHex;
      hexCode += greenHex;
      hexCode += blueHex;
      hexCode += alphaHex;

      return hexCode;
    }

    // The hex color code doesn't exist
    else {
      return "-1";
    }

  }

  /**
  * @param {Number} brightness
  * @param {String} color1
  * @param {String} color2
  */
  CanvasGradient.prototype.addTransparentColorStops = function (brightness, color1, color2) {

    if (brightness) {
      if (!useSmootherLights) {
        var alpha = Math.floor(brightness * 100 * 2.55).toString(16);
        if (alpha.length < 2) {
          alpha = "0" + alpha;
        }
        this.addColorStop(0, '#FFFFFF' + alpha);
      }
    }

    if (useSmootherLights) {
      for (let distanceFromCenter = 0; distanceFromCenter < 1; distanceFromCenter += 0.1) {
        let data = hexToRgb(color1);
        var newRed = data.r - (distanceFromCenter * 100 * 2.55);
        var newGreen = data.g - (distanceFromCenter * 100 * 2.55);
        let newBlue = data.b - (distanceFromCenter * 100 * 2.55);
        let newAlpha = 1 - distanceFromCenter;
        if (brightness > 0) {
          newAlpha = Math.max(0, brightness - distanceFromCenter);
        }
        this.addColorStop(distanceFromCenter, rgba(~~newRed, ~~newGreen, ~~newBlue, newAlpha));
      }
    } else {
      this.addColorStop(brightness, color1);
    }

    this.addColorStop(1, color2);
  }
  // *******************  NORMAL LIGHT SHAPE ***********************************
  // Fill gradient circle

  /**
   * 
   * @param {Number} x1 
   * @param {Number} y1 
   * @param {Number}  r1
   * @param {Number} r2
   * @param {String} color1 
   * @param {String} color2 
   * @param {Boolean} flicker 
   * @param {Number} brightness 
   * @param {Number} direction 
   */
  Bitmap.prototype.radialgradientFillRect = function (x1, y1, r1, r2, color1, color2, flicker, brightness, direction) {

    let isValidColor = isValidColorRegex.test(color1.trim());
    if (!isValidColor) {
      color1 = '#000000'
    }
    let isValidColor2 = isValidColorRegex.test(color2.trim());
    if (!isValidColor2) {
      color2 = '#000000'
    }

    x1 = x1 + lightMaskPadding;

    // clipping
    let nx1 = Number(x1);
    let ny1 = Number(y1);
    let nr2 = Number(r2);

    let clip = false;

    if (nx1 - nr2 > maxX) {
      clip = true;
    }
    if (ny1 - nr2 > maxY) {
      clip = true;
    }
    if (nx1 + nr2 < 0) {
      clip = true;
    }
    if (nx1 + nr2 < 0) {
      clip = true;
    }

    if (clip == false) {

      if (!brightness) {
        brightness = 0.0;
      }
      if (!direction) {
        direction = 0;
      }
      let context = this._context;
      let grad;
      let wait = Math.floor((Math.random() * 8) + 1);
      if (flicker == true && wait == 1) {
        let flickerradiusshift = $gameVariables.GetFireRadius();
        let flickercolorshift = $gameVariables.GetFireColorshift();
        let gradrnd = Math.floor((Math.random() * flickerradiusshift) + 1);
        let colorrnd = Math.floor((Math.random() * flickercolorshift) - (flickercolorshift / 2));

        let r = hexToRgb(color1).r;
        let g = hexToRgb(color1).g;
        let b = hexToRgb(color1).b;
        let a = hexToRgb(color1).a;

        g = g + colorrnd;
        if (g < 0) {
          g = 0;
        }
        if (g > 255) {
          g = 255;
        }
        color1 = rgba2hex(r, g, b, a);
        r2 = r2 - gradrnd;
        if (r2 < 0) r2 = 0;
      }

      grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(brightness, color1, color2);

      context.save();
      context.fillStyle = grad;
      direction = Number(direction);
      let pw = $gameMap.tileWidth() / 2;
      let ph = $gameMap.tileHeight() / 2;
      let hackishFix = 0; // I'm not proud of having to do this...
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
          context.fillRect(x1 - r2, y1 - r2 + hackishFix, r2 * 2, r2 * 1 + ph);
          break;
        case 4:
          context.fillRect(x1 - pw, y1 - r2, r2 * 2, r2 * 2);
          break;
        case 5:
          context.fillRect(x1 - r2, y1 - ph, r2 * 1 + pw, r2 * 1 + ph);
          break;
        case 6:
          context.fillRect(x1 - r2, y1 - r2 + hackishFix, r2 * 1 + pw, r2 * 1 + ph);
          break;
        case 7:
          context.fillRect(x1 - pw, y1 - r2 + hackishFix, r2 * 1 + pw, r2 * 1 + ph);
          break;
        case 8:
          context.fillRect(x1 - pw, y1 - ph, r2 * 1 + pw, r2 * 1 + ph);
          break;
        case 9:
          context.fillRect(x1 - r2, y1 - ph + hackishFix, r2 * 2, r2 * 2);
          context.fillRect(x1 - r2, y1 - r2 + hackishFix, r2 * 1 - pw, r2 * 1 - ph);
          break;
        case 10:
          context.fillRect(x1 - r2, y1 - r2 + hackishFix, r2 * 2, r2 * 1 + ph);
          context.fillRect(x1 - r2, y1 + pw + hackishFix, r2 * 1 - pw, r2 * 1 - ph);
          break;
        case 11:
          context.fillRect(x1 - r2, y1 - r2 + hackishFix, r2 * 2, r2 * 1 + ph);
          context.fillRect(x1 + pw, y1 + pw + hackishFix, r2 * 1 - pw, r2 * 1 - ph);
          break;
        case 12:
          context.fillRect(x1 - r2, y1 - ph + hackishFix, r2 * 2, r2 * 2);
          context.fillRect(x1 + pw, y1 - r2 + hackishFix, r2 * 1 - pw, r2 * 1 - ph);
          break;
      }
      context.restore();
      this._setDirty();
    }
  };


  // ********************************** FLASHLIGHT *************************************
  // Fill gradient Cone

  /**
   * 
   * @param {Number} x1 
   * @param {Number} y1
   * @param {Number} r1
   * @param {Number} r2
   * @param {String} color1 
   * @param {String} color2 
   * @param {Number} direction 
   * @param {Number} flashlength 
   * @param {Number} flashwidth 
   */
  Bitmap.prototype.radialgradientFillRect2 = function (x1, y1, r1, r2, color1, color2, direction, flashlength, flashwidth) {
    x1 = x1 + lightMaskPadding;

    let isValidColor = isValidColorRegex.test(color1.trim());
    if (!isValidColor) {
      color1 = '#000000'
    }
    let isValidColor2 = isValidColorRegex.test(color2.trim());
    if (!isValidColor2) {
      color2 = '#000000'
    }

    let context = this._context;
    let grad;

    // smal dim glove around player
    context.save();
    x1 = x1 - flashlightXoffset;
    y1 = y1 - flashlightYoffset;

    r1 = 1;
    r2 = 40;
    grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);

    grad.addColorStop(0, '#999999');
    grad.addColorStop(1, color2);

    context.fillStyle = grad;
    context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);

    // flashlight

    for (let cone = 0; cone < flashlength; cone++) {
      let flashlightdensity = $gameVariables.GetFlashlightDensity();
      r1 = cone * flashlightdensity;
      r2 = cone * flashwidth;

      switch (direction) {
        case 6:
          x1 = x1 + cone * 6;
          break;
        case 4:
          x1 = x1 - cone * 6;
          break;
        case 2:
          y1 = y1 + cone * 6;
          break;
        case 8:
          y1 = y1 - cone * 6;
          break;
      }


      grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(0, color1, color2);
      context.fillStyle = grad;
      context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
    }
    context.fillStyle = grad;
    context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);

    context.restore();
    this._setDirty();
  };


  /**
   * 
   * @param {String} hex 
   * @returns {{r:number,g:number,b:number,a:number}}
   */
  function hexToRgb(hex) {
    var regex = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
    let result = regex.exec(hex);
    result = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: result[4] == null ? 255 : parseInt(result[4], 16)
    } : null;
    return result;
  }

  // ALIASED Begin battle: prepare battle lighting

  let Community_Lighting_BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function (troopId, canEscape, canLose) {
    $gameTemp._MapTint = '#FFFFFF';																// By default, no darkness during battle
    if (!DataManager.isBattleTest() && !DataManager.isEventTest() && $gameMap.mapId() >= 0) {	// If we went there from a map...
      if ($gameVariables.GetScriptActive() === true) {										// If the script is active...
        if (options_lighting_on && lightInBattle) {											// If configuration autorise using lighting effects
          if (eventObjId.length > 0) {													// If there is lightsource on this map...
            $gameTemp._MapTint = $gameVariables.GetTint();								// ... Use the tint of the map.
          }
        }
        // Add daylight tint?
      }
    }
    Community_Lighting_BattleManager_setup.call(this, troopId, canEscape, canLose);
  };

  // ALIASED Scene_Battle initialisation: create the light mask.

  let Community_Lighting_Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function () {
    Community_Lighting_Spriteset_Battle_createLowerLayer.call(this);
    if (battleMaskPosition === 'Above') {
      this.createBattleLightmask();
    }
  };

  let Community_Lighting_Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
  Spriteset_Battle.prototype.createBattleback = function () {
    Community_Lighting_Spriteset_Battle_createBattleback.call(this);
    if (battleMaskPosition === 'Between') {
      this.createBattleLightmask();
    }
  };

  Spriteset_Battle.prototype.createBattleLightmask = function () {
    if ($gameVariables.GetScriptActive()) {					// If the script is active
      if (lightInBattle) {								// If is active during battles.
        this._battleLightmask = new BattleLightmask();	// ... Create the light mask.
        if (battleMaskPosition === 'Above') {
          this.addChild(this._battleLightmask);
        } else if (battleMaskPosition === 'Between') {
          this._battleField.addChild(this._battleLightmask);
        }
      }
    }
  };

  function BattleLightmask() {
    this.initialize.apply(this, arguments);
  };

  BattleLightmask.prototype = Object.create(PIXI.Container.prototype);
  BattleLightmask.prototype.constructor = BattleLightmask;

  BattleLightmask.prototype.initialize = function () {
    PIXI.Container.call(this);
    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];
    this._createBitmap();

    //Initialize the bitmap
    this._addSprite(-lightMaskPadding, 0, this._maskBitmap); // We are no longer based on battleback, we no longer to do shady shifting

    var redhex = $gameTemp._MapTint.substring(1, 3);
    var greenhex = $gameTemp._MapTint.substring(3, 5);
    var bluehex = $gameTemp._MapTint.substring(5);
    var red = parseInt(redhex, 16);
    var green = parseInt(greenhex, 16);
    var blue = parseInt(bluehex, 16);
    var color = red + green + blue;
    if (color < 200 && red < 66 && green < 66 && blue < 66) {
      $gameTemp._MapTint = '#666666' // Prevent the battle scene from being too dark.
    }
    $gameTemp._BattleTint = $$.daynightset ? $gameVariables.GetTintByTime() : $gameTemp._MapTint;
    this._maskBitmap.FillRect(-lightMaskPadding, 0, maxX + lightMaskPadding, maxY, $gameTemp._BattleTint);
    $gameTemp._BattleTintSpeed = 0;
  };

  //@method _createBitmaps

  BattleLightmask.prototype._createBitmap = function () {
    this._maskBitmap = new Bitmap(maxX + lightMaskPadding, maxY);   // one big bitmap to fill the intire screen with black
    var canvas = this._maskBitmap.canvas;          // a bit larger then setting to take care of screenshakes
  };

  BattleLightmask.prototype.update = function () {
    var color1 = $gameTemp._BattleTint;
    if ($gameTemp._BattleTintSpeed > 0) {

      $gameTemp._BattleTintTimer += 1;

      var r = hexToRgb($gameTemp._BattleTintFade).r;
      var g = hexToRgb($gameTemp._BattleTintFade).g;
      var b = hexToRgb($gameTemp._BattleTintFade).b;
      var a = hexToRgb($gameTemp._BattleTintFade).a;

      var r2 = hexToRgb($gameTemp._BattleTint).r;
      var g2 = hexToRgb($gameTemp._BattleTint).g;
      var b2 = hexToRgb($gameTemp._BattleTint).b;
      var a2 = hexToRgb($gameTemp._BattleTint).a;


      var stepR = (r2 - r) / (60 * $gameTemp._BattleTintSpeed);
      var stepG = (g2 - g) / (60 * $gameTemp._BattleTintSpeed);
      var stepB = (b2 - b) / (60 * $gameTemp._BattleTintSpeed);
      var stepA = (a2 - a) / (60 * $gameTemp._BattleTintSpeed);

      var r3 = Math.floor(r + (stepR * $gameTemp._BattleTintTimer));
      var g3 = Math.floor(g + (stepG * $gameTemp._BattleTintTimer));
      var b3 = Math.floor(b + (stepB * $gameTemp._BattleTintTimer));
      var a3 = Math.floor(a + (stepA * $gameTemp._BattleTintTimer));
      if (r3 < 0) { r3 = 0 }
      if (g3 < 0) { g3 = 0 }
      if (b3 < 0) { b3 = 0 }
      if (a3 < 0) { a3 = 0 }
      if (r3 > 255) { r3 = 255 }
      if (g3 > 255) { g3 = 255 }
      if (b3 > 255) { b3 = 255 }
      if (a3 > 255) { a3 = 255 }
      var reddone = false;
      var greendone = false;
      var bluedone = false;
      var alphadone = false;
      if (stepR >= 0 && r3 >= r2) {
        reddone = true;
      }
      if (stepR <= 0 && r3 <= r2) {
        reddone = true;
      }
      if (stepG >= 0 && g3 >= g2) {
        greendone = true;
      }
      if (stepG <= 0 && g3 <= g2) {
        greendone = true;
      }
      if (stepB >= 0 && b3 >= b2) {
        bluedone = true;
      }
      if (stepB <= 0 && b3 <= b2) {
        bluedone = true;
      }
      if (stepA >= 0 && a3 >= a2) {
        alphadone = true;
      }
      if (stepA <= 0 && a3 <= a2) {
        alphadone = true;
      }
      if (reddone == true && bluedone == true && greendone == true && alphadone) {
        $gameTemp._BattleTintFade = $gameTemp._BattleTint;
        $gameTemp._BattleTintSpeed = 0;
        $gameTemp._BattleTintTimer = 0;
      }
      color1 = rgba2hex(r, g, b, a);
      $gameTemp._BattleTintFade = color1;
    }
    this._maskBitmap.FillRect(-lightMaskPadding, 0, maxX + lightMaskPadding, maxY, color1);
  };

  /**
   * @method _addSprite
   * @private
   */
  BattleLightmask.prototype._addSprite = function (x1, y1, selectedbitmap) {

    var sprite = new Sprite(this.viewport);
    sprite.bitmap = selectedbitmap;
    //sprite.opacity = 255;
    sprite.blendMode = 2;
    sprite.x = x1;
    sprite.y = y1;
    this._sprites.push(sprite);
    this.addChild(sprite);
    sprite.rotation = 0;
    sprite.ax = 0;
    sprite.ay = 0
    //sprite.opacity = 255;
  };

  /**
   * @method _removeSprite
   * @private
   */
  BattleLightmask.prototype._removeSprite = function () {
    this.removeChild(this._sprites.pop());
  };

  // ALLIASED Move event location => reload map.

  let Alias_Game_Interpreter_command203 = Game_Interpreter.prototype.command203;
  Game_Interpreter.prototype.command203 = function () {
    Alias_Game_Interpreter_command203.call(this);
    $$.ReloadMapEvents();
    return true;
  };


  // ALIASED FROM RPG OBJECTS TO ADD LIGHTING TO CONFIG MENU

  ConfigManager.cLighting = true;

  Object.defineProperty(ConfigManager, 'cLighting', {
    get: function () {
      return options_lighting_on;
    },
    set: function (value) {
      options_lighting_on = value;
    },
    configurable: true
  });

  let Alias_ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function () {
    let config = Alias_ConfigManager_makeData.call(this);
    config.cLighting = options_lighting_on;
    return config;
  };

  let Alias_ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    Alias_ConfigManager_applyData.call(this, config);
    this.cLighting = this.readFlag2(config, 'cLighting');
  };

  let Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function () {
    Window_Options_addGeneralOptions.call(this);
    if (optionText !== "") this.addCommand(optionText, 'cLighting');
  };

  ConfigManager.readFlag2 = function (config, name) {
    let value = config[name];
    if (value !== undefined) {
      return !!config[name];
    } else {
      return true;
    }
  };

  $$.ReloadMapEvents = function () {
    //**********************fill up new map-array *************************
    eventObjId = [];
    event_id = [];
    event_x = [];
    event_y = [];
    event_dir = [];
    event_moving = [];
    event_stacknumber = [];
    event_eventcount = $gameMap.events().length;

    for (let i = 0; i < event_eventcount; i++) {
      if ($gameMap.events()[i]) {
        if ($gameMap.events()[i].event() && !$gameMap.events()[i]._erased) {
          let note = $gameMap.events()[i].getCLTag();

          let note_args = note.split(" ");
          let note_command = note_args.shift().toLowerCase();

          if (note_command == "light" || note_command == "fire" || note_command == "flashlight") {

            eventObjId.push(i);
            event_id.push($gameMap.events()[i]._eventId);
            event_x.push($gameMap.events()[i]._realX);
            event_y.push($gameMap.events()[i]._realY);
            event_dir.push($gameMap.events()[i]._direction);
            event_moving.push($gameMap.events()[i]._moveType || $gameMap.events()[i]._moveRouteForcing);
            event_stacknumber.push(i);

          }
          // else if (note_command == "daynight") daynightset = true;
        }
      }
    }
    // *********************************** DAY NIGHT Setting **************************
    $$.daynightset = false;
    let mapNote = $dataMap.note ? $dataMap.note.split("\n") : [];
    mapNote.forEach((note) => {
      /**
       * @type {String}
       */
      let mapnote = $$.getCLTag(note.trim());
      if (mapnote) {
        mapnote = mapnote.toLowerCase().trim();
        if ((/^daynight/i).test(mapnote)) {
          $$.daynightset = true;
          let dnspeed = note.match(/\d+/);
          if (dnspeed) {
            daynightspeed = +dnspeed[0];
            if (daynightspeed < 1) daynightspeed = 5000;
            $gameVariables.SetDaynightSpeed(daynightspeed);
          }
        }
        else if ((/^RegionFire/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.tileType("regionfire", data);
        }
        else if ((/^RegionGlow/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.tileType("regionglow", data);
        }
        else if ((/^RegionLight/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.tileType("regionlight", data);
        }
        else if ((/^RegionGlow/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.tileType("regionglow", data);
        }
        else if ((/^RegionBlock/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.tileType("regionblock", data);
        }
        else if ((/^tint/i).test(mapnote)) {

          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          if (typeof $$.mapBrightness == "undefined") {
            $$.tint(data);
          }
          else {
            let color = data[1];
            let red = hexToRgb(color).r;
            let green = hexToRgb(color).g;
            let blue = hexToRgb(color).b;
            let alpha = hexToRgb(color).a;
            if (alpha == 255) {
              alpha = $$.mapBrightness;
            }
            data[1] = rgba2hex(red, green, blue, alpha);
            $$.tint(data);
          }
        }
        else if ((/^defaultBrightness/i).test(mapnote)) {
          let brightness = note.match(/\d+/);
          if (brightness) {
            $$.defaultBrightness = Math.max(0, Math.min(Number(brightness[0], 100))) / 100;
          }
        }

        else if ((/^mapBrightness/i).test(mapnote)) {
          let brightness = note.match(/\d+/);

          if (brightness) {
            let color = $gameVariables.GetTint();
            if (color == "#000000" || color == "#00000000") {
              color = "#FFFFFF";
            }
            var red = hexToRgb(color).r;
            var blue = hexToRgb(color).b;
            var green = hexToRgb(color).g;


            var value = Math.max(0, Math.min(Number(brightness[0], 100)));
            var alphaNum = Math.floor(value * 2.55);
            var trueColor = rgba2hex(red, green, blue, alphaNum);
            $$.tint(["set", trueColor]);
            $$.mapBrightness = alphaNum;
          }
        }
      }
    })
  };


  $$.ReloadTagArea = function () {
    // *************************** TILE TAG LIGHTSOURCES *********

    // clear arrays
    tile_lights = [];
    tile_blocks = [];

    // refill arrays
    let tilearray = $gameVariables.GetTileArray();
    for (let i = 0, len = tilearray.length; i < len; i++) {

      let tilestr = tilearray[i];
      let tileargs = tilestr.split(";");
      let tile_type = Number(tileargs[0]);
      let tile_number = Number(tileargs[1]);
      let tile_on = Number(tileargs[2]);
      let tile_color = tileargs[3];
      let tile_radius = 0;
      let brightness = $$.defaultBrightness || 0;
      let shape = 0;
      let xo1 = 0.0;
      let yo1 = 0.0;
      let xo2 = 0.0;
      let yo2 = 0.0;

      if (tile_type === 1 || tile_type === 2) {

        let b_arg = tileargs[4];
        if (typeof b_arg !== 'undefined') {
          shape = Number(b_arg);
        }
        b_arg = tileargs[5];
        if (typeof b_arg !== 'undefined') {
          xo1 = Number(b_arg);
        }
        b_arg = tileargs[6];
        if (typeof b_arg !== 'undefined') {
          yo1 = Number(b_arg);
        }
        b_arg = tileargs[7];
        if (typeof b_arg !== 'undefined') {
          xo2 = Number(b_arg);
        }
        b_arg = tileargs[8];
        if (typeof b_arg !== 'undefined') {
          yo2 = Number(b_arg);
        }


      } else {
        tile_radius = Number(tileargs[4]);
        let b_arg = tileargs[5];
        if (typeof b_arg != 'undefined') {
          let key = b_arg.substring(0, 1);
          if (key === 'b' || key === 'B') {
            brightness = Number(b_arg.substring(1)) / 100;
          }
        }
      }

      if (tile_on === 1) {

        if (tile_type >= 3) {
          // *************************** TILE TAG LIGHTSOURCES *********
          for (let y = 0, mapHeight = $dataMap.height; y < mapHeight; y++) {
            for (let x = 0, mapWidth = $dataMap.width; x < mapWidth; x++) {
              let tag = 0;
              if (tile_type === 3 || tile_type === 5 || tile_type === 7) { // tile light
                tag = $gameMap.terrainTag(x, y);
              }
              if (tile_type === 4 || tile_type === 6 || tile_type === 8) { // region light
                //$dataMap.data[(5 * $dataMap.height + y) * $dataMap.width + x]
                tag = $gameMap.regionId(x, y); //Technically the same
              }
              if (tag === tile_number) {
                let tilecode = x + ";" + y + ";" + tile_type + ";" + tile_radius + ";" + tile_color + ";" + brightness;
                tile_lights.push(tilecode);
              }
            }
          }
        }


        // *************************** REDRAW MAPTILES FOR ROOFS ETC *********
        if (tile_type == 1 || tile_type == 2) {
          for (let y = 0, mapHeight = $dataMap.height; y < mapHeight; y++) {
            for (let x = 0, mapWidth = $dataMap.width; x < mapWidth; x++) {
              let tag = 0;
              if (tile_type === 1) { // tile block
                tag = $gameMap.terrainTag(x, y);
              }
              if (tile_type === 2) { // region block
                //$dataMap.data[(5 * $dataMap.height + y) * $dataMap.width + x]
                tag = $gameMap.regionId(x, y); //Technically the same
              }
              if (tag === tile_number) {
                let tilecode = x + ";" + y + ";" + shape + ";" + xo1 + ";" + yo1 + ";" + xo2 + ";" + yo2 + ";" + tile_color;
                tile_blocks.push(tilecode);
              }
            }
          }
        }
      }

    }
    $gameVariables.SetLightTags(tile_lights);
    $gameVariables.SetBlockTags(tile_blocks);
  };

  /**
   * 
   * @param {String[]} args 
   */
  $$.flashlight = function (args) {
    if (args[0] == 'on') {

      let flashlightlength = $gameVariables.GetFlashlightLength();
      let flashlightwidth = $gameVariables.GetFlashlightWidth();
      let flashlightdensity = $gameVariables.GetFlashlightDensity();
      let playercolor = $gameVariables.GetPlayerColor();

      if (args.length >= 1) {
        flashlightlength = args[1];
      }
      if (args.length >= 2) {
        flashlightwidth = args[2];
      }
      if (args.length >= 3) {
        playercolor = args[3];
        let isValidPlayerColor = isValidColorRegex.test(playercolor.trim());
        if (!isValidPlayerColor) {
          playercolor = '#FFFFFF'
        }
      }
      if (args.length >= 4) {
        flashlightdensity = args[4]; // density
      }

      if (flashlightlength == 0 || isNaN(flashlightlength)) {
        flashlightlength = 8
      }
      if (flashlightwidth == 0 || isNaN(flashlightwidth)) {
        flashlightwidth = 12
      }
      if (flashlightdensity == 0 || isNaN(flashlightdensity)) {
        flashlightdensity = 3
      }

      $gameVariables.SetFlashlight(true);
      $gameVariables.SetPlayerColor(playercolor);
      $gameVariables.SetFlashlightWidth(flashlightwidth);
      $gameVariables.SetFlashlightLength(flashlightlength);
      $gameVariables.SetFlashlightDensity(flashlightdensity);

    }
    if (args[0] === 'off') {
      $gameVariables.SetFlashlight(false);
    }
  };

  /**
   * 
   * @param {String[]} args 
   */
  $$.fireLight = function (args) {
    //******************* Light radius 100 #FFFFFF ************************
    if (args[0] == 'radius') {
      let newradius = Number(args[1]);
      if (newradius >= 0) {
        $gameVariables.SetRadius(newradius);
        $gameVariables.SetRadiusTarget(newradius);
      }
      if (args.length > 2) {
        playercolor = args[2];
        let isValidPlayerColor = isValidColorRegex.test(playercolor.trim());

        if (!isValidPlayerColor) {
          playercolor = '#FFFFFF';
        }
        $gameVariables.SetPlayerColor(playercolor);
      }
      // player brightness
      if (args.length > 3) {
        let brightness = 0.0;
        let b_arg = args[3];
        if (typeof b_arg != 'undefined') {
          let key = b_arg.substring(0, 1);
          if (key == 'b' || key == 'B') {
            brightness = ((+b_arg.substring(1) || 0) / 100).clamp(0, 1);
            $gameVariables.SetPlayerBrightness(brightness);
          }
        }
      }
    }

    //******************* Light radiusgrow 100 #FFFFFF Brightness Frames ************************
    if (args[0] === 'radiusgrow') {
      let newradius = Number(args[1]);
      if (newradius >= 0) {

        let lightgrow_value = $gameVariables.GetRadius();
        let lightgrow_target = newradius;
        let lightgrow_speed = 0.0;
        if (args.length >= 4) {
		  lightgrow_speed = (Math.abs(newradius - player_radius)) / Math.max(1, Number(args[4]));
        } else {
          lightgrow_speed = (Math.abs(newradius - player_radius)) / 500;
        }
        $gameVariables.SetRadius(lightgrow_value);
        $gameVariables.SetRadiusTarget(lightgrow_target);
        $gameVariables.SetRadiusSpeed(lightgrow_speed);
      }
      // player color
      if (args.length > 2) {
        playercolor = args[2];
        let isValidPlayerColor = isValidColorRegex.test(playercolor.trim());
        if (!isValidPlayerColor) {
          playercolor = '#FFFFFF'
        }
        $gameVariables.SetPlayerColor(playercolor);
      }
      // player brightness
      if (args.length > 3) {
        let brightness = 0.0;
        let b_arg = args[3];
        if (typeof b_arg != 'undefined') {
          let key = b_arg.substring(0, 1);
          if (key == 'b' || key == 'B') {
            brightness = ((+b_arg.substring(1) || 0) / 100).clamp(0, 1);
            $gameVariables.SetPlayerBrightness(brightness);
          }
        }
      }

    }

    // *********************** TURN SPECIFIC LIGHT ON *********************
    if (args[0] === 'on') {

      let lightarray_id = $gameVariables.GetLightArrayId();
      let lightarray_state = $gameVariables.GetLightArrayState();
      let lightarray_color = $gameVariables.GetLightArrayColor();

      let lightid = Number(args[1]);
      let idfound = false;
      for (let i = 0, len = lightarray_id.length; i < len; i++) {
        if (lightarray_id[i] == lightid) {
          idfound = true;
          lightarray_state[i] = true;
        }
      }
      if (idfound === false) {
        lightarray_id.push(lightid);
        lightarray_state.push(true);
        lightarray_color.push('defaultcolor');
      }
      $gameVariables.SetLightArrayId(lightarray_id);
      $gameVariables.SetLightArrayState(lightarray_state);
      $gameVariables.SetLightArrayColor(lightarray_color);
    }

    // *********************** TURN SPECIFIC LIGHT OFF *********************
    if (args[0] === 'off') {

      let lightarray_id = $gameVariables.GetLightArrayId();
      let lightarray_state = $gameVariables.GetLightArrayState();
      let lightarray_color = $gameVariables.GetLightArrayColor();

      let lightid = Number(args[1]);
      let idfound = false;
      for (let i = 0, len = lightarray_id.length; i < len; i++) {
        if (lightarray_id[i] == lightid) {
          idfound = true;
          lightarray_state[i] = false;
        }
      }
      if (idfound === false) {
        lightarray_id.push(lightid);
        lightarray_state.push(false);
        lightarray_color.push('defaultcolor');
      }
      $gameVariables.SetLightArrayId(lightarray_id);
      $gameVariables.SetLightArrayState(lightarray_state);
      $gameVariables.SetLightArrayColor(lightarray_color);
    }

    // *********************** SET COLOR *********************

    if (args[0] === 'color') {

      let newcolor = args[2];
      if (newcolor && newcolor.toLowerCase() === 'defaultcolor') {
        newcolor = 'defaultcolor';
      }

      let lightarray_id = $gameVariables.GetLightArrayId();
      let lightarray_state = $gameVariables.GetLightArrayState();
      let lightarray_color = $gameVariables.GetLightArrayColor();

      let lightid = Number(args[1]);
      idfound = false;
      for (let i = 0, len = lightarray_id.length; i < len; i++) {
        if (lightarray_id[i] == lightid) {
          idfound = true;
          lightarray_color[i] = newcolor;
        }
      }
      if (idfound === false) {
        lightarray_id.push(lightid);
        lightarray_state.push(false);
        lightarray_color.push(newcolor);
      }
      $gameVariables.SetLightArrayId(lightarray_id);
      $gameVariables.SetLightArrayState(lightarray_state);
      $gameVariables.SetLightArrayColor(lightarray_color);
    }


    // **************************** RESET ALL SWITCHES ***********************
    if (args[0] === 'switch' && args[1] === 'reset') {
      $gameVariables.SetLightArrayId([]);
      $gameVariables.SetLightArrayState([]);
      $gameVariables.SetLightArrayColor([]);
    }
  };

  /**
   * @param {String} tileType
   * @param {String[]} args 
   */
  $$.tile = function (tiletype, args) {
    let tilearray = $gameVariables.GetTileArray();
    let tilenumber = Number(eval(args[0]));

    let tile_on = String(args[1]).toLowerCase() === "on" ? 1 : 0;

    let tilecolor = args[2];
    let isValidColor1 = isValidColorRegex.test(tilecolor.trim());
    if (!isValidColor1) {
      if (tiletype === 1 || tiletype === 2) tilecolor = "#000000";
      else tilecolor = "#ffffff";
    }

    let tileradius = 100;
    let tilebrightness = $$.defaultBrightness || 0;
    let shape = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    if (tiletype === 1 || tiletype === 2) {
      if (args.length > 3) {
        shape = args[3];
      }
      if (args.length > 4) {
        x1 = args[4];
      }
      if (args.length > 5) {
        y1 = args[5];
      }
      if (args.length > 6) {
        x2 = args[6];
      }
      if (args.length > 7) {
        y2 = args[7];
      }
    } else {
      if (args.length > 3) {
        tileradius = args[3];
      }
      if (args.length > 4) {
        tilebrightness = args[4];
      }
    }

    let tilefound = false;

    for (let i = 0, len = tilearray.length; i < len; i++) {
      let tilestr = tilearray[i];
      let tileargs = tilestr.split(";");
      if (tileargs[0] == tiletype && tileargs[1] == tilenumber) {
        tilefound = true;
        if (tiletype === 1 || tiletype === 2) {
          tilearray[i] = tiletype + ";" + tilenumber + ";" + tile_on + ";" + tilecolor + ";" + shape + ";" + x1 + ";" + y1 + ";" + x2 + ";" + y2;
        } else {
          tilearray[i] = tiletype + ";" + tilenumber + ";" + tile_on + ";" + tilecolor + ";" + tileradius + ";" + tilebrightness;
        }
      }
    }

    if (tilefound === false) {
      let tiletag = "";
      if (tiletype === 1 || tiletype === 2) {
        tiletag = tiletype + ";" + tilenumber + ";" + tile_on + ";" + tilecolor + ";" + shape + ";" + x1 + ";" + y1 + ";" + x2 + ";" + y2;
      } else {
        tiletag = tiletype + ";" + tilenumber + ";" + tile_on + ";" + tilecolor + ";" + tileradius + ";" + tilebrightness;
      }
      tilearray.push(tiletag);
    }
    $gameVariables.SetTileArray(tilearray);
    $$.ReloadTagArea();
  };

  /**
   * 
   * @param {String[]} args 
   */
  $$.tint = function (args) {
    if (args[0].trim().toLowerCase() === 'set') {

      $gameVariables.SetTint(args[1]);
      $gameVariables.SetTintTarget(args[1]);
    }
    if (args[0].trim().toLowerCase() === 'fade') {
      $gameVariables.SetTintTarget(args[1]);
      $gameVariables.SetTintSpeed(args[2]);
    }
    else if (args[0].trim().toLowerCase() === "daylight") {
      let currentColor = $gameVariables.GetTintByTime();
      $gameVariables.SetTint(currentColor);
      $gameVariables.SetTintTarget(currentColor);
    }
  };

  /**
   * 
   * @param {String[]} args 
   */
  $$.DayNight = function (args) {
    let daynightspeed = $gameVariables.GetDaynightSpeed();
    let daynighttimer = $gameVariables.GetDaynightTimer();     // timer = minutes * speed
    let daynightcycle = $gameVariables.GetDaynightCycle();     // cycle = hours
    let daynighthoursinday = $gameVariables.GetDaynightHoursinDay();   // 24
    //let daynightcolors = $gameVariables.GetDaynightColorArray();

    if (args[0] === 'speed') {
      daynightspeed = Number(args[1]);
      if (daynightspeed < 0) {
        daynightspeed = 5000;
      }
      $gameVariables.SetDaynightSpeed(daynightspeed);
    }

    if (args[0] === 'add') {
      let houradd = Number(args[1]);
      let minuteadd = 0;
      if (args.length > 2) {
        minuteadd = Number(args[2]);
      }

      let daynightminutes = Math.floor(daynighttimer / daynightspeed);
      daynightminutes = daynightminutes + minuteadd;
      if (daynightminutes > 60) {
        daynightminutes = daynightminutes - 60;
        daynightcycle = daynightcycle + 1;
      }
      daynightcycle = daynightcycle + houradd;
      daynighttimer = daynightminutes * daynightspeed;

      if (daynightcycle < 0) daynightcycle = 0;
      if (daynightcycle >= daynighthoursinday) daynightcycle = daynightcycle - daynighthoursinday;
      $$.saveTime(daynightcycle, daynightminutes);

      $gameVariables.SetDaynightTimer(daynighttimer);     // timer = minutes * speed
      $gameVariables.SetDaynightCycle(daynightcycle);     // cycle = hours

    }


    if (args[0] === 'hour') {
      daynightcycle = Number(args[1]);
      if (args.length > 2) {
        daynightminutes = Number(args[2]);
      } else {
        daynightminutes = 0;
      }
      daynighttimer = daynightminutes * daynightspeed;

      if (daynightcycle < 0) daynightcycle = 0;
      if (daynightcycle >= daynighthoursinday) daynightcycle = daynighthoursinday - 1;
      $$.saveTime(daynightcycle, daynightminutes);

      $gameVariables.SetDaynightTimer(daynighttimer);     // timer = minutes * speed
      $gameVariables.SetDaynightCycle(daynightcycle);     // cycle = hours

    }

    if (args[0] === 'hoursinday') {

      let old_value = daynighthoursinday;
      daynighthoursinday = Number(args[1]);
      if (daynighthoursinday < 0) {
        daynighthoursinday = 0;
      }
      if (daynighthoursinday > old_value) {
        for (let i = old_value; i < daynighthoursinday; i++) {
          daynightcolors.push({ "color": "#ffffff", "isNight": false });
        }
      }
      $gameVariables.setDayNightColorArray(daynightcolors);
      $gameVariables.setDayNightHoursInDay(daynighthoursinday);
    }

    if (args[0] === 'show') {
      $gameVariables._clShowTimeWindow = true;
    }

    if (args[0] === 'showseconds') {
      $gameVariables._clShowTimeWindow = true;
      $gameVariables._clShowTimeWindowSeconds = true;
    }

    if (args[0] === 'hide') {
      $gameVariables._clShowTimeWindow = false;
      $gameVariables._clShowTimeWindowSeconds = false;
    }

    if (args[0] === 'color') {

      let hour = Number(args[1]);
      if (hour < 0) {
        hour = 0;
      }
      if (hour >= daynighthoursinday) {
        hour = (daynighthoursinday - 1);
      }
      let hourcolor = args[2];
      let isValidColor = isValidColorRegex.test(hourcolor.trim());
      if (isValidColor) {
        daynightcolors[hour].color = hourcolor;
      }
      $gameVariables.SetDaynightColorArray(daynightcolors);
    }
  };

  let _Tilemap_drawShadow = Tilemap.prototype._drawShadow;
  Tilemap.prototype._drawShadow = function (bitmap, shadowBits, dx, dy) {
    if (!hideAutoShadow) {
      _Tilemap_drawShadow.call(this, bitmap, shadowBits, dx, dy);
    }
    // Else, show no shadow
  };

  let _ShaderTilemap_drawShadow = ShaderTilemap.prototype._drawShadow;
  ShaderTilemap.prototype._drawShadow = function (bitmap, shadowBits, dx, dy) {
    if (!hideAutoShadow) {
      _ShaderTilemap_drawShadow.call(this, bitmap, shadowBits, dx, dy);
    }
    // Else, show no shadow
  };
})(Community.Lighting);

Community.Lighting.distance = function (x1, y1, x2, y2) {
  return Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
};

Game_Variables.prototype.SetActiveRadius = function (value) {
  this._Player_Light_Radius = value;
};
Game_Variables.prototype.GetActiveRadius = function () {
  if (this._Player_Light_Radius >= 0) return this._Player_Light_Radius;
  return Number(Community.Lighting.parameters['Lights Active Radius']) || 0;
};

Game_Variables.prototype.GetFirstRun = function () {
  if (typeof this._Community_Lighting_FirstRun == 'undefined') {
    this._Community_Lighting_FirstRun = true;
  }
  return this._Community_Lighting_FirstRun;
};
Game_Variables.prototype.SetFirstRun = function (value) {
  this._Community_Lighting_FirstRun = value;
};
Game_Variables.prototype.GetScriptActive = function () {
  if (typeof this._Community_Lighting_ScriptActive == 'undefined') {
    this._Community_Lighting_ScriptActive = true;
  }
  return this._Community_Lighting_ScriptActive;
};
Game_Variables.prototype.SetScriptActive = function (value) {
  this._Community_Lighting_ScriptActive = value;
};

Game_Variables.prototype.GetOldMapId = function () {
  if (typeof this._Community_Lighting_OldMapId == 'undefined') {
    this._Community_Lighting_OldMapId = 0;
  }
  return this._Community_Lighting_OldMapId;
};
Game_Variables.prototype.SetOldMapId = function (value) {
  this._Community_Lighting_OldMapId = value;
};

Game_Variables.prototype.SetTint = function (value) {
  this._Community_Tint_Value = value;
};
Game_Variables.prototype.GetTint = function () {
  return this._Community_Tint_Value || '#000000';
};
Game_Variables.prototype.GetTintByTime = function () {
  let result = this.GetDaynightColorArray()[this.GetDaynightCycle()];
  return result ? (result.color || "#000000") : "#000000";
};
Game_Variables.prototype.SetTintTarget = function (value) {
  this._Community_TintTarget_Value = value;
};
Game_Variables.prototype.GetTintTarget = function () {
  return this._Community_TintTarget_Value || '#000000';
};
Game_Variables.prototype.SetTintSpeed = function (value) {
  this._Community_TintSpeed_Value = value;
};
Game_Variables.prototype.GetTintSpeed = function () {
  return this._Community_TintSpeed_Value || 60;
};

Game_Variables.prototype.SetFlashlight = function (value) {
  this._Community_Lighting_Flashlight = value;
};
Game_Variables.prototype.GetFlashlight = function () {
  return this._Community_Lighting_Flashlight || false;
};
Game_Variables.prototype.SetFlashlightDensity = function (value) {
  this._Community_Lighting_FlashlightDensity = value;
};
Game_Variables.prototype.GetFlashlightDensity = function () {
  return this._Community_Lighting_FlashlightDensity || 3;
};
Game_Variables.prototype.SetFlashlightLength = function (value) {
  this._Community_Lighting_FlashlightLength = value;
};
Game_Variables.prototype.GetFlashlightLength = function () {
  return this._Community_Lighting_FlashlightLength || 8;
};
Game_Variables.prototype.SetFlashlightWidth = function (value) {
  this._Community_Lighting_FlashlightWidth = value;
};
Game_Variables.prototype.GetFlashlightWidth = function () {
  return this._Community_Lighting_FlashlightWidth || 12;
};

/**
 * 
 * @param {String} value 
 */
Game_Variables.prototype.SetPlayerColor = function (value) {
  this._Community_Lighting_PlayerColor = value;
};
Game_Variables.prototype.GetPlayerColor = function () {
  return this._Community_Lighting_PlayerColor || '#FFFFFF';
};
Game_Variables.prototype.SetPlayerBrightness = function (value) {
  this._Community_Lighting_PlayerBrightness = value;
};
Game_Variables.prototype.GetPlayerBrightness = function () {
  return this._Community_Lighting_PlayerBrightness || 0;
};
Game_Variables.prototype.SetRadius = function (value) {
  this._Community_Lighting_Radius = value;
};
Game_Variables.prototype.GetRadius = function () {
  if (this._Community_Lighting_Radius === undefined) {
    return 150;
  } else {
    return this._Community_Lighting_Radius;
  }
};
Game_Variables.prototype.SetRadiusTarget = function (value) {
  this._Community_Lighting_RadiusTarget = value;
};
Game_Variables.prototype.GetRadiusTarget = function () {
  if (this._Community_Lighting_RadiusTarget === undefined) {
    return 150;
  } else {
    return this._Community_Lighting_RadiusTarget;
  }
};
Game_Variables.prototype.SetRadiusSpeed = function (value) {
  this._Community_Lighting_RadiusSpeed = value;
};
Game_Variables.prototype.GetRadiusSpeed = function () {
  return this._Community_Lighting_RadiusSpeed || 0;
};

Game_Variables.prototype.SetDaynightColorArray = function (value) {
  this._Community_Lighting_DayNightColorArray = value;
};
Game_Variables.prototype.GetDaynightColorArray = function () {
  let result = this._Community_Lighting_DayNightColorArray || Community.Lighting.getDayNightList();
  if (!result) {
    result = ['#000000', '#000000', '#000000', '#000000',
      '#000000', '#000000', '#666666', '#AAAAAA',
      '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
      '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
      '#FFFFFF', '#FFFFFF', '#AAAAAA', '#666666',
      '#000000', '#000000', '#000000', '#000000'].map(x => x = { "color": x, "isNight": false });
    this._Community_Lighting_DayNightColorArray = result;
  }
  if (!this._Community_Lighting_DayNightColorArray) this.SetDaynightColorArray(result);
  return result;
};
Game_Variables.prototype.SetDaynightSpeed = function (value) {
  this._Community_Lighting_DaynightSpeed = value;
};
Game_Variables.prototype.GetDaynightSpeed = function () {
  if (this._Community_Lighting_DaynightSpeed >= 0) {
    return this._Community_Lighting_DaynightSpeed;
  }
  var defaultSpeed = Number(Community.Lighting.parameters['Daynight Initial Speed'])
  if (Number.isNaN(defaultSpeed)) {
    return 10;
  }
  else {
    return defaultSpeed;
  }
};
Game_Variables.prototype.SetDaynightCycle = function (value) {
  this._Community_Lighting_DaynightCycle = value;
};
Game_Variables.prototype.GetDaynightCycle = function () {
  if (this._Community_Lighting_DaynightCycle !== undefined) return this._Community_Lighting_DaynightCycle;
  return Number(Community.Lighting.parameters['Daynight Initial Hour']) || 0;
};
Game_Variables.prototype.SetDaynightTimer = function (value) {
  this._Community_Lighting_DaynightTimer = value;
};
Game_Variables.prototype.GetDaynightTimer = function () {
  return this._Community_Lighting_DaynightTimer || 0;
};
Game_Variables.prototype.SetDaynightHoursinDay = function (value) {
  this._Community_Lighting_DaynightHoursinDay = value;
};
Game_Variables.prototype.GetDaynightHoursinDay = function () {
  return this._Community_Lighting_DaynightHoursinDay || 24;
};

Game_Variables.prototype.SetFireRadius = function (value) {
  this._Community_Lighting_FireRadius = value;
};
Game_Variables.prototype.GetFireRadius = function () {
  return this._Community_Lighting_FireRadius || 7;
};
Game_Variables.prototype.SetFireColorshift = function (value) {
  this._Community_Lighting_FireColorshift = value;
};
Game_Variables.prototype.GetFireColorshift = function () {
  return this._Community_Lighting_FireColorshift || 10;
};
Game_Variables.prototype.SetFire = function (value) {
  this._Community_Lighting_Fire = value;
};
Game_Variables.prototype.GetFire = function () {
  return this._Community_Lighting_Fire || false;
};

Game_Variables.prototype.SetLightArrayId = function (value) {
  this._Community_Lighting_LightArrayId = value;
};
Game_Variables.prototype.GetLightArrayId = function () {
  let default_LAI = [];
  return this._Community_Lighting_LightArrayId || default_LAI;
};
Game_Variables.prototype.SetLightArrayState = function (value) {
  this._Community_Lighting_LightArrayState = value;
};
Game_Variables.prototype.GetLightArrayState = function () {
  let default_LAS = [];
  return this._Community_Lighting_LightArrayState || default_LAS;
};
Game_Variables.prototype.SetLightArrayColor = function (value) {
  this._Community_Lighting_LightArrayColor = value;
};
Game_Variables.prototype.GetLightArrayColor = function () {
  let default_LAS = [];
  return this._Community_Lighting_LightArrayColor || default_LAS;
};

Game_Variables.prototype.SetTileArray = function (value) {
  this._Community_Lighting_TileArray = value;
};
Game_Variables.prototype.GetTileArray = function () {
  let default_TA = [];
  return this._Community_Lighting_TileArray || default_TA;
};
Game_Variables.prototype.SetLightTags = function (value) {
  this._Community_Lighting_LightTags = value;
};
Game_Variables.prototype.GetLightTags = function () {
  let default_TA = [];
  return this._Community_Lighting_LightTags || default_TA;
};
Game_Variables.prototype.SetBlockTags = function (value) {
  this._Community_Lighting_BlockTags = value;
};
Game_Variables.prototype.GetBlockTags = function () {
  let default_TA = [];
  return this._Community_Lighting_BlockTags || default_TA;
};
function Window_TimeOfDay() {
  this.initialize(...arguments);
};
Window_TimeOfDay.prototype = Object.create(Window_Base.prototype);
Window_TimeOfDay.prototype.constructor = Window_TimeOfDay;

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width
 * @param {Number} height
 */
Window_TimeOfDay.prototype.initialize = function (x, y, width, height) {
  width = 150;
  height = 65;
  Window_Base.prototype.initialize.call(this, Graphics.boxWidth - width, 0, width, height);
  this.setBackgroundType(0);
  this.visible = $gameVariables._clShowTimeWindow;
};
Window_TimeOfDay.prototype.update = function () {
  this.visible = $gameVariables._clShowTimeWindow;
  if (this.visible) {
    let time = Community.Lighting.time($gameVariables._clShowTimeWindowSeconds);
    let textWidth = this.textWidth(time);
    this.contents.clear();
    this.resetTextColor();
    this.drawTextEx(time, this.contents.width - textWidth - this.textPadding(), 0);
  }
};
Community.Lighting.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  Community.Lighting.Scene_Map_createAllWindows.call(this);
  this.createTimeWindow();
};
Scene_Map.prototype.createTimeWindow = function () {
  this._timeWindow = new Window_TimeOfDay();
  this.addWindow(this._timeWindow);
};
Community.Lighting.Spriteset_Map_prototype_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function () {
  Community.Lighting.Spriteset_Map_prototype_createLowerLayer.call(this);
  this.createLightmask();
};

if (typeof require !== "undefined" && typeof module != "undefined") {
  module.exports = {
    Community,
    Game_Player,
    Game_Variables,
  };
}
