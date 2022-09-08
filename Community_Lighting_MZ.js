//=============================================================================
// Community Plugins - MZ Lighting system
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
  } = require("../rmmz_objects");
  var {
    PluginManager,
    BattleManager,
    ConfigManager,
  } = require("../rmmz_managers");
  var { Window_Selectable, Window_Options } = require("../rmmz_windows");
  var { Spriteset_Map, Spriteset_Battle } = require("../rmmz_sprites");
  var { Scene_Map } = require("../rmmz_scenes");
  var { Bitmap, Tilemap} = require("../rmmz_core");
}
var Community = Community || {};
Community.Lighting = Community.Lighting || {};
Community.Lighting.name = "Community_Lighting_MZ";
Community.Lighting.parameters = PluginManager.parameters(Community.Lighting.name);
Community.Lighting.version = 4.6;
var Imported = Imported || {};
Imported[Community.Lighting.name] = true;
/*:
* @target MZ
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
* @param Triangular flashlight
* @parent ---General Settings---
* @desc Alternative triangular flashlight beam
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
* @----------------------------
*
* @command masterSwitch
* @text Plugin On/Off
* @desc Enable or disable all lighting effects from this plugin
*
* @arg enabled
* @text Enabled
* @type boolean
* @on Enable
* @off Disable
* @default true
*
* @----------------------------
*
* @command resetLightSwitches
* @text Reset Light Switches
* @desc Reset all light switches
*
* @----------------------------
*
* @command activateById
* @text Activate Light By ID
* @desc Turn an event's light on or off on the current map.
*
* @arg id
* @text Event ID
* @desc This is an ID you assigned via note tag, as in <cl: light 150 #fff myIdHere> not an event's id number
* @type text
*
* @arg enabled
* @text Active
* @type boolean
* @on Enable
* @off Disable
* @default true
*
* @----------------------------
*
* @command lightColor
* @text Light Color By ID
* @desc Change an event's light color on the current map.
*
* @arg id
* @text Event ID
* @desc This is an ID you assigned via note tag, as in <cl: light 150 #fff myIdHere> not an event's id number
* @type text
*
* @arg color
* @text Color
* @desc Light color in #RRGGBB format. Use 'defaultcolor' to choose the event's original light color.
* @type text
* @default #ffffff
*
* @----------------------------
*
* @command playerLightRadius
* @text Player Light Radius
* @desc Change the player's light radius
*
* @arg radius
* @text Radius
* @type number
* @min 0
* @default 0
*
* @arg color
* @text Color
* @type text
* @default #ffffff
*
* @arg brightness
* @text Brightness
* @type number
* @min 0
* @default 0
*
* @arg fadeSpeed
* @text fadeSpeed
* @desc Light fade speed (0 = instant)
* @type number
* @default 0
*
* @----------------------------
*
* @command setFire
* @text Set Fire Flicker
* @desc Alters the flickering of "Fire" type lights
*
* @arg radiusShift
* @text Flicker Radius
* @type number
* @min 0
* @default 0
*
* @arg redYellowShift
* @text Color Shift Intensity
* @type number
* @min 0
* @default 0
*
* @----------------------------
*
* @command flashlight
* @text Player Flashlight
* @desc Turn the player's flashlight on or off
*
* @arg enabled
* @text On/Off
* @desc If set to "off" then the other plugin parameters will be ignored
* @type boolean
* @on On
* @off Off
* @default false
*
* @arg beamLength
* @text Beam Length
* @type number
* @min 0
* @default 8
*
* @arg beamWidth
* @text Beam Width
* @type number
* @min 0
* @default 12
*
* @arg color
* @text Beam Color
* @type text
* @default #ffffff
*
* @arg density
* @text Beam Density
* @type number
* @min 0
* @default 3
*
* @----------------------------
*
* @command setTimeSpeed
* @text Time Speed
* @desc Sets the speed of the day/night cycle
*
* @arg speed
* @text Speed
* @type number
* @desc Set to 0 to stop time, or enter a number between 1-4999, with lower being faster.
* @min 0
* @max 4999
* @default 0
*
* @----------------------------
*
* @command setTime
* @text Time Set (HH:MM)
* @desc Adjusts the current time of day
*
* @arg hours
* @text Hours
* @type text
* @desc A value between 0 and (numberOfDays - 1).  This value is processed as an eval.  Variable shortcut: v[1], v[2], etc
* @default 0
*
* @arg minutes
* @text Minutes
* @type text
* @desc A value between 0 and 59.  This value is processed as an eval.  Variable shortcut: v[1], v[2], etc
* @min 0
* @default 0
*
* @arg mode
* @text Mode
* @desc Set, add, or subtract time
* @type select
* @option Set
* @value set
* @option Add
* @value add
* @option Subtract
* @value subtract
* @default set
*
* @----------------------------
*
* @command setHourColor
* @text Set Color For Hour
* @desc Assigns the specified color in #RRGGBB format to the specified hour
*
* @arg hour
* @text Hour
* @type number
* @min 0
* @default 0
*
* @arg color
* @text Color
* @type text
* @default #ffffff
*
* @----------------------------
*
* @command setHoursInDay
* @text Set Nours In Day
* @desc Sets the current number of hours in a day
*
* @arg hours
* @text Hours
* @type number
* @min 0
* @default 24
*
* @----------------------------
*
* @command showTime
* @text Show Time
* @desc Displays the current time in the upper right corner of the map screen
*
* @arg enabled
* @text Enabled
* @desc Show/hide the time
* @type boolean
* @on Show
* @off Hide
* @default false
*
* @arg showSeconds
* @text Show Seconds
* @desc Show/hide the seconds digit
* @type boolean
* @on Show
* @off Hide
* @default false
*
* @----------------------------
*
* @command setTint
* @text Set Tint
* @desc Sets the current map tint, or battle tint if in battle
*
* @arg color
* @text Tint Color
* @desc #RRGGBB format or leave blank to set the tint based on the current time of day
* @type text
* @default #888888
*
* @arg fadeSpeed
* @text Fade Speed
* @desc Speed (0-20) in which the tint transitions (0=instant, 20=very slow)
* @type number
* @min 0
* @max 20
* @default 0
*
* @----------------------------
*
* @command resetBattleTint
* @text Reset Battle Tint
* @desc Reset the battle screen to its original color
*
* @arg fadeSpeed
* @text Fade Speed
* @desc Speed (0-20) in which the tint transitions (0=instant, 20=very slow)
* @type number
* @min 0
* @max 20
* @default 0
*
* @----------------------------
*
* @command tileLight
* @text Tile-Based Lighting
* @desc Assigns lighting to a particular region or terrain ID
*
* @arg tileType
* @text Tile ID Type
* @type select
* @option Terrain
* @value terrain
* @option Region
* @value region
* @default region
*
* @arg lightType
* @text Light Type
* @type select
* @option Light
* @value light
* @option Fire
* @value fire
* @option Glow
* @value glow
* @default light
*
* @arg id
* @text ID
* @desc Region ID (1-255) or Terrain Tag ID (1-7)
* @type number
* @min 1
* @max 255
* @default 1
*
* @arg enabled
* @text On/Off
* @desc Turn this tile's light on or off
* @type boolean
* @on On
* @off Off
* @default true
*
* @arg color
* @text Color
* @desc Color in #RRGGBB format
* Note: "Block" will filter all light at #000000 or allow specified colors through otherwise
* @type text
* @default #ffffff

* @arg radius
* @text Light Radius
* @desc Radius of tile light
* @type number
* @min 0
* @max 999999
* @default 0
*
* @arg brightness
* @text Brightness
* @desc Brightness of tile light
* @type number
* @min 0
* @default 0
*
* @----------------------------
*
* @command tileBlock
* @text Tile-Based Light Blocking
* @desc Assigns light blocking effect to a particular region or terrain ID
*
* @arg tileType
* @text Tile ID Type
* @type select
* @option Terrain
* @value terrain
* @option Region
* @value region
* @default region
*
* @arg id
* @text ID
* @desc Region ID (1-255) or Terrain Tag ID (1-7)
* @type number
* @min 1
* @max 255
* @default 1
*
* @arg enabled
* @text On/Off
* @desc Turn this tile's light on or off
* @type boolean
* @on On
* @off Off
* @default true
*
* @arg color
* @text Color
* @desc Color in #RRGGBB format
* Note: "Block" will filter all light at #000000 or allow specified colors through otherwise
* @type text
* @default #000000

* @arg shape
* @text Shape
* @desc Shape of blocking effect
* @type select
* @option Full
* @value 0
* @option Square
* @value 1
* @option Oval
* @value 2
* @default 0
*
* @arg xOffset
* @text X Offset
* @type number
* @min -99999
* @max 99999
* @default 0

* @arg yOffset
* @text Y Offset
* @type number
* @min -99999
* @max 99999
* @default 0
*
* @arg blockWidth
* @text Width
* @type number
* @min -99999
* @max 99999
* @default 48
*
* @arg blockHeight
* @text Height
* @type number
* @min -99999
* @max 99999
* @default 48
*
* @----------------------------
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
* Flashlight [bl] [bw] [c] [onoff] [sdir|angle] [x] [y] [id]
* - Sets the light as a flashlight with beam length (bl) beam width (bw) color (c),
*      0|1 (onoff), and 1=up, 2=right, 3=down, 4=left for static direction (sdir)
* - bl:       Beam length:  Any number, optionally preceded by "L", so 8, L8
* - bw:       Beam width:  Any number, optionally preceded by "W", so 12, W12
* - cycle     Allows any number of color + duration pairs to follow that will be
*             cycled through before repeating from the beginning:
*             <cl: Flashlight l8 w12 cycle #f00 15 #ff0 15 #0f0 15 on someId d3>
*             There's no limit to how many colors can be cycled. [optional]
* - onoff:    Initial state:  0, 1, off, on
* - sdir:     Forced direction (optional): 0:auto, 1:up, 2:right, 3:down, 4:left
*             Can be preceded by "D", so D4.  If omitted, defaults to 0
* - angle:    Forced direction in degrees (optional): must be preceded by "A". If
*             omitted, sdir is used.
* - x         x[offset] Work the same as regular light [optional]
* - y         y[offset] [optional]
* - day       Sets the event's light to only show during the day [optional]
* - night     Sets the event's light to only show during night time [optional]
* - id        1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*             Those should not begin with 'a', 'd', 'x' or 'y' otherwise
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
* - speed     Optional parameter to alter the speed at which time passes.
*             10 is the default speed, higher numbers are slower, lower
*             numbers are faster, and 0 stops the flow of time entirely.
*             If speed is not specified, then the current speed is used.
*
* TileLight id ON c r
* RegionLight id ON c r
* - Turns on lights for tile tag or region tag (id) using color (c) and radius (r)
* - Replace ON with OFF to turn them off
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
* Set Tint [c] [s]
* - Sets or fades the battle screen to the color (c)
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - Automatically set too dark color to '#666666' (dark gray).
*
* Reset Battle Tint [s]
* - Resets or fades the battle screen to its original color.
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
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

Number.prototype.is = function() {
  return [...arguments].includes(Number(this));
}

String.prototype.equalsIC = function() {
  return [...arguments].map(s => s.toLowerCase()).includes(this.toLowerCase());
}

let isRMMZ = () => Utils.RPGMAKER_NAME === "MZ";
let isRMMV = () => Utils.RPGMAKER_NAME === "MV";

function orNullish() {
  for (let i = 0; i < arguments.length; i++) {
    if(arguments[i] != null)
      return arguments[i];
  }
}

function orNaN() {
  for (let i = 0; i < arguments.length; i++) {
    if(!isNaN(arguments[i]))
      return arguments[i];
  }
}

let isValidColorRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^#[0-9A-F]{8}$)/i;

function orValidColor() {
  for (let i = 0; i < arguments.length; i++) {
    if(arguments[i] && isValidColorRegex.test(arguments[i].trim()))
      return arguments[i];
  }
}

(function ($$) {
  let isOn = (x) => x.toLowerCase() === "on";
  let isOff = (x) => x.toLowerCase() === "off";
  let isActivate = (x) => x.toLowerCase() === "activate";
  let isDeactivate = (x) => x.toLowerCase() === "deactivate";

  // Map community light directions to polar angles (360 degrees)
  const CLDirectionMap = {
    0: undefined,       // auto
    1: 3 * Math.PI / 2, // up
    2: 2 * Math.PI,     // right
    3: Math.PI / 2,     // down
    4: Math.PI          // left
  };

  // Map RM directions to polar angles (360 degrees)
  const RMDirectionMap = {
    1: 3 * Math.PI / 4, // down-left
    2: Math.PI / 2,     // down
    3: Math.PI / 4,     // down-right
    4: Math.PI,         // left
    6: 2 * Math.PI,     // right
    7: 5 * Math.PI / 4, // up-left
    8: 3 * Math.PI / 2, // up
    9: 7 * Math.PI / 4  // up-right
  };

  const TileType = {
    Terrain: 1, terrain: 1, 1: 1,
    Region: 2,  region:  2, 2: 2
  };

  const LightType = {
    Light     : 1, light     : 1, 1: 1,
    Fire      : 2, fire      : 2, 2: 2,
    Flashlight: 3, flashlight: 3, 3: 3,
    Glow      : 4, glow      : 4, 4: 4
  };

  const TileLightType = {
    tilelight:   [TileType.Terrain,   LightType.Light],
    tilefire:    [TileType.Terrain,   LightType.Fire],
    tileglow:    [TileType.Terrain,   LightType.Glow],
    regionlight: [TileType.Region, LightType.Light],
    regionfire:  [TileType.Region, LightType.Fire],
    regionglow:  [TileType.Region, LightType.Glow],
  };

  const TileBlockType = {
    tileblock:   TileType.Terrain,
    regionblock: TileType.Region
  };

  class TileLight {
    constructor(tileType, lightType, id, onoff, color, radius, brightness) {
      this.tileType   = TileType[tileType];
      this.lightType  = LightType[lightType];
      this.id         = +id || 0;
      this.enabled    = isOn(onoff);
      this.color      = $$.validateColor(color, "#ffffff");
      this.radius     = +radius || 0;
      this.brightness = brightness && (brightness.substr(1, brightness.length) / 100).clamp(0, 1) || $$.defaultBrightness || 0;
    }
  };

  class TileBlock {
    constructor(tileType, id, onoff, color, shape, xOffset, yOffset, blockWidth, blockHeight) {
      this.tileType    = TileType[tileType];
      this.id          = +id || 0;
      this.enabled     = isOn(onoff);
      this.color       = $$.validateColor(color, "#ffffff");
      this.shape       = +shape || 0;
      this.xOffset     = +xOffset || 0;
      this.yOffset     = +yOffset || 0;
      this.blockWidth  = +blockWidth || 0;
      this.blockHeight = +blockHeight || 0;
    }
  };

  let Community_tint_speed = 60;
  let Community_tint_target = '#000000';
  let colorcycle_count = [1000];
  let colorcycle_timer = [1000];
  let eventObjId = [];
  let event_id = [];
  let event_stacknumber = [];
  let event_eventcount = 0;
  let light_tiles = [];
  let block_tiles = [];

  let parameters = $$.parameters;
  let lightMaskPadding = Number(parameters["Lightmask Padding"]) || 0;
  let useSmootherLights = eval(String(parameters['Use smoother lights'])) || false;
  let light_event_required = eval(parameters["Light event required"]) || false;
  let triangular_flashlight = eval(parameters["Triangular flashlight"]) || false;
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
  if (!battleMaskPosition.equalsIC('Above', 'Between')) {
    battleMaskPosition = 'Above'; //Get rid of any invalid value
  }

  let options_lighting_on = true;
  let maxX = (Number(parameters['Screensize X']) || 816) + 2 * lightMaskPadding;
  let maxY = Number(parameters['Screensize Y']) || 624;
  let battleMaxX = maxX;
  let battleMaxY = maxY;
  if (isRMMZ()) battleMaxY += 24; // Plus 24 for RMMZ Spriteset_Battle.prototype.battleFieldOffsetY
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
    this._clType = LightType[tagData.shift()];

    // Handle parsing of light and fire
    if (this._clType && this._clType.is(LightType.Light, LightType.Fire)) {
      this._clRadius = undefined;
      for (let x of tagData) {
        if (!isNaN(+x) && this._clRadius === undefined) this._clRadius = +x;
        else if (x.equalsIC("cycle") && this._clColor === undefined) this._clCycle = [];
        else if (this._clCycle && !needsCycleDuration && x[0].equalsIC("#")) {
          this._clCycle.push({ "color": $$.validateColor(x), "duration": 1 });
          needsCycleDuration = true;
        }
        else if (this._clCycle && needsCycleDuration && !isNaN(+x)) {
          this._clCycle[this._clCycle.length - 1].duration = +x || 1;
          needsCycleDuration = false;
        }
        else if (x[0].equalsIC("#") && this._clColor === undefined) this._clColor = $$.validateColor(x);
        else if (x[0].equalsIC("b") && this._clBrightness === undefined) {
          this._clBrightness = Number(+(x.substr(1, x.length)) / 100).clamp(0, 1);
        }
        else if (x.equalsIC("night", "day") && this._clSwitch === undefined) this._clSwitch = x;
        else if (x[0].equalsIC("d") && this._clDirection === undefined) this._clDirection = +(x.substr(1, x.length));
        else if (x[0].equalsIC("x") && this._clXOffset === undefined) this._clXOffset = +(x.substr(1, x.length));
        else if (x[0].equalsIC("y") && this._clYOffset === undefined) this._clYOffset = +(x.substr(1, x.length));
        else if (x.length > 0 && this._clId === undefined) this._clId = x;
      }
    }
    // Handle parsing of flashlight
    else if (this._clType && this._clType.is(LightType.Flashlight)) {
      this._clBeamLength = undefined;
      this._clBeamWidth = undefined;
      this._clOnOff = undefined;
      this._clFlashlightDirection = undefined;
      this._clRadius = 1;
      for (let x of tagData) {
        if (!isNaN(+x) && this._clBeamLength === undefined) this._clBeamLength = +x;
        else if (!isNaN(+x) && this._clBeamWidth === undefined) this._clBeamWidth = +x;
        else if (x[0].equalsIC("l") && this._clBeamLength === undefined) this._clBeamLength = this._clBeamLength = +(x.substr(1, x.length));
        else if (x[0].equalsIC("w") && this._clBeamWidth === undefined) this._clBeamWidth = this._clBeamWidth = +(x.substr(1, x.length));
        else if (x.equalsIC("cycle") && this._clColor === undefined) this._clCycle = [];
        else if (this._clCycle && !needsCycleDuration && x[0].equalsIC("#")) {
          this._clCycle.push({ "color": $$.validateColor(x), "duration": 1 });
          needsCycleDuration = true;
        }
        else if (this._clCycle && needsCycleDuration && !isNaN(+x)) {
          this._clCycle[this._clCycle.length - 1].duration = +x || 1;
          needsCycleDuration = false;
        }
        else if (x[0].equalsIC("#") && this._clBeamColor === undefined) this._clColor = $$.validateColor(x);
        else if (!isNaN(+x) && this._clOnOff === undefined) this._clOnOff = +x;
        else if (!isNaN(+x) && this._clFlashlightDirection === undefined) this._clFlashlightDirection = +x;
        else if (isOn(x) && this._clOnOff === undefined) this._clOnOff = 1;
        else if (isOff(x) && this._clOnOff === undefined) this._clOnOff = 0;
        else if (x.equalsIC("night", "day") && this._clSwitch === undefined) this._clSwitch = x;
        else if (x[0].equalsIC("d") && this._clFlashlightDirection === undefined) this._clFlashlightDirection = CLDirectionMap[+(x.substr(1, x.length))];
        else if (x[0].equalsIC("a") && this._clFlashlightDirection === undefined) this._clFlashlightDirection = Math.PI/180*+(x.substr(1, x.length));
        else if (x[0].equalsIC("x") && this._clXOffset === undefined) this._clXOffset = +(x.substr(1, x.length));
        else if (x[0].equalsIC("y") && this._clYOffset === undefined) this._clYOffset = +(x.substr(1, x.length));
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
    this._clFlashlightDirection = this._clFlashlightDirection || undefined; // Must be undefined.
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
      if (type.is(LightType.Flashlight) && this._clOnOff === 1) result = true;
      else result = true;
    }
    else (result = this._clSwitch.equalsIC("night") && $$.isNight())
      || (result = this._clSwitch.equalsIC("day") && !$$.isNight())
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
    if (typeof command !== 'undefined') {
      this.communityLighting_Commands(command, args);
    }
  };

  let _Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;

  Game_Player.prototype.clearTransferInfo = function () {
    _Game_Player_clearTransferInfo.call(this);
    if (reset_each_map) {
      $gameVariables.SetLightArray({});
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
      tileblock: 'addTileBlock', regionblock: 'addTileBlock', tilelight: 'addTileLight', regionlight: 'addTileLight', tilefire: 'addTileLight', regionfire: 'addTileLight',
      tileglow: 'addTileLight', regionglow: 'addTileLight', tint: 'tint', daynight: 'dayNight', flashlight: 'flashLight', setfire: 'setFire', fire: 'fire', light: 'light',
      script: 'scriptF', reload: 'reload', tintbattle: 'tintbattle'
    };
    const result = allCommands[command];
    if (result) {
      this[result](command, args);
    }
  };

  (function () { // don't pollute the namespace.
    let mapOnOff    = (args) => args.enabled === "true" ? "on" : "off";

    let tileType = (args) => (args.tileType === "terrain" ? "tile" : "region") + (args.lightType ? args.lightType : "block");
    let tintType = (    ) => $gameParty.inBattle() ? "tintbattle" : "tint";

    let tintMode = (args) => args.color ? "set" : "reset";
    let mathMode = (args) => args.mode === "set" ? "hour" : args.mode; // set, add, or subtract.
    let showMode = (args) => args.enabled.equalsIC("true") ? (args.showSeconds.equalsIC("true") ? "showseconds" : "show") : "hide";
    let radMode  = (args) => +args.fadeSpeed ? "radiusgrow" : "radius";

    let reg = PluginManager.registerCommand.bind(PluginManager, $$.name); // registar bound with first parameter.
    let f = (cmd, args) => $gameMap._interpreter.communityLighting_Commands(cmd, args.filter(_ => _ !== "")); //command wrapper.

    reg("masterSwitch",       (a)  => f("script",     [mapOnOff(a)]));
    reg("tileBlock",          (a)  => f(tileType(a),  [a.id,            mapOnOff(a),     a.color,        a.shape,          a.xOffset, a.yOffset, a.blockWidth, a.blockHeight]));
    reg("tileLight",          (a)  => f(tileType(a),  [a.id,            mapOnOff(a),     a.color,        a.radius,         a.brightness]));
    reg("setTint",            (a)  => f(tintType(),   [tintMode(a),     a.color,         a.fadeSpeed]));
    reg("setTimeSpeed",       (a)  => f("dayNight",   ["speed",         a.speed]));
    reg("setTime",            (a)  => f("dayNight",   [mathMode(a),     a.hours,         a.minutes]));
    reg("setHoursInDay",      (a)  => f("dayNight",   ["hoursinday",    a.hours]));
    reg("showTime",           (a)  => f("dayNight",   [showMode(a)]));
    reg("setHourColor",       (a)  => f("dayNight",   ["color", a.hour, a.color]));
    reg("flashlight",         (a)  => f("flashLight", [mapOnOff(a),     a.beamLength,    a.beamWidth,    a.color,          a.density]));
    reg("setFire",            (a)  => f("setFire",    [a.radiusShift,   a.colorShift]));
    reg("playerLightRadius",  (a)  => f("light",      [radMode(a),      a.radius,        a.color,        "B"+a.brightness, a.fadeSpeed]));
    reg("activateById",       (a)  => f("light",      [mapOnOff(a),     a.id]));
    reg("lightColor",         (a)  => f("light",      ["color",         a.id,            a.color]));
    reg("resetLightSwitches", ( )  => f("light",      ["switch",        "reset"]));
    reg("resetBattleTint",    (a)  => f("tintbattle", ["reset",         a.fadeSpeed]));
  })();

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.addTileLight = function (command, args) {
    let tilearray = $gameVariables.GetTileLightArray();
    let [tileType, lightType] = TileLightType[command] || [undefined, undefined];
    let [id, enabled, color, radius, brightness] = args;
    let tile = new TileLight(tileType, lightType, id, enabled, color, radius, brightness);
    let index = tilearray.findIndex(e => e.tileType === tile.tileType && e.lightType === tile.lightType && e.id === tile.id);
    index === -1 ? tilearray.push(tile) : tilearray[index] = tile;
    $gameVariables.SetTileLightArray(tilearray);
    $$.ReloadTagArea();
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.addTileBlock = function (command, args) {
    let tilearray = $gameVariables.GetTileBlockArray();
    let tileType = TileBlockType[command];
    let [id, enabled, color, shape, xOffset, yOffset, blockWidth, blockHeight] = args;
    let tile = new TileBlock(tileType, id, enabled, color, shape, xOffset, yOffset, blockWidth, blockHeight);
    let index = tilearray.findIndex(e => e.tileType === tile.tileType && e.id === tile.id);
    index === -1 ? tilearray.push(tile) : tilearray[index] = tile;
    $gameVariables.SetTileBlockArray(tilearray);
    $$.ReloadTagArea();
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
    if (isDeactivate(args[0]) || (isOff(args[0]) && args.length == 1)) {
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
    if (isDeactivate(args[0]) || (isOff(args[0]) && args.length == 1)) {
      $gameVariables.SetScriptActive(false);
    } else {
      $gameVariables.SetScriptActive(true);
    }
    $$.fireLight(args);
  };

  Game_Interpreter.prototype.scriptF = function (command, args) {
    if (isDeactivate(args[0]) || (isOff(args[0]) && args.length == 1)) {
      $gameVariables.SetScriptActive(false);
    } else if (isActivate(args[0]) || (isOn(args[0]) && args.length == 1)) {
      $gameVariables.SetScriptActive(true);
    }
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.reload = function (command, args) {
    if (args[0].equalsIC("events")) {
      $$.ReloadMapEvents();
    }
  };

  Game_Interpreter.prototype.tintbattle = function (command, args) {
    if ($gameParty.inBattle()) {
      let cmd = args[0].trim().toLowerCase();
      if (cmd.equalsIC("set", 'fade')) {
        $gameTemp._BattleTintFade = $gameTemp._BattleTint;
        $gameTemp._BattleTintTimer = 0;
        $gameTemp._BattleTint = this.determineBattleTint(args[1]);
        $gameTemp._BattleTintSpeed = +args[2] || 0;
      }
      else if (cmd.equalsIC('reset', 'daylight')) {
        $gameTemp._BattleTintTimer = 0;
        $gameTemp._BattleTint = $gameTemp._MapTint;
        $gameTemp._BattleTintSpeed = +args[1] || 0;
      }
    }
  };

  Game_Interpreter.prototype.determineBattleTint = function (tintColor) {
    if (!tintColor || tintColor.length < 7) {
      return '#666666' // Not an hex color string
    }
    let redhex = tintColor.substring(1, 3);
    let greenhex = tintColor.substring(3, 5);
    let bluehex = tintColor.substring(5);
    let red = parseInt(redhex, 16);
    let green = parseInt(greenhex, 16);
    let blue = parseInt(bluehex, 16);
    let color = red + green + blue;
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

      $$.ReloadMapEvents();  // reload map events on map change
    }

    // reload mapevents if event_data has changed (deleted or spawned events/saves)
    if (event_eventcount != $gameMap.events().length) {
      $$.ReloadMapEvents();
    }

    // remove old sprites
    for (let i = 0, len = this._sprites.length; i < len; i++) { // remove all old sprites
      this._removeSprite();
    }

    if (map_id <= 0) return;                               // No lighting on map 0
    if (options_lighting_on !== true) return;              // Plugin deactivated in the option
    if ($gameVariables.GetScriptActive() !== true) return; // Plugin deactivated by plugin command


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
      player_radius = +parameters['Player radius'];
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
    let pd = RMDirectionMap[$gamePlayer._direction];
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

    if (playerflashlight == true) {
      this._maskBitmap.radialgradientFlashlight(x1, y1, playercolor, radialColor2, pd, flashlightlength, flashlightwidth);
    }
    if (iplayer_radius > 0) {
      x1 = x1 - flashlightXoffset;
      y1 = y1 - flashlightYoffset;
      if (iplayer_radius < 100) {
        // dim the light a bit at lower lightradius for a less focused effect.
        let c = hex2rgba(playercolor);
        c.g = c.g - 50;
        c.r = c.r - 50;
        c.b = c.b - 50;
        if (c.g < 0) {
          c.g = 0;
        }
        if (c.r < 0) {
          c.r = 0;
        }
        if (c.b < 0) {
          c.b = 0;
        }
        if (c.a < 0) {
          c.a = 0;
        }
        let newcolor = rgba2hex(c.r, c.g, c.b, c.a);

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
      if (lightType) {
        let objectflicker = lightType.is(LightType.Fire);
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

            let lightarray = $gameVariables.GetLightArray();
            if (lightarray[lightid]) {
              let tcolorvalue;
              [state, tcolorvalue] = lightarray[lightid];
              if (tcolorvalue != 'defaultcolor') colorvalue = tcolorvalue;
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

            if (lightType.is(LightType.Flashlight)) {
              let ldir = RMDirectionMap[$gameMap.events()[event_stacknumber[i]]._direction] || 0;

              let tldir = cur.getLightFlashlightDirection();
              if (!isNaN(tldir)) ldir = tldir;
              this._maskBitmap.radialgradientFlashlight(lx1, ly1, colorvalue, '#000000', ldir, flashlength, flashwidth);
            } else if(lightType.is(LightType.Light, LightType.Fire)) {
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

    light_tiles = $gameVariables.GetLightTiles();
    block_tiles = $gameVariables.GetBlockTiles();

    light_tiles.forEach(tuple => {
      let [tile, x, y] = tuple;
      let x1 = (pw / 2) + (x - dx) * pw;
      let y1 = (ph / 2) + (y - dy) * ph;

      let objectflicker = tile.lightType.is(LightType.Fire);
      let tile_color = tile.color;
      if (tile.lightType.is(LightType.Glow)) {
        let c = hex2rgba(tile.color);
        c.r = Math.floor(c.r + (60 - tileglow));
        c.g = Math.floor(c.g + (60 - tileglow));
        c.b = Math.floor(c.b + (60 - tileglow));
        c.a = Math.floor(c.a + (60 - tileglow));

        if (c.r < 0) c.r = 0;
        if (c.g < 0) c.g = 0;
        if (c.b < 0) c.b = 0;
        if (c.a < 0) c.a = 0;
        if (c.r > 255) c.r = 255;
        if (c.g > 255) c.g = 255;
        if (c.b > 255) c.b = 255;
        if (c.a > 255) c.a = 255;
        tile_color = rgba2hex(c.r, c.g, c.b, c.a);
      }
      this._maskBitmap.radialgradientFillRect(x1, y1, 0, tile.radius, tile_color, '#000000', objectflicker, tile.brightness);
    });

    // Tile blocks
    ctx.globalCompositeOperation = "multiply";
    block_tiles.forEach(tuple => {
      let [tile, x, y] = tuple;
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
      if (tile.shape == 0) {
        this._maskBitmap.FillRect(x1, y1, pw, ph, tile.color);
      }
      else if (tile.shape == 1) {
        x1 = x1 + tile.xOffset;
        y1 = y1 + tile.yOffset;
        this._maskBitmap.FillRect(x1, y1, tile.blockWidth, tile.blockHeight, tile.color);
      }
      else if (tile.shape == 2) {
        x1 = x1 + tile.xOffset;
        y1 = y1 + tile.yOffset;
        this._maskBitmap.FillEllipse(x1, y1, tile.blockWidth, tile.blockHeight, tile.color);
      }
    });
    ctx.globalCompositeOperation = 'lighter';


    // *********************************** DAY NIGHT CYCLE FILTER **************************
    if ($$.daynightset) {

      let daynighttimer = $gameVariables.GetDaynightTimer();     // timer = minutes * speed
      let daynightcycle = $gameVariables.GetDaynightCycle();     // cycle = hours
      let daynighthoursinday = $gameVariables.GetDaynightHoursinDay();   // 24
      let daynightcolors = $gameVariables.GetDaynightColorArray();
      let color1 = daynightcolors[daynightcycle].color;
      let c = hex2rgba(color1);
      if (daynightspeed > 0) {
        let nextcolor = daynightcycle + 1;
        if (nextcolor >= daynighthoursinday) {
          nextcolor = 0;
        }
        let color2 = daynightcolors[nextcolor].color;
        let c2 = hex2rgba(color2);

        let stepR = (c2.r - c.r) / (60 * daynightspeed);
        let stepG = (c2.g - c.g) / (60 * daynightspeed);
        let stepB = (c2.b - c.b) / (60 * daynightspeed);
        let stepA = (c2.a - c.a) / (60 * daynightspeed);

        c.r = Math.floor(c.r + (stepR * daynighttimer));
        c.g = Math.floor(c.g + (stepG * daynighttimer));
        c.b = Math.floor(c.b + (stepB * daynighttimer));
        c.a = Math.floor(c.a + (stepA * daynighttimer));
      }
      color1 = rgba2hex(c.r, c.g, c.b, c.a);

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

        let c = hex2rgba(tint_value);
        let c2 = hex2rgba(tint_target);

        let stepR = (c2.r - c.r) / (60 * tint_speed);
        let stepG = (c2.g - c.g) / (60 * tint_speed);
        let stepB = (c2.b - c.b) / (60 * tint_speed);
        let stepA = (c2.a - c.a) / (60 * tint_speed);

        let r3 = Math.floor(c.r + (stepR * tint_timer));
        let g3 = Math.floor(c.g + (stepG * tint_timer));
        let b3 = Math.floor(c.b + (stepB * tint_timer));
        let a3 = Math.floor(c.a + (stepA * tint_timer));
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


        if (stepR >= 0 && r3 >= c2.r) {
          reddone = true;
        }
        if (stepG >= 0 && g3 >= c2.g) {
          greendone = true;
        }
        if (stepB >= 0 && b3 >= c2.b) {
          greendone = true;
        }
        if (stepA >= 0 && a3 >= c2.a) {
          alphadone = true;
        }


        // Less than

        if (stepR <= 0 && r3 <= c2.r) {
          bluedone = true;
        }
        if (stepG <= 0 && g3 <= c2.g) {
          greendone = true;
        }
        if (stepB <= 0 && b3 <= c2.b) {
          bluedone = true;
        }
        if (stepA <= 0 && a3 <= c2.a) {
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
    //context.save(); // unnecessary significant performance hit
    context.fillStyle = color1;
    context.fillRect(x1, y1, x2, y2);
    //context.restore();
    if (isRMMV()) this._setDirty(); // doesn't exist in RMMZ
  };

  // *******************  CIRCLE/OVAL SHAPE ***********************************
  /**
   * @param {Number} centerX
   * @param {Number} centerY
   * @param {Number} xradius
   * @param {Number} yradius
   * @param {String} color1
   */
  Bitmap.prototype.FillEllipse = function (centerX, centerY, xradius, yradius, color1) {
    centerX = centerX + lightMaskPadding;

    let context = this._context;
    //context.save(); // unnecessary significant performance hit
    context.fillStyle = color1;
    context.beginPath();
    context.ellipse(centerX, centerY, xradius, yradius, 0, 0, 2 * Math.PI);
    context.fill();
    //context.restore();
    if (isRMMV()) this._setDirty(); // doesn't exist in RMMZ
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
        let alpha = Math.floor(brightness * 100 * 2.55).toString(16);
        if (alpha.length < 2) {
          alpha = "0" + alpha;
        }
        this.addColorStop(0, '#FFFFFF' + alpha);
      }
    }

    if (useSmootherLights) {
      for (let distanceFromCenter = 0; distanceFromCenter < 1; distanceFromCenter += 0.1) {
        let c = hex2rgba(color1);
        let newRed = c.r - (distanceFromCenter * 100 * 2.55);
        let newGreen = c.g - (distanceFromCenter * 100 * 2.55);
        let newBlue = c.b - (distanceFromCenter * 100 * 2.55);
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

        let c = hex2rgba(color1);
        c.g = c.g + colorrnd;
        if (c.g < 0) {
          c.g = 0;
        }
        if (c.g > 255) {
          c.g = 255;
        }
        color1 = rgba2hex(c.r, c.g, c.b, c.a);
        r2 = r2 - gradrnd;
        if (r2 < 0) r2 = 0;
      }

      grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(brightness, color1, color2);

      //context.save(); // unnecessary significant performance hit
      context.fillStyle = grad;
      direction = Number(direction);
      let pw = $gameMap.tileWidth() / 2;
      let ph = $gameMap.tileHeight() / 2;
      let xS1, yS1, xE1, yE1, xS2, yS2, xE2, yE2;
      switch (direction) {
        case 0:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*2;       yE1=r2*2;       break;
        case 1:
          xS1=x1-r2;    yS1=y1-ph;    xE1=r2*2;       yE1=r2*2;       break;
        case 2:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*1+pw;    yE1=r2*2;       break;
        case 3:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*2;       yE1=r2*1+ph;    break;
        case 4:
          xS1=x1-pw;    yS1=y1-r2;    xE1=r2*2;       yE1=r2*2;       break;
        case 5:
          xS1=x1-r2;    yS1=y1-ph;    xE1=r2*1+pw;    yE1=r2*1+ph;    break;
        case 6:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*1+pw;    yE1=r2*1+ph;    break;
        case 7:
          xS1=x1-pw;    yS1=y1-r2;    xE1=r2*1+pw;    yE1=r2*1+ph;    break;
        case 8:
          xS1=x1-pw;    yS1=y1-ph;    xE1=r2*1+pw;    yE1=r2*1+ph;    break;
        case 9:
          xS1=x1-r2;    yS1=y1-ph;    xE1=r2*2;       yE1=r2*2;
          xS2=x1-r2;    yS2=y1-r2;    xE2=r2*1-pw;    yE2=r2*1-ph;    break;
        case 10:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*2;       yE1=r2*1+ph;
          xS2=x1-r2;    yS2=y1+pw;    xE2=r2*1-pw;    yE2=r2*1-ph;    break;
        case 11:
          xS1=x1-r2;    yS1=y1-r2;    xE1=r2*2;       yE1=r2*1+ph;
          xS2=x1+pw;    yS2=y1+pw;    xE2=r2*1-pw;    yE2=r2*1-ph;    break;
        case 12:
          xS1=x1-r2;    yS1=y1-ph;    xE1=r2*2;       yE1=r2*2;
          xS2=x1+pw;    yS2=y1-r2;    xE2=r2*1-pw;    yE2=r2*1-ph;    break;
      }

      context.fillRect(xS1, yS1, xE1, yE1);
      if (direction > 8)
        context.fillRect(xS2, yS2, xE2, yE2);

      //context.restore();
      if (isRMMV()) this._setDirty(); // doesn't exist in RMMZ
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
  Bitmap.prototype.radialgradientFlashlight = function (x1, y1, color1, color2, dirAngle, flashlength, flashwidth) {
    x1 = x1 + lightMaskPadding;
    x1 = x1 - flashlightXoffset;
    y1 = y1 - flashlightYoffset;

    let isValidColor = isValidColorRegex.test(color1.trim());
    if (!isValidColor) {
      color1 = '#000000'
    }
    let isValidColor2 = isValidColorRegex.test(color2.trim());
    if (!isValidColor2) {
      color2 = '#000000'
    }

    let context = this._context;

    // small dim glove around player
    //context.save(); // unnecessary significant performance hit
    let r1 = 1; let r2 = 40;
    let grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
    grad.addColorStop(0, '#999999');
    grad.addColorStop(1, color2);
    context.fillStyle = grad;
    context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);

    // flashlight
    let flashlightdensity = $gameVariables.GetFlashlightDensity();
    if (flashlightdensity >= flashwidth) flashlightdensity = flashwidth - 1;

    if (triangular_flashlight) { // Triangular flashlight
      // Compute distance to spot and flashlight density
      let distance = 3 * (flashlength * (flashlength - 1));

      // Compute spotlight radiuses
      r1 = (flashlength - 1) * flashlightdensity;
      r2 = (flashlength - 1) * flashwidth;

      // Offset so the beam begins in front of the player
      let adjustForPlayer = (6 * flashlength);

      // Compute beam start coordinates (for drawing beam)
      let xBeamStart = x1 - adjustForPlayer * Math.cos(dirAngle);
      let yBeamStart = y1 - adjustForPlayer * Math.sin(dirAngle);

      // Compute beam distance (for drawing beam)
      let beamDistance = distance + adjustForPlayer;

      // Compute beam width based off of angle (for drawing beam)
      let beamWidth = Math.atan(0.70 * r2 / beamDistance); // 70% of spot outer radius.

      // Compute beam angles
      let beamAngleStart = dirAngle - beamWidth;
      let beamAngleEnd   = dirAngle + beamWidth;

      // Clear fillstyle for drawing beam
      context.fillStyle = undefined;

      // grab flashlight color
      let c = hex2rgba(color1);

      // Draw outer beam as a shadow
      context.beginPath();
      context.arc(xBeamStart, yBeamStart, beamDistance, beamAngleStart, beamAngleEnd, false);
      context.arc(xBeamStart, yBeamStart, adjustForPlayer, beamAngleEnd, beamAngleStart, true);
      context.shadowColor = rgba2hex(c.r, c.g, c.b, Math.round(0.7 * c.a));
      context.shadowBlur = 30;
      context.fill();

      // Draw inner beam as a shadow
      context.beginPath();
      context.arc(xBeamStart, yBeamStart, beamDistance, beamAngleStart, beamAngleEnd, false);
      context.arc(xBeamStart, yBeamStart, adjustForPlayer, beamAngleEnd, beamAngleStart, true);
      context.shadowColor = rgba2hex(c.r, c.g, c.b,  Math.round(0.1 * c.a));
      context.shadowBlur = 2;
      context.fill();

      // Clear shadow style
      context.shadowColor = "";
      context.shadowBlur = 0;

      // Compute spot location
      x1 += distance * Math.cos(dirAngle);
      y1 += distance * Math.sin(dirAngle);

      // Draw spot
      grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(0, color1, color2);
      context.fillStyle = grad;
      context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
      context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
    } else { // Circular flashlight
      // Compute diagonal length scalars.
      let xScalar = Math.cos(dirAngle);
      let yScalar = Math.sin(dirAngle);

      // Draw spots
      for (let cone = 0; cone < flashlength; cone++) {
        r1 = cone * flashlightdensity;
        r2 = cone * flashwidth;
        x1 = x1 + cone * 6 * xScalar; // apply scalars.
        y1 = y1 + cone * 6 * yScalar;
        grad = context.createRadialGradient(x1, y1, r1, x1, y1, r2);
        grad.addTransparentColorStops(0, color1, color2);
        context.fillStyle = grad;
        context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
      }
      context.fillStyle = grad;
      context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
    }

    //context.restore();
    if (isRMMV()) this._setDirty(); // doesn't exist in RMMZ
  };


  /**
   *
   * @param {String} hex
   * @returns {{r:number,g:number,b:number,a:number}}
   */
  function hex2rgba(hex) {
    let regex = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
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
    $$._MapTint = '#FFFFFF';                                          // By default, no darkness during battle
    if (!DataManager.isBattleTest() && !DataManager.isEventTest() && $gameMap.mapId() >= 0) { // If we went there from a map...
      if ($gameVariables.GetScriptActive() === true) {                                        // If the script is active...
        if (options_lighting_on && lightInBattle) {                                           // If configuration autorise using lighting effects
          if (eventObjId.length > 0) {                                                        // If there is lightsource on this map...
            $gameTemp._MapTint = $gameVariables.GetTint();                                    // ... Use the tint of the map.
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
    if (battleMaskPosition.equalsIC('Above')) {
      this.createBattleLightmask();
    }
  };

  let Community_Lighting_Spriteset_Battle_createBattleField = Spriteset_Battle.prototype.createBattleField;
  Spriteset_Battle.prototype.createBattleField = function () {
    Community_Lighting_Spriteset_Battle_createBattleField.call(this);
    if (battleMaskPosition.equalsIC('Between')) {
      this.createBattleLightmask();
    }
  };

  Spriteset_Battle.prototype.createBattleLightmask = function () {
    if ($gameVariables.GetScriptActive()) {             // If the script is active
      if (lightInBattle) {                              // If is active during battles.
        this._battleLightmask = new BattleLightmask();  // ... Create the light mask.
        if (battleMaskPosition.equalsIC('Above')) {
          this.addChild(this._battleLightmask);
        } else if (battleMaskPosition.equalsIC('Between')) {
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

    let redhex = $gameTemp._MapTint.substring(1, 3);
    let greenhex = $gameTemp._MapTint.substring(3, 5);
    let bluehex = $gameTemp._MapTint.substring(5);
    let red = parseInt(redhex, 16);
    let green = parseInt(greenhex, 16);
    let blue = parseInt(bluehex, 16);
    let color = red + green + blue;
    if (color < 200 && red < 66 && green < 66 && blue < 66) {
      $gameTemp._MapTint = '#666666' // Prevent the battle scene from being too dark.
    }
    $gameTemp._BattleTint = $$.daynightset ? $gameVariables.GetTintByTime() : $gameTemp._MapTint;
    this._maskBitmap.FillRect(-lightMaskPadding, 0, battleMaxX + lightMaskPadding, battleMaxY, $gameTemp._BattleTint);
    $gameTemp._BattleTintSpeed = 0;
  };

  //@method _createBitmaps

  BattleLightmask.prototype._createBitmap = function () {
    this._maskBitmap = new Bitmap(battleMaxX + lightMaskPadding, battleMaxY);   // one big bitmap to fill the intire screen with black
  };

  BattleLightmask.prototype.update = function () {
    let color1 = $gameTemp._BattleTint;
    if ($gameTemp._BattleTintSpeed > 0) {

      $gameTemp._BattleTintTimer += 1;

      let c = hex2rgba($gameTemp._BattleTintFade);
      let c2 = hex2rgba($gameTemp._BattleTint);

      let stepR = (c2.r - c.r) / (60 * $gameTemp._BattleTintSpeed);
      let stepG = (c2.g - c.g) / (60 * $gameTemp._BattleTintSpeed);
      let stepB = (c2.b - c.b) / (60 * $gameTemp._BattleTintSpeed);
      let stepA = (c2.a - c.a) / (60 * $gameTemp._BattleTintSpeed);

      let r3 = Math.floor(c.r + (stepR * $gameTemp._BattleTintTimer));
      let g3 = Math.floor(c.g + (stepG * $gameTemp._BattleTintTimer));
      let b3 = Math.floor(c.b + (stepB * $gameTemp._BattleTintTimer));
      let a3 = Math.floor(c.a + (stepA * $gameTemp._BattleTintTimer));
      if (r3 < 0) { r3 = 0 }
      if (g3 < 0) { g3 = 0 }
      if (b3 < 0) { b3 = 0 }
      if (a3 < 0) { a3 = 0 }
      if (r3 > 255) { r3 = 255 }
      if (g3 > 255) { g3 = 255 }
      if (b3 > 255) { b3 = 255 }
      if (a3 > 255) { a3 = 255 }
      let reddone = false;
      let greendone = false;
      let bluedone = false;
      let alphadone = false;
      if (stepR >= 0 && r3 >= c2.r) {
        reddone = true;
      }
      if (stepR <= 0 && r3 <= c2.r) {
        reddone = true;
      }
      if (stepG >= 0 && g3 >= c2.g) {
        greendone = true;
      }
      if (stepG <= 0 && g3 <= c2.g) {
        greendone = true;
      }
      if (stepB >= 0 && b3 >= c2.b) {
        bluedone = true;
      }
      if (stepB <= 0 && b3 <= c2.b) {
        bluedone = true;
      }
      if (stepA >= 0 && a3 >= c2.a) {
        alphadone = true;
      }
      if (stepA <= 0 && a3 <= c2.a) {
        alphadone = true;
      }
      if (reddone == true && bluedone == true && greendone == true && alphadone) {
        $gameTemp._BattleTintFade = $gameTemp._BattleTint;
        $gameTemp._BattleTintSpeed = 0;
        $gameTemp._BattleTintTimer = 0;
      }
      color1 = rgba2hex(r3, g3, b3, a3);
      $gameTemp._BattleTintFade = color1;
    }
    this._maskBitmap.FillRect(-lightMaskPadding, 0, battleMaxX + lightMaskPadding, battleMaxY, color1);
    this._maskBitmap._baseTexture.update(); // Required to update battle texture in RMMZ optional for RMMV
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
  Game_Interpreter.prototype.command203 = function (params) { // API change in RMMZ
    Alias_Game_Interpreter_command203.call(this, params); // extra parameter is ignored by RMMV
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
    event_stacknumber = [];
    event_eventcount = $gameMap.events().length;

    for (let i = 0; i < event_eventcount; i++) {
      if ($gameMap.events()[i]) {
        if ($gameMap.events()[i].event() && !$gameMap.events()[i]._erased) {
          let note = $gameMap.events()[i].getCLTag();

          let note_args = note.split(" ");
          let note_command = LightType[note_args.shift().toLowerCase()];
          if (note_command) {
            eventObjId.push(i);
            event_id.push($gameMap.events()[i]._eventId);
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
          $gameMap._interpreter.addTileLight("regionfire", data);
        }
        else if ((/^RegionGlow/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionglow", data);
        }
        else if ((/^RegionLight/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionlight", data);
        }
        else if ((/^RegionGlow/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionglow", data);
        }
        else if ((/^RegionBlock/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileBlock("regionblock", data);
        }
        else if ((/^tint/i).test(mapnote)) {

          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          if (typeof $$.mapBrightness === "undefined") {
            $$.tint(data);
          }
          else {
            let color = data[1];
            let c = hex2rgba(color);
            if (c.a == 255) {
              c.a = $$.mapBrightness;
            }
            data[1] = rgba2hex(c.r, c.g, c.b, c.a);
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
            let c = hex2rgba(color);
            let value = Math.max(0, Math.min(Number(brightness[0], 100)));
            let alphaNum = Math.floor(value * 2.55);
            let trueColor = rgba2hex(c.r, c.g, c.b, alphaNum);
            $$.tint(["set", trueColor]);
            $$.mapBrightness = alphaNum;
          }
        }
      }
    })
  };


  $$.ReloadTagArea = function () {
    // *************************** TILE TAG LIGHTSOURCES & BLOCKS *********

    // clear arrays
    light_tiles = [];
    block_tiles = [];

    function UpdateTiles(tileArray, onArray) {
      tileArray.filter(tile => tile.enabled).forEach(tile => {
        for (let y = 0, mapHeight = $dataMap.height; y < mapHeight; y++) {
          for (let x = 0, mapWidth = $dataMap.width; x < mapWidth; x++) {
            let tag = 0;
            if (tile.tileType == TileType.Terrain)
              tag = $gameMap.terrainTag(x, y);
            else if (tile.tileType == TileType.Region)
              tag = $gameMap.regionId(x, y);
            if (tag == tile.id)
              onArray.push([tile, x, y]);
          }
        }
      });
    }

    UpdateTiles($gameVariables.GetTileLightArray(), light_tiles);
    $gameVariables.SetLightTiles(light_tiles);

    UpdateTiles($gameVariables.GetTileBlockArray(), block_tiles);
    $gameVariables.SetBlockTiles(block_tiles);
  };

  /**
   *
   * @param {String[]} args
   */
  $$.flashlight = function (args) {
    if (isOn(args[0])) {
      $gameVariables.SetFlashlight(true);
      $gameVariables.SetFlashlightLength(args[1]);  // cond set
      $gameVariables.SetFlashlightWidth(args[2]);   // cond set
      $gameVariables.SetPlayerColor(args[3]);       // cond set
      $gameVariables.SetFlashlightDensity(args[4]); // cond set
    } else if (isOff(args[0])) {
      $gameVariables.SetFlashlight(false);
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.fireLight = function (args) {
    //******************* Light radius 100 #FFFFFF ************************
    if (args[0].equalsIC('radius')) {
      $gameVariables.SetRadius(args[1]);           // cond set
      $gameVariables.SetRadiusTarget(args[1]);     // cond set
      $gameVariables.SetPlayerColor(args[2]);      // cond set
      $gameVariables.SetPlayerBrightness(args[3]); // cond set
    }

    //******************* Light radiusgrow 100 #FFFFFF Brightness Frames ************************
    if (args[0].equalsIC('radiusgrow')) {
      $gameVariables.SetRadiusTarget(args[1]);     // cond set
      $gameVariables.SetPlayerColor(args[2]);      // cond set
      $gameVariables.SetPlayerBrightness(args[3]); // cond set
      $gameVariables.SetRadiusSpeed(args[4]);      // always set, must use AFTER setting target
    }

    // *********************** TURN SPECIFIC LIGHT ON *********************
    else if (isOn(args[0])) {
      let lightid = +args[1];
      let lightarray = $gameVariables.GetLightArray();
      lightarray[lightid] ? lightarray[lightid][0] = true : lightarray[lightid] = [true, 'defaultcolor'];
    }

    // *********************** TURN SPECIFIC LIGHT OFF *********************
    else if (isOff(args[0])) {
      let lightid = +args[1];
      let lightarray = $gameVariables.GetLightArray();
      lightarray[lightid] ? lightarray[lightid][0] = false : lightarray[lightid] = [false, 'defaultcolor'];
    }

    // *********************** SET COLOR *********************
    else if (args[0].equalsIC('color')) {
      let newcolor = args[2];
      if (!newcolor || newcolor.equalsIC('defaultcolor')) newcolor = 'defaultcolor';
      let lightid = +args[1];
      let lightarray = $gameVariables.GetLightArray();
      lightarray[lightid] ? lightarray[lightid][1] = newcolor : lightarray[lightid] = [false, newcolor];
    }

    // **************************** RESET ALL SWITCHES ***********************
    else if (args[0].equalsIC('switch') && args[1].equalsIC('reset')) {
      $gameVariables.SetLightArray({});
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.tint = function (args) {
    let cmd = args[0].trim().toLowerCase();
    if (cmd.equalsIC('set', 'fade')) {
      let currentColor = args[1];
      let speed = +args[2] || 0;
      if (speed == 0) $gameVariables.SetTint(args[1]);
      $gameVariables.SetTintTarget(currentColor);
      $gameVariables.SetTintSpeed(speed);
    }
    else if (cmd.equalsIC("reset", "daylight")) {
      let currentColor = $gameVariables.GetTintByTime();
      let speed = +args[1] || 0;
      if (speed == 0) $gameVariables.SetTint(currentColor);
      $gameVariables.SetTintTarget(currentColor);
      $gameVariables.SetTintSpeed(speed);
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
    let daynightcolors = $gameVariables.GetDaynightColorArray();

    if (args[0].equalsIC('speed')) {
      daynightspeed = +args[1] || 5000;
      $gameVariables.SetDaynightSpeed(daynightspeed);
    }

    function addTime(houradd, minuteadd) {
      let daynightminutes = Math.floor(daynighttimer / daynightspeed);
      daynightminutes = daynightminutes + minuteadd + 60*(daynightcycle + houradd);
      daynightcycle = Math.trunc(daynightminutes/60)%daynighthoursinday;
      daynightminutes = daynightminutes%60;
      if (daynightminutes < 0) { daynightminutes += 60; daynightcycle--; };
      if (daynightcycle < 0) { daynightcycle += daynighthoursinday; };


      daynighttimer = daynightminutes * daynightspeed;

      $$.saveTime(daynightcycle, daynightminutes);

      $gameVariables.SetDaynightTimer(daynighttimer);     // timer = minutes * speed
      $gameVariables.SetDaynightCycle(daynightcycle);     // cycle = hours
    }

    if (args[0].equalsIC('add')) {
      addTime(+args[1], args.length > 2 ? +args[2] : 0);
    }

    if (args[0].equalsIC('subtract')) {
      addTime(+args[1]*-1, args.length > 2 ? +args[2]*-1 : 0);
    }

    if (args[0].equalsIC('hour')) {
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

    if (args[0].equalsIC('hoursinday')) {
      daynighthoursinday = Math.max(+args[1], 0);
      if (daynighthoursinday > daynightcolors.length) {
        let origLength = daynightcolors.length;
        daynightcolors.length = daynighthoursinday; // more efficient than a for loop
        daynightcolors.fill({ "color": "#ffffff", "isNight": false }, origLength);
      }
      $gameVariables.SetDaynightColorArray(daynightcolors);
      $gameVariables.SetDaynightHoursinDay(daynighthoursinday);
    }

    if (args[0].equalsIC('show')) {
      $gameVariables._clShowTimeWindow = true;
      $gameVariables._clShowTimeWindowSeconds = false;
    }

    if (args[0].equalsIC('showseconds')) {
      $gameVariables._clShowTimeWindow = true;
      $gameVariables._clShowTimeWindowSeconds = true;
    }

    if (args[0].equalsIC('hide')) {
      $gameVariables._clShowTimeWindow = false;
      $gameVariables._clShowTimeWindowSeconds = false;
    }

    if (args[0].equalsIC('color')) {
      let hour = (+args[1] || 0).clamp(0, daynighthoursinday - 1);
      let hourcolor = args[2];
      let isValidColor = isValidColorRegex.test(hourcolor.trim());
      if (isValidColor) daynightcolors[hour].color = hourcolor;
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

  // API differences: Tilemap._addshadow in RMMZ and ShaderTilemap._drawShadow in RMMV
  let _Tilemap = isRMMZ() ? Tilemap : ShaderTilemap;
  let _XShadow_LU = isRMMZ() ? "_addShadow" : "_drawShadow";
  let _XTilemap_XShadow = _Tilemap.prototype[_XShadow_LU];
  _Tilemap.prototype[_XShadow_LU] = function (layerOrBitmap, shadowBits, dx, dy) {
    if (!hideAutoShadow) {
      _XTilemap_XShadow.call(this, layerOrBitmap, shadowBits, dx, dy);
    }
    // Else, show no shadow
  };
})(Community.Lighting);

Community.Lighting.distance = function (x1, y1, x2, y2) {
  return Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
};

Game_Variables.prototype.SetActiveRadius = function (value) {
  this._Player_Light_Radius = orNaN(+value);
};
Game_Variables.prototype.GetActiveRadius = function () {
  if (this._Player_Light_Radius >= 0) return this._Player_Light_Radius;
  return Number(Community.Lighting.parameters['Lights Active Radius']) || 0;
};

Game_Variables.prototype.GetFirstRun = function () {
  if (typeof this._Community_Lighting_FirstRun === 'undefined') {
    this._Community_Lighting_FirstRun = true;
  }
  return this._Community_Lighting_FirstRun;
};
Game_Variables.prototype.SetFirstRun = function (value) {
  this._Community_Lighting_FirstRun = value;
};
Game_Variables.prototype.GetScriptActive = function () {
  if (typeof this._Community_Lighting_ScriptActive === 'undefined') {
    this._Community_Lighting_ScriptActive = true;
  }
  return this._Community_Lighting_ScriptActive;
};
Game_Variables.prototype.SetScriptActive = function (value) {
  this._Community_Lighting_ScriptActive = value;
};

Game_Variables.prototype.GetOldMapId = function () {
  if (typeof this._Community_Lighting_OldMapId === 'undefined') {
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
  return orNullish(this._Community_Tint_Value, '#000000');
};
Game_Variables.prototype.GetTintByTime = function () {
  let result = this.GetDaynightColorArray()[this.GetDaynightCycle()];
  return result ? (result.color || "#000000") : "#000000";
};
Game_Variables.prototype.SetTintTarget = function (value) {
  this._Community_TintTarget_Value = value;
};
Game_Variables.prototype.GetTintTarget = function () {
  return orNullish(this._Community_TintTarget_Value, '#000000');
};
Game_Variables.prototype.SetTintSpeed = function (value) {
  this._Community_TintSpeed_Value = orNaN(+value);
};
Game_Variables.prototype.GetTintSpeed = function () {
  return orNullish(this._Community_TintSpeed_Value, 60);
};

Game_Variables.prototype.SetFlashlight = function (value) {
  this._Community_Lighting_Flashlight = value;
};
Game_Variables.prototype.GetFlashlight = function () {
  return orNullish(this._Community_Lighting_Flashlight, false);
};
Game_Variables.prototype.SetFlashlightDensity = function (value) { // don't set if invalid or 0
  +value > 0 && (this._Community_Lighting_FlashlightDensity = +value);
};
Game_Variables.prototype.GetFlashlightDensity = function () {
  let value = +this._Community_Lighting_FlashlightDensity;
  return value || 3; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightLength = function (value) { // don't set if invalid or 0
  +value > 0 && (this._Community_Lighting_FlashlightLength = +value);
};
Game_Variables.prototype.GetFlashlightLength = function () {
  let value = +this._Community_Lighting_FlashlightLength;
  return value || 8; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightWidth = function (value) { // don't set if invalid or 0
  +value > 0 && (this._Community_Lighting_FlashlightWidth = +value);
};
Game_Variables.prototype.GetFlashlightWidth = function () {
  let value = +this._Community_Lighting_FlashlightWidth;
  return value || 12; // not undefined, null, NaN, or 0
};

/**
 *
 * @param {String} value
 */
Game_Variables.prototype.SetPlayerColor = function (value) { // don't set if invalid.
  isValidColorRegex.test(value) && (this._Community_Lighting_PlayerColor = value);
};
Game_Variables.prototype.GetPlayerColor = function () {
  let value = this._Community_Lighting_PlayerColor;
  return isValidColorRegex.test(value) ? value : '#FFFFFF';
};
Game_Variables.prototype.SetPlayerBrightness = function (value) { // don't set if invalid.
  if (value && value[0].equalsIC('b')) { // must exist and be prefixed with b or B
    let b = +value.slice(1); // strip and convert to number
    !isNaN(b) && (this._Community_Lighting_PlayerBrightness = (b / 100).clamp(0, 1)); // clamp between [0,1]
  }
};
Game_Variables.prototype.GetPlayerBrightness = function () {
  return orNullish(this._Community_Lighting_PlayerBrightness, 0);
};
Game_Variables.prototype.SetRadius = function (value) {
  if (+value >= 0) this._Community_Lighting_Radius = +value; // don't set if invalid or <0
};
Game_Variables.prototype.GetRadius = function () {
  if (this._Community_Lighting_Radius == null) {
    return 150;
  } else {
    return this._Community_Lighting_Radius;
  }
};
Game_Variables.prototype.SetRadiusTarget = function (value) {
  if (+value >= 0) this._Community_Lighting_RadiusTarget = +value; // don't set if invalid or <0
};
Game_Variables.prototype.GetRadiusTarget = function () {
  if (this._Community_Lighting_RadiusTarget == null) {
    return 150;
  } else {
    return this._Community_Lighting_RadiusTarget;
  }
};
Game_Variables.prototype.SetRadiusSpeed = function (value) { // must use AFTER setting target
  let diff = Math.abs(this.GetRadiusTarget() - this.GetRadius());
  let time = Math.max(1, (orNaN(+value, 500))); // set to 1 if < 1 or 500 if invalid.
  this._Community_Lighting_RadiusSpeed = diff / time;
};
Game_Variables.prototype.GetRadiusSpeed = function () {
  return orNullish(this._Community_Lighting_RadiusSpeed, 0);
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
  this._Community_Lighting_DaynightSpeed = orNaN(+value);
};
Game_Variables.prototype.GetDaynightSpeed = function () {
  if (this._Community_Lighting_DaynightSpeed >= 0) return this._Community_Lighting_DaynightSpeed;
  return orNullish(Number(Community.Lighting.parameters['Daynight Initial Speed']), 10);
};
Game_Variables.prototype.SetDaynightCycle = function (value) {
  this._Community_Lighting_DaynightCycle = orNaN(+value);
};
Game_Variables.prototype.GetDaynightCycle = function () {
  return orNullish(this._Community_Lighting_DaynightCycle, Number(Community.Lighting.parameters['Daynight Initial Hour']), 0);

};
Game_Variables.prototype.SetDaynightTimer = function (value) {
  this._Community_Lighting_DaynightTimer = orNaN(+value);
};
Game_Variables.prototype.GetDaynightTimer = function () {
  return orNullish(this._Community_Lighting_DaynightTimer, 0);
};
Game_Variables.prototype.SetDaynightHoursinDay = function (value) {
  this._Community_Lighting_DaynightHoursinDay = orNaN(+value);
};
Game_Variables.prototype.GetDaynightHoursinDay = function () {
  return orNullish(this._Community_Lighting_DaynightHoursinDay, 24);
};

Game_Variables.prototype.SetFireRadius = function (value) {
  this._Community_Lighting_FireRadius = orNaN(+value);
};
Game_Variables.prototype.GetFireRadius = function () {
  return orNullish(this._Community_Lighting_FireRadius, 7);
};
Game_Variables.prototype.SetFireColorshift = function (value) {
  this._Community_Lighting_FireColorshift = orNaN(+value);
};
Game_Variables.prototype.GetFireColorshift = function () {
  return orNullish(this._Community_Lighting_FireColorshift, 10);
};
Game_Variables.prototype.SetFire = function (value) {
  this._Community_Lighting_Fire = value;
};
Game_Variables.prototype.GetFire = function () {
  return orNullish(this._Community_Lighting_Fire, false);
};

Game_Variables.prototype.SetLightArray = function (value) {
  this._Community_Lighting_LightArray = value;
};
Game_Variables.prototype.GetLightArray = function () {
  if (this._Community_Lighting_LightArray == null)
    this._Community_Lighting_LightArray = {};
  return this._Community_Lighting_LightArray;
};
Game_Variables.prototype.SetTileLightArray = function (value) {
  this._Community_Lighting_TileLightArray = value;
};
Game_Variables.prototype.GetTileLightArray = function () {
  let default_TA = [];
  return orNullish(this._Community_Lighting_TileLightArray, default_TA);
};
Game_Variables.prototype.SetTileBlockArray = function (value) {
  this._Community_Lighting_TileBlockArray = value;
};
Game_Variables.prototype.GetTileBlockArray = function () {
  let default_TA = [];
  return orNullish(this._Community_Lighting_TileBlockArray, default_TA);
};
Game_Variables.prototype.SetLightTiles = function (value) {
  this._Community_Lighting_LightTiles = value;
};
Game_Variables.prototype.GetLightTiles = function () {
  let default_TA = [];
  return orNullish(this._Community_Lighting_LightTiles, default_TA);
};
Game_Variables.prototype.SetBlockTiles = function (value) {
  this._Community_Lighting_BlockTiles = value;
};
Game_Variables.prototype.GetBlockTiles = function () {
  let default_TA = [];
  return orNullish(this._Community_Lighting_BlockTiles, default_TA);
};
function Window_TimeOfDay() {
  this.initialize(...arguments);
};
Window_TimeOfDay.prototype = Object.create(Window_Selectable.prototype);
Window_TimeOfDay.prototype.constructor = Window_TimeOfDay;
Window_TimeOfDay.prototype.initialize = function () {
  const ww = 150;
  const wh = isRMMZ() ? SceneManager._scene.calcWindowHeight(1, true) : 65;
  const wx = Graphics.boxWidth - ww - (isRMMZ() ? (ConfigManager.touchUI ? 30 : 0) : 0);
  const wy = 0;
  const rect = isRMMZ() ? [new Rectangle(wx, wy, ww, wh)] : [wx, wy, ww, wh];
  Window_Selectable.prototype.initialize.call(this, ...rect);
  this._baseX = wx
  this._baseY = wy;
  this.setBackgroundType(0);
  this.visible = $gameVariables._clShowTimeWindow;
};
Window_TimeOfDay.prototype.update = function () {
  this.visible = $gameVariables._clShowTimeWindow;
  if (this.visible) {
    let time = Community.Lighting.time(!!$gameVariables._clShowTimeWindowSeconds);
    let x, y, width;
    if (isRMMZ()) {
      let rect = this.itemLineRect(0);
      let size = this.textSizeEx(time);
      x = rect.x + rect.width - size.width;
      y = rect.y;
      width = size.width;
      this.x = this._baseX - (ConfigManager.touchUI ? 30 : 0);
    } else {
      let textWidth = this.textWidth(time);
      x = this.contents.width - textWidth - this.textPadding();
      y = 0;
      width = 0;
    }

    this.contents.clear();
    this.resetTextColor();
    this.drawTextEx(time, x, y, width /*ignored by RMMV*/);
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
