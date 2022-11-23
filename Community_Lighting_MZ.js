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
Community.Lighting.version = 5.0;
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
* @desc Should the tint change over time. Must also be enabled in individual maps.
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
* @command daynightEnable
* @text Daynight Tint On/Off
* @desc Enable or disable daynight cycle tinting for the current map. Warning: this will be overridden by map notes.
*
* @arg enabled
* @text Enabled
* @desc If set to "off" then the other command parameters will be ignored
* @type boolean
* @on On
* @off Off
* @default true
*
* @arg fade
* @text Fade tint over hour
* @desc If set to "on" the tint will gradually transition to that of the next hour.
* @type boolean
* @on On
* @off Off
* @default false
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
* @on On
* @off Off
* @default true
*
* @----------------------------
*
* @command condLight
* @text Set Conditional Lighting
* @desc Supports transition & pause durations, on & off, color, angle, brightness, x offset, y offset, radius, beam length & width.
*
* @arg id
* @text Event ID
* @desc This is an ID you assigned via note tag, as in <cl: light 150 #fff myIdHere> not an event's id number
* @type text
*
* @arg properties
* @text Properties
* @desc fmt: [tN] [pN] [<#|#a>hex] [eN] [<a|+a|-a>N] [bN] [xN] [yN] [rN] [lN] [wN] where N is a number or range (N:N).
* @type text
* @default t5 #ffffff e1 -a90 b0 x0 y0 r150 l12 w12
*
* @arg wait
* @text Wait
* @desc Wait for the light to finish both transitioning and pausing before continuing the event script.
* @type boolean
* @on On
* @off Off
* @default false
*
* @----------------------------
*
* @command condLightWait
* @text Wait on Conditional Lighting
* @desc Wait for the conditional light to finish both transitioning and pausing before continuing the event script.
*
* @arg id
* @text Event ID
* @desc This is an ID you assigned via note tag, as in <cl: light 150 #fff myIdHere> not an event's id number
* @type text
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
* @desc If set to "off" then the other command parameters will be ignored
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
* @arg fade
* @text Fade tint over hour
* @desc If set to "on" the tint will gradually transition to that of the next hour.
* @type boolean
* @on On
* @off Off
* @default false
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
* @arg fade
* @text Fade tint over hour
* @desc If set to "on" the tint will gradually transition to that of the next hour.
* @type boolean
* @on On
* @off Off
* @default false
*
* @----------------------------
*
* @command setHoursInDay
* @text Set Hours In Day
* @desc Sets the current number of hours in a day
*
* @arg hours
* @text Hours
* @type number
* @min 0
* @default 24
*
* @arg fade
* @text Fade tint over hour
* @desc If set to "on" the tint will gradually transition to that of the next hour.
* @type boolean
* @on On
* @off Off
* @default false
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
* @text Fade Speed or Cycles
* @desc Speed or cycles in which the tint transitions. For speed, 0=instant, 20=very slow.
* @type number
* @min 0
* @default 0
*
* @arg cycles
* @text uses cycles
* @desc If set to "on" the tint will gradually transition over the specified cycle count
* @type boolean
* @on On
* @off Off
* @default false
*
* @arg wait
* @text Wait
* @desc Wait for the tint to finish transitioning before continuing the event script.
* @type boolean
* @on On
* @off Off
* @default false
*
* @----------------------------
*
* @command resetTint
* @text Reset Tint
* @desc Reset the current map tint to the next hour color, or the battle tint to its original color if in battle
*
* @arg fadeSpeed
* @text Fade Speed
* @desc Speed or cycles in which the tint transitions. For speed, 0=instant, 20=very slow.
* @type number
* @min 0
* @max 20
* @default 0
*
* @arg cycles
* @text uses cycles
* @desc If set to "on" the tint will gradually transition over the specified cycle count
* @type boolean
* @on On
* @off Off
* @default false
*
* @arg wait
* @text Wait
* @desc Wait for the tint to finish transitioning before continuing the event script.
* @type boolean
* @on On
* @off Off
* @default false
*
* @----------------------------
*
* @command waitTint
* @text Wait on Tint
* @desc Wait for the tint to finish transitioning before continuing the event script.
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
* Light radius color [enable] [day|night] [brightness] [direction] [anglerange] [x] [y] [id]
* Light radius cycle <color [pauseDuration]>... [enable] [day|night] [brightness] [direction] [anglerange] [x] [y] [id]
* Light [radius] [color] [{CycleProps}...] [enable] [day|night] [brightness] [direction] [anglerange] [x] [y] [id]
* - Light
* - radius      For a circular radius this can be any number, optionally preceded by "R" or
*               "r", so 100, R100, r100, etc. For an elliptical radius, must be any number
*               preceded by xr or XR, and yr or YR, so "xr100 yr150", "XR100 yr150", etc.
* - cycle       Allows any number of color + duration pairs to follow that will be cycled
*               through before repeating from the beginning. See the examples below for usage.
*               In Terrax Lighting, there was a hard limit of 4, but now there is no limit.
*               To cycle any light property or for fade transitions, use the cycleProps
*               format instead. [optional]
* - cycleProps  Cyclic conditional lighting properties can be specified within {} brackets.
*               The can be used to create transitioning light patterns See the Conditional
*               Lighting section for more details. * Any non-cyclic properties are inherited
*               unless overridden by the first cyclic properties [Optional]
* - color       #ffffff, #ff0000, etc
* - enable      Initial state: off, on (default). May optionally use 'E1|e1|E0|e0' syntax
*               where 1 is on, and 0 is off. Ignored if day|night passed [optional]
* - day         Causes the light to only come on during the day [optional]
* - night       Causes the light to only come on during the night [optional]
* - brightness  B50, B25, etc [optional]
* - direction   D1: n.wall, D2: e.wall, D3: s.wall, D4: w.wall
*               D5 n.+e. walls, D6 s.+e. walls, D7 s.+w. walls,
*               D8 n.+w. walls, D9 n.-e. corner, D10 s.-e. corner
*               D11 s.-w. corner, D12 n.-w. corner  [optional]
* - anglerange  Forced direction range in degrees in the format of aN:M where N is the start
*               angle and M Is the end angle. Must be preceded by "A" or "a". If omitted,
*               direction is used. [optional]
* - x           x offset [optional] (0.5: half tile, 1 = full tile, etc)
* - y           y offset [optional]
* - id          1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*               These should not be in the format of '<a|b|d|e|l|w|x|y|A|B|D|E|L|W|X|Y>N'
*               where N is a number following any supported optional parameter prefix
*               otherwise it will be mistaken for one of the previous optional parameters.
*               Generally, it is adviseable to avoid any single letter followed by a number.
*
* Fire ...params
* - Same as Light params above, but adds a subtle flicker
*
* Flashlight bl bw color [enable] [day|night] [sdir|angle] [x] [y] [id]
* Flashlight bl bw cycle <color [pauseDuration]>... [enable] [day|night] [sdir|angle] [x] [y] [id]
* Flashlight [bl] [bw] [{CycleProps}...] [enable] [day|night] [sdir|angle] [x] [y] [id]
* - Sets the light as a flashlight with beam length (bl) beam width (bw) color (c),
*      0|1 (onoff), and 1=up, 2=right, 3=down, 4=left for static direction (sdir)
* - bl:         Beam length:  Any number, optionally preceded by "L" or "l", so 8, L8, l8, etc.
* - bw:         Beam width:  Any number, optionally preceded by "W", or 'w', so 12, W12, w12, etc.
* - cycle       Allows any number of color + duration pairs to follow that will be cycled
*               through before repeating from the beginning. See the examples below for usage.
*               In Terrax Lighting, there was a hard limit of 4, but now there is no limit.
*               To cycle any light property or for fade transitions, use the cycleProps
*               format instead. [optional]
* - cycleProps  Cyclic conditional lighting properties can be specified within {} brackets.
*               The can be used to create transitioning light patterns See the Conditional
*               Lighting section for more details. * Any non-cyclic properties are inherited
*               unless overridden by the first cyclic properties [Optional]
* - color       #ffffff, #ff0000, etc
* - enable      Initial state: off, on (default). May optionally use 'E1|e1|E0|e0' syntax
*               where 1 is on, and 0 is off. Ignored if day|night passed [optional]
* - day         Sets the event's light to only show during the day [optional]
* - night       Sets the event's light to only show during night time [optional]
* - sdir        Forced direction: 0:auto, 1:up, 2:right, 3:down, 4:left [optional]
*               Can be preceded by "D" or "d", so D4, d4, etc. If omitted, defaults to 0
* - angle       Forced direction in degrees. Must be preceded by "A" or "a". If
*               omitted, sdir is used. [optional]
* - x           x[offset] Work the same as regular light [optional]
* - y           y[offset] [optional]
* - id          1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*               These should not be in the format of '<a|b|d|e|l|w|x|y|A|B|D|E|L|W|X|Y>N'
*               where N is a number following any supported optional parameter prefix
*               otherwise it will be mistaken for one of the previous optional parameters.
*               Generally, it is adviseable to avoid any single letter followed by a number.
*
* Example note tags:
*
* <cl: light 250 #ffffff>
* <cl: light r250 #ffffff>
* Creates a basic light
*
* <cl: light xr250 yr300 #ffffff>
* Creates a basic elliptical light
*
* <cl: light r250 a180:360 #ffffff>
* Creates a basic light that displays from 180 degrees to 360 degrees (north facing).
*
* <cl: light 300 cycle #ff0000 15 #ffff00 15 #00ff00 15 #00ffff 15 #0000ff 15>
* <cl: light r300 {#ff0000 p15} {#ffff00} {#00ff00} {#00ffff} {#0000ff}>
* Creates a cycling light that rotates every 15 frames.  Great for parties!
*
* <cl: light r300 {#ff0000 t30 p60} {#ffff00} {#00ff00} {#00ffff}>
* Creates a cycling light that stays on for 30 frames and transitions to the next color over 60 frames.
*
* <cl: light {#ff0000 t30 p60 r250} {#ffff00 r300} {#00ff00 r250} {#00ffff r300}>
* Creates a cycling light that grows and shrink between radius sizes of 250 and 300, stays on for 30 frames,
* and transitions to the next color and size over 60 frames.
*
* <cl: fire 150 #ff8800 b15 night>
* Creates a fire that only lights up at night.
*
* <cl: Flashlight l8 w12 #ff0000 on asdf>
* Creates a flashlight beam with id asdf which can be turned on or off via
* plugin commands.
*
* <cl: Flashlight l8 w12 #ff0000 on asdf>
* Creates a flashlight beam with id asdf which can be turned on or off via
* plugin commands.
*
* <cl: Flashlight l8 w12 cycle #f00 15 #ff0 15 #0f0 15>
* <cl: Flashlight l8 w12 {#f00 p15} {#ff0} {#0f0}>
* Creates a flashlight beam that rotates every 15 frames.
*
* --------------------------------------------------------------------------
* Additive Lighting Effects
* --------------------------------------------------------------------------
* Additive lighting gives lights a volumetric appearance. To enable, put 'a' or 'A'
* in front of any color light color.
*
* Example note tags:
*
* <cl: light r300 {a#990000 t15} {a#999900} {a#009900} {a#009999} {a#000099}>
* Creates a cycling volumetric light that rotates every 15 frames.
*
* <cl: Flashlight l8 w12 a#660000 on asdf>
* Creates a red volumetric flashlight beam with id asdf which can be turned on or off
* via plugin commands.
*
* --------------------------------------------------------------------------
* Conditional Lighting
* --------------------------------------------------------------------------
* Conditional Lighting allows light properties to be changed either cyclically or
* dynamically over time via properties that consist of a prefix followed by a property
* value. This is useful for creating any number of transitional lighting effects.
* Properties will hold their given value until a change or reset (including pause and
* transition durations).
*
* The properties are supported in light tags or via the 'light cond' command. Light tags
* support any number of light properties wrapped in {} brackets See the example note tags
* above.
*
* The 'light cond' command allows for conditional lights to be dynamically changed on demand.
* See the Plugin Commands section for more details.
*
* Ranges can be used if random values are desired. Cycle tags are statically generated at map
* load. If dynamic random property values are desired, use the 'light cond' command instead in
* combination with the 'light wait' command.
* See the table below for property specific formatting.
*
* The following table shows supported properties:
* ---------------------------------------------------------------------------------------------------------------------
* | Property    |  Prefix   |         Format*†        |       Examples       |              Description               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   pause     |     p     |         p<N|N:N>        |     p0, p1, p20,     | time period in cycles to pause after   |
* |  duration   |           |                         |    p0:20, p1:20      | transitioning for cycling lights       |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | transition  |     t     |         t<N|N:N>        |     t0, t1, t30      | time period to transition the          |
* |  duration   |           |                         |    t0:30, t1:30      | specified properties over              |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   color     |   #, #a   |   <#|#a><hex|hex:hex>   | #, #FFEEDD, #ffeedd, | color or additive color                |
* |             |           |                         |  a#000000:a#ffffff   |                                        |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  enable     |     e     |        e<0|1|0:1>       |     e0, e1, e0:1     | turns light on or off instantly        |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   angle     | a, +a, -a |     <a|+a|-a><N|N:N>    |  a, a30, +a30, -a30  | flashlight angle in degrees. '+' moves |
* |             |           |                         |    +a0:30, -a0:30    | clockwise, '-' moves counterclockwise  |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | brightness  |     b     |         b<N|N:N>        | b, b0, b1, b5, b1:5  | brightness                             |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  x offset   |     x     |         x<N|N:N>        |  x, x2, x-2, x-2:2   | x offset                               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  y offset   |     y     |         y<N|N:N>        |  y, y2, y-2, y-2:2   | y offset                               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   radius    |     r     |         r<N|N:N>        | r, r50, r150, r50:75 | light radius                           |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | beam length |     l     |         l<N|N:N>        | l, l8, l9, l10, l7:9 | flashlight beam length                 |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | beam width  |     w     |         w<N|N:N>        |   w, w8, w14, w7:9   | flashlight beam width                  |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | * Omitting N or hex value will transition the given property back to its initial state                            |
* |-------------------------------------------------------------------------------------------------------------------|
* | † using the N:N or hex:hex format allows for a randomly generated value within the given range (inclusive)        |
* ---------------------------------------------------------------------------------------------------------------------
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
*
* Tint set c
* - Sets the current screen tint to the color (c)
*
* Tint daylight
* - Sets the tint based on the current hour.
* -------------------------------------------------------------------------------
* Plugin Commands (for MZ these use the new plugin interface)
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
* Light cond id [tN] [pN] [<#|#a>hex] [eN] [<a|+a|-a>N] [bN] [xN] [yN] [rN] [lN] [wN]
* - where N can either be a single number such as 0, 2, 3, etc., or a range of numbers,
* - such as 0:1, 1:9, 2:10, etc. And hex can either be a single hex color such as #000000,
* - #ffffff, a#ffffff, etc. or a range such as #000000:#ffffff, a#333333bb:a#999999bb.
* - The command transitions a conditional light to the specified properties over the given
* - time period in cycles. Supported propreties are transition duration (t),
* - pause duration (p), color (#, a#), enable (e), flashlight angle (a, +a, -a),
* - brightness (b), x offset (x), y offset (y), radius (r), flashlight beam length (l),
* - flashlight beam width (w). Must use the specified prefixes. Unsupported prefixes are
* - ignored. See the Conditional Light section for more detail on each property.
*
* Light wait id
* - wait for the conditional light to finish both transitioning and pausing before continuing
* - the event script.
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
*   The duration is either (t) frames or 500 frames if (t) isn't specified.
*
* Setfire r s
* - Alters fire settings with radius shift (r) and red/yellow color shift (s)
*
* Flashlight on bl bw c bd
* - turn on flashlight for player with beam length (bl), beam width (hw), color (c),
*   and beam density (bd)
*
* Flashlight off
* - Turn off the flashlight.  yup.
*
* DayNight on|off [fade]
* - Activates or deactivates the day/night cycle. Specifying 'fade' will gradually
*   transition the tint to that of the next hour.
*
* Daynight speed n
* - Changes the speed by which hours pass in game in relation to real life seconds
*
* Daynight hour h m [fade]
* - Sets the in game time to hh:mm. Specifying 'fade' will gradually transition the
*   tint to that of the next hour.
*
* Daynight color h c
* - Sets the hour (h) to use color (c)
*
* Daynight add h m [fade]
* - Adds the specified hours (h) and minutes (m) to the in game clock. Specifying
*   'fade' will gradually transition the tint to that of the next hour.
*
* Daynight subtract h m [fade]
* - Subtracts the specified hours (h) and minutes (m) from the in game clock.
*   Specifying  'fade' will gradually transition the tint to that of the next hour.
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
* Daynight hoursinday h [fade]
* - Sets the number of hours in a day to [h] (set hour colors if doing this).
*   Specifying 'fade' will gradually transition the tint to that of the next hour.
*
* Tint set c [s] [cycles]
* Tint fade c [s] [cycles]
* - Sets or fades the current screen tint to the color (c)
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow).
* - If the optional argument 'cycles' is provided, then speed is treated as a cycle count.
* - Both commands operate identically.
*
* Tint reset [s] [cycles]
* Tint daylight [s] [cycles]
* - Resets or fades the tint based on the current hour.
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - If the optional argument 'cycles' is provided, then speed is treated as a cycle count.
* - Both commands operate identically.
*
* Tint wait
* - wait for the tint to finish transitioning before continuing the event script.
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
* - id      id of region
* - color   color of block (usually #000000)
* - shape   1=square, 2=oval
* - xoffset x offset
* - yoffset y offset
* - width   width of shape
* - height  height of shape
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
* The following tag may be used in a comment field in the first page of a
* battle event to change the battle tint prior to the first turn:
*
* TintBattle set
* - Sets the current screen tint to the color (c)
*
* The following commands may be used at any time in battle events (note, these do
* not work as tags in comment fields):
*
* TintBattle set [c] [s]
* TintBattle fade [c] [s]
* - Sets or fades the battle screen to the color (c)
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - Automatically set too dark color to '#666666' (dark gray).
* - Both commands operate identically.
*
* TintBattle reset [s]
* TintBattle daylight [s]
* - Resets or fades the battle screen to its original color.
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - Both commands operate identically.
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

const M_2PI    = 2 * Math.PI;   // cache 2PI - this is faster
const M_PI_180 = Math.PI / 180; // cache PI/180 - this is faster

Number.prototype.is           = function(...a)     { return a.includes(Number(this)); };
Number.prototype.inRange      = function(min, max) { return this >= min && this <= max; };
Number.prototype.clone        = function()         { return Number(this); };
Boolean.prototype.clone       = function()         { return this == true; };
String.prototype.equalsIC     = function(...a)     { return a.map(s => s.toLowerCase()).includes(this.toLowerCase()); };
String.prototype.startsWithIC = function(s)        { return this.toLowerCase().startsWith(s.toLowerCase()); };
Math.minmax                   = (minOrMax, ...a) =>  minOrMax ? Math.min(...a) : Math.max(...a); // min if positive

let isRMMZ = () => Utils.RPGMAKER_NAME === "MZ";
let isRMMV = () => Utils.RPGMAKER_NAME === "MV";

function orBoolean(...a) {
  for (let i = 0; i < a.length; i++) {
    if (typeof a[i] === "boolean") return a[i];
    else if (typeof a[i] === "string") {
      if (a[i].equalsIC('true')) return true;
      else if (a[i].equalsIC('false')) return false;
    }
  }
}
function orNullish(...a) { for (let i = 0; i < a.length; i++) if (a[i] != null) return a[i]; }
function orNaN(...a)     { for (let i = 0; i < a.length; i++) if (!isNaN(a[i])) return a[i]; }

let isOn         = (x) => x.toLowerCase() === "on";
let isOff        = (x) => x.toLowerCase() === "off";
let isActivate   = (x) => x.toLowerCase() === "activate";
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
  Region:  2, region:  2, 2: 2
};

const LightType = {
  Light     : 1, light     : 1, 1: 1,
  Fire      : 2, fire      : 2, 2: 2,
  Flashlight: 3, flashlight: 3, 3: 3,
  Glow      : 4, glow      : 4, 4: 4
};

const TileLightType = {
  tilelight:   [TileType.Terrain, LightType.Light],
  tilefire:    [TileType.Terrain, LightType.Fire],
  tileglow:    [TileType.Terrain, LightType.Glow],
  regionlight: [TileType.Region,  LightType.Light],
  regionfire:  [TileType.Region,  LightType.Fire],
  regionglow:  [TileType.Region,  LightType.Glow],
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
    this.color      = new VRGBA(color);
    this.radius     = +radius || 0;
    this.brightness = brightness && (brightness.slice(1, brightness.length) / 100).clamp(0, 1) ||
                      Community.Lighting.defaultBrightness || 0;
  }
}

class TileBlock {
  constructor(tileType, id, onoff, color, shape, xOffset, yOffset, blockWidth, blockHeight) {
    this.tileType    = TileType[tileType];
    this.id          = +id || 0;
    this.enabled     = isOn(onoff);
    this.color       = new VRGBA(color);
    this.shape       = +shape || 0;
    this.xOffset     = +xOffset || 0;
    this.yOffset     = +yOffset || 0;
    this.blockWidth  = +blockWidth || 0;
    this.blockHeight = +blockHeight || 0;
  }
}

const isValidColorRegex = /^[Aa]?#[A-F\d]{8}$/i; // a|A before # for additive lighting

/**
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @returns {String}
 */
function rgba(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

/** Class to handle volumetric/additive coloring with rgba colors uniformly. Additive coloring prefixes an 'a' on a
 *  normal hex color. E.g. a#ccddeeff, a#ccddee, a#cdef, a#cde.
 */
class VRGBA {
  /**
   * Creates a VRGBA object representing a VRGBA color string. Either v, r, g, b, a values can be passed directly, or a
   * hex String can be passed with an optional default alternative Hex string which is used in case of parsing failure.
   * @param {String|Boolean|VRGBA} vOrHex     - Boolean representing the additive component, or
   *                                            String representing the hex color, or
   *                                            other VRGBA object to clone.
   * @param {String|Number}        rOrDefault - Number representing the red component, or
   *                                            String representing a default hex string.
   * @param {null|Number}          g          - Number representing the green component.
   * @param {null|Number}          b          - Number representing the blue component.
   * @param {null|Number}          a          - Number representing the alpha component.
   * @returns {VRGBA}
   */
  constructor(vOrHex, rOrDefault = "#000000ff", g = undefined, b = undefined, a = 0xff) {
    this.name = VRGBA.name;
    if (arguments.length == 0) return;                           // return if no arguments (allows construction).
    else if (typeof vOrHex === "boolean")                        // Passed v, r, g, b, a
      [this.v, this.r,           this.g,  this.b,  this.a] =     // - assign
      [vOrHex, +rOrDefault || 0, +g || 0, +b || 0, +a || 0xff];  // -
    else if (vOrHex == null || typeof vOrHex === "string") {     // passed a hex String or nullish
      vOrHex = this.normalizeHex(vOrHex, rOrDefault);            //  - parse hex
      this.v = vOrHex.startsWithIC("a#");                        //  - assign v
      const shift = this.v ? 1 : 0;                              //  - shift for volumetric/additive prefix
      this.r = parseInt(vOrHex.slice(1 + shift, 3 + shift), 16); //  - assign red
      this.g = parseInt(vOrHex.slice(3 + shift, 5 + shift), 16); //  - assign green
      this.b = parseInt(vOrHex.slice(5 + shift, 7 + shift), 16); //  - assign blue
      this.a = parseInt(vOrHex.slice(7 + shift, 9 + shift), 16); //  - assign alpha
    } else {
      throw Error(`${Community.Lighting.name} - VRGBA constructor given incorrect parameters!`);
    }
  }

  /**
   * Creates a copy of the VRGBA object.
   * @returns {VRGBA}
   */
  clone() {
    let that = new VRGBA();
    [that.v, that.r, that.g, that.b, that.a] = [this.v, this.r, this.g, this.b, this.a];
    return that;
  }

  /**
   * Creates an VRGBA object will r,g,b = 0, a = 255, and v = false.
   * @returns {VRGBA}
   */
  static minRGBA() {
    let that = new VRGBA();
    [that.v, that.r, that.g, that.b, that.a] = [false, 0, 0, 0, 255];
    return that;
  }

  /**
   * Creates an VRGBA object will r,g,b,a = 255 and v = false.
   * @returns {VRGBA}
   */
  static maxRGBA() {
    let that = new VRGBA();
    [that.v, that.r, that.g, that.b, that.a] = [false, 255, 255, 255, 255];
    return that;
  }

  /**
   * Sets the v, r, b, g, or a properties to that of the cooresponding properties in the that Object.
   * @param {VRGBA} that
   */
  set(that) { for (let k in that) if (this[k] != null) this[k] = that[k]; }

  /**
   * Adds together the r, g, and b properties and returns the result.
   * @returns {Number}
   */
  magnitude() { return this.r + this.g + this.b; }

  /**
   * Attempts to normalize the provided hex String. If invalid, it then tries to normalize the provided altHex String.
   * If invalid, a default value of "#000000ff" is returned. If either provided String is valid, it will be returned
   * as an 'a#rrggbbaa' formatted color hex String.
   * @param {String} hex
   * @param {String} alt
   * @returns {String}
   */
  normalizeHex(hex, altHex) {
    if (typeof hex !== "string") return this.normalizeHex(altHex, "#000000ff");
    let h = hex.toLowerCase().trim();
    const s = hex.startsWithIC("a#") ? 1 : 0;                      // shift
    if (h.length == 4 + s) h += "f";                               // normalize #RGB format
    if (h.length == 5 + s) h = h.replace(/(^a?#)|(.)/g, "$1$2$2"); // normalize #RGBA
    if (h.length == 7 + s) h += "ff";                              // normalize #RRGGBB format
    if (!isValidColorRegex.test(h)) {
      console.log(`${Community.Lighting.name} - Invalid Color: ` + hex);
      return this.normalizeHex(altHex, "#000000ff");
    }
    return h;                                                      // return RRGGBBAA
  }

  /**
   * Converts the VRGBA Object into an 'a#rrggbbaa' formatted color hex string where the first 'a' tells whether the
   * hex is additive or not. The setWebSafe parameter is used to to strip the additive property (v) so that the
   * resulting color can be used with Canvas APIs. An override Object can be provided to override the existing v, r, g,
   * b, or a properties in the output.
   * @param {Boolean} setWebSafe
   * @param {VRGBA} override
   * @returns {String}
   */
  toHex(setWebSafe = false, override = undefined) {
    let temp = this.clone(); // create temporary copy
    for (let k in override) if (temp[k]) temp[k] = override[k]; // assign temporary setters
    if (temp.r.inRange(0, 255) && temp.g.inRange(0, 255) && temp.b.inRange(0, 255) && temp.a.inRange(0, 255)) {
      let rHex = (temp.r < 16 ? "0" : "") + Math.floor(temp.r).toString(16); // clamp to whole numbers
      let gHex = (temp.g < 16 ? "0" : "") + Math.floor(temp.g).toString(16);
      let bHex = (temp.b < 16 ? "0" : "") + Math.floor(temp.b).toString(16);
      let aHex = (temp.a < 16 ? "0" : "") + Math.floor(temp.a).toString(16);
      return (temp.v && !setWebSafe ? "a" : "") + "#" + rHex + gHex + bHex + aHex;
    }
    return null; // The hex color code doesn't exist
  }

  /**
   * Converts the VRGBA Object into a websafe '#rrggbbaa' formatted color hex string where the v property is stripped.
   * An override Object can be provided to override the existing r, g, b, or a properties in the output.
   * @param {Boolean} setWebSafe
   * @param {VRGBA} override
   * @returns {String}
   */
  toWebHex(override) { return this.toHex(true, override); }
}

/**
 * Class representing conditional light properties that can be changed.
 */
class LightProperties {
  /**
   * Creates a LightProperties object with the provided parameters
   * @param {LightType} type
   * @param {VRGBA}     color
   * @param {Boolean}   enable
   * @param {Number}    direction
   * @param {Number}    brightness
   * @param {Number}    xOffset
   * @param {Number}    yOffset
   * @param {Number}    xRadius
   * @param {Number}    yRadius
   * @param {Number}    beamLength
   * @param {Number}    beamWidth
   */
  constructor(type, color, enable, direction, brightness, xOffset, yOffset, xRadius, yRadius, beamLength, beamWidth) {
    this.name = LightProperties.name;
    // Always define in case durations aren't passed to targets
    this.transitionDuration = 0;
    this.pauseDuration      = 0;
    this.updateFrame        = 0;
    if (arguments.length == 0) return;
    // shared properties
    this.type       = type;
    this.color      = color;
    this.enable     = enable;
    this.brightness = brightness;
    this.xOffset    = xOffset;
    this.yOffset    = yOffset;
    // light type dependent properties
    let isOL = this.isOtherLight();
    let isFL = this.isFlashlight();
    if (isOL) this.xRadius    = xRadius;
    if (isOL) this.yRadius    = yRadius;
    if (isFL) this.clockwise  = true;
    if (isFL) this.direction  = direction;
    if (isFL) this.beamLength = beamLength;
    if (isFL) this.beamWidth  = beamWidth;
  }

  /**
   * Returns true if the light type is a flashlight or null; otherwise false.
   */
  isFlashlight() { return this.type == null || this.type.is(LightType.Flashlight); }

  /**
   * Returns true if the light type is light, fire, glow, or null; otherwise false.
   */
  isOtherLight() { return this.type == null || this.type.is(LightType.Light, LightType.fire, LightType.Glow); }

  /**
   * Processes and sets properties from a string array.
   * @param {String[]} properties
   */
  parseProps(properties) {
    this.updateFrame = Graphics.frameCount; // set current frame as update frame
    let isOL = this.isOtherLight();
    let isFL = this.isFlashlight();
    // properties with no suffix 'clear' the target
    properties.forEach((e) => {
      // clear checks (back to initial value for the given property)
      if      (        e.equalsIC('t'))  { this.transitionDuration = 0; return; }
      else if (        e.equalsIC('p'))  { this.pauseDuration      = 0; return; }
      else if (        e.equalsIC('#'))  { this.color      = void (0); return; }
      else if (        e.equalsIC('a#')) { this.color      = void (0); return; }
      else if (        e.equalsIC('e'))  { this.enable     = void (0); return; }
      else if (        e.equalsIC('b'))  { this.brightness = void (0); return; }
      else if (isOL && e.equalsIC('r'))  { this.xRadius    = void (0); return; }
      else if (isOL && e.equalsIC('xr')) { this.xRadius    = void (0); return; }
      else if (isOL && e.equalsIC('yr')) { this.yRadius    = void (0); return; }
      else if (        e.equalsIC('x'))  { this.xOffset    = void (0); return; }
      else if (        e.equalsIC('y'))  { this.yOffset    = void (0); return; }
      else if (isFL && e.equalsIC('l'))  { this.beamLength = void (0); return; }
      else if (isFL && e.equalsIC('w'))  { this.beamWidth  = void (0); return; }
      else if (isFL && e.equalsIC('a'))  { this.clockwise  = this.direction = void (0); return; }
      else if (isFL && e.equalsIC('+a')) { this.clockwise  = this.direction = void (0); return; }
      else if (isFL && e.equalsIC('-a')) { this.clockwise  = this.direction = void (0); return; }

      // parse suffix (individual & random ranges)
      let suffix, rand = (min, max) => Math.random() * (max - min) + min;
      if (!e.contains(':') && !e.contains('#')) {                               // single number
        suffix = orNaN(+e.slice(1), +e.slice(2), 0);                            // - get number
      } else if (!e.contains(':') && e.contains('#')) {                         // single color
        suffix = new VRGBA(e);                                                  // - get color
      } else if (!e.contains('#')) {                                            // number range
        let eSplit = e.split(':');                                              // - explode range
        let min = orNaN(+eSplit[0].slice(1), +eSplit[0].slice(2), 0);           // - get suffix (prefix size 1 or 2)
        let max = orNaN(+eSplit[1], 0);                                         // - get suffix (no prefix)
        suffix = e[0] != 'e' ? rand(min, max) : Math.floor(rand(min, max + 1)); // - for 'e' we need int ranges
      } else {                                                                  // color range
        let eSplit = e.split(':');                                              // - explode range
        let min = new VRGBA(eSplit[0]);                                         // - get the whole hex value
        let max = new VRGBA(eSplit[1]);                                         // - get the whole hex value
        suffix = new VRGBA(Boolean(Math.floor(rand(min.v, max.v + 1))), Math.floor(rand(min.r, max.r + 1)),
                                   Math.floor(rand(min.g, max.g + 1)),  Math.floor(rand(min.b, max.b + 1)),
                                   Math.floor(rand(min.a, max.a + 1)));
      }

      // prefix checks
      if (             e.startsWithIC('t'))    this.transitionDuration = suffix;
      else if (        e.startsWithIC('p'))    this.pauseDuration      = suffix;
      else if (        e.startsWithIC('#'))    this.color      = suffix;
      else if (        e.startsWithIC('a#'))   this.color      = suffix;
      else if (        e.startsWithIC('e'))    this.enable     = Boolean(suffix);
      else if (        e.startsWithIC('b'))    this.brightness = (suffix / 100).clamp(0, 1);
      else if (isOL && e.startsWithIC('r'))    this.xRadius    = suffix;
      else if (isOL && e.startsWithIC('xr'))   this.xRadius    = suffix;
      else if (isOL && e.startsWithIC('yr'))   this.yRadius    = suffix;
      else if (        e.startsWithIC('x'))    this.xOffset    = suffix;
      else if (        e.startsWithIC('y'))    this.yOffset    = suffix;
      else if (isFL && e.startsWithIC('l'))    this.beamLength = suffix;
      else if (isFL && e.startsWithIC('w'))    this.beamWidth  = suffix;
      else if (isFL && e.startsWithIC('a'))  { this.clockwise  = true;  this.direction = M_PI_180 * suffix; }
      else if (isFL && e.startsWithIC('+a')) { this.clockwise  = true;  this.direction = M_PI_180 * suffix; }
      else if (isFL && e.startsWithIC('-a')) { this.clockwise  = false; this.direction = M_PI_180 * suffix; }
    }, this);
  }

  /**
   * Creates a copy of the LightProperties object.
   * @returns {LightDelta}
   */
  clone() {
    let that = new LightProperties();
    if (this.transitionDuration != null) that.transitionDuration = this.transitionDuration;
    if (this.pauseDuration      != null) that.pauseDuration      = this.pauseDuration;
    if (this.updateFrame        != null) that.updateFrame        = this.updateFrame;
    if (this.type               != null) that.type               = this.type;
    if (this.enable             != null) that.enable             = this.enable;
    if (this.color              != null) that.color              = this.color     .clone();
    if (this.brightness         != null) that.brightness         = this.brightness.clone();
    if (this.xOffset            != null) that.xOffset            = this.xOffset   .clone();
    if (this.yOffset            != null) that.yOffset            = this.yOffset   .clone();
    if (this.xRadius            != null) that.xRadius            = this.xRadius   .clone();
    if (this.yRadius            != null) that.yRadius            = this.yRadius   .clone();
    if (this.clockwise          != null) that.clockwise          = this.clockwise .clone();
    if (this.beamLength         != null) that.beamLength         = this.beamLength.clone();
    if (this.beamWidth          != null) that.beamWidth          = this.beamWidth .clone();
    if (this.direction          != null) that.direction          = this.direction .clone();
    return that;
  }
}

/**
 * Class representing conditional light deltas that provides the ability to compute deltas between the
 * current parameter values and the target values.
 */
class LightDelta {
  /**
   * Creates a LightDelta object with the provided LightProperties.
   * @param {LightProperties} current
   * @param {LightProperties} target
   */
  constructor(current, target, defaults, fade = true) {
    this.name = LightDelta.name;
    if (arguments.length == 0) return;
    this.current  = current;
    this.target   = target;
    this.defaults = { // clone defaults to avoid self-loops (which breaks saving)
      color      : defaults.color.clone(),
      brightness : defaults.brightness,
      xOffset    : defaults.xOffset,
      yOffset    : defaults.yOffset,
      xRadius    : defaults.xRadius,
      yRadius    : defaults.yRadius,
      beamLength : defaults.beamLength,
      beamWidth  : defaults.beamWidth,
      direction  : defaults.direction
    };

    this.delta    = new LightProperties();

    // Assign currents if non-existent
    if (this.current.color == null)      this.current.color      = this.defaults.color;
    if (this.current.brightness == null) this.current.brightness = this.defaults.brightness;
    if (this.current.xOffset == null)    this.current.xOffset    = this.defaults.xOffset;
    if (this.current.yOffset == null)    this.current.yOffset    = this.defaults.yOffset;
    if (this.current.xRadius == null)    this.current.xRadius    = this.defaults.xRadius;
    if (this.current.yRadius == null)    this.current.yRadius    = this.defaults.yRadius;
    if (this.current.beamLength == null) this.current.beamLength = this.defaults.beamLength;
    if (this.current.beamWidth == null)  this.current.beamWidth  = this.defaults.beamWidth;
    if (this.current.direction == null)  this.current.direction  = this.defaults.direction;

    this.createDeltas(fade);
  }

  /**
   * Creates a copy of the LightDelta object.
   * @returns {LightDelta}
   */
  clone() {
    let that = new LightDelta();
    // clone durations
    if (this.current != null) that.current = this.current.clone();
    if (this.target  != null) that.target  = this.target.clone();
    if (this.delta   != null) that.delta   = this.delta.clone();
    return that;
  }

  /**
   * Create deltas from currents, targets, and transition duration. If fade is false, then the current will transition
   * to the target values instantly.
   *
   * @param {Boolean} fade
   */
  createDeltas(fade = true) {
    // Helper functions
    let normalizeAngle = (rads) => rads % (M_2PI) + (rads < 0) * M_2PI; // normalize between 0 & 2*Pi
    let normalizeClockwiseMovement = () => {
      this.current.direction = normalizeAngle(this.current.direction); // normalize already assigned current
      target.direction  = normalizeAngle(target.direction);  // convert target to radians before normalization
      if (this.current.direction > target.direction) target.direction += M_2PI; // clockwise normalize
    };
    let normalizeCounterClockwiseMovement = () => {
      this.current.direction = normalizeAngle(this.current.direction); // normalize already assigned current
      target.direction  = normalizeAngle(target.direction);  // convert target to radians before normalization
      if (this.current.direction < target.direction) target.direction -= M_2PI; // c-clockwise normalize
    };
    let createColor  = (...a) => !a.some(x => x == null) && ColorDelta.create(...a)  || void (0);
    let createNumber = (...a) => !a.some(x => x == null) && NumberDelta.create(...a) || void (0);

    // set delta creation at current frame time
    this.current.updateFrame = Graphics.frameCount;

    // Duplicate target so that any target normalization is local to this LightDelta instance
    let target = this.target.clone();

    // Cache light type
    let isOL = this.current.isOtherLight();
    let isFL = this.current.isFlashlight();

    // Set current durations or 0 if not fading
    this.current.transitionDuration = fade ? target.transitionDuration : 0;
    this.current.pauseDuration      = fade ? target.pauseDuration : 0;

    // Enable or disable the current immediately based off of target value
    this.current.enable = target.enable != null ? target.enable : this.defaults.enable;

    // For flashlights check the movement direction and normalize the current and target
    if (isFL && this.current.direction != null && target.direction != null && target.clockwise != null)
      void (target.clockwise ? normalizeClockwiseMovement() : normalizeCounterClockwiseMovement());

    // Set any null targets to default (normalization for nulls) (allows defaults to gradually transition)
    if (target.color == null)              target.color      = this.defaults.color;
    if (target.brightness == null)         target.brightness = this.defaults.brightness;
    if (target.xOffset == null)            target.xOffset    = this.defaults.xOffset;
    if (target.yOffset == null)            target.yOffset    = this.defaults.yOffset;
    if (isOL && target.xRadius == null)    target.xRadius    = this.defaults.xRadius;
    if (isOL && target.yRadius == null)    target.yRadius    = this.defaults.yRadius;
    if (isFL && target.beamLength == null) target.beamLength = this.defaults.beamLength;
    if (isFL && target.beamWidth == null)  target.beamWidth  = this.defaults.beamWidth;
    if (isFL && target.direction == null)  target.direction  = this.defaults.direction;

    // assign deltas if current & targets exist (only create deltas if supported by the light type)
              this.delta.color      = createColor (this.current.color,      target.color,      this.current.transitionDuration);
              this.delta.color      = createColor (this.current.color,      target.color,      this.current.transitionDuration);
              this.delta.brightness = createNumber(this.current.brightness, target.brightness, this.current.transitionDuration);
              this.delta.xOffset    = createNumber(this.current.xOffset,    target.xOffset,    this.current.transitionDuration);
              this.delta.yOffset    = createNumber(this.current.yOffset,    target.yOffset,    this.current.transitionDuration);
    if (isOL) this.delta.xRadius    = createNumber(this.current.xRadius,    target.xRadius,    this.current.transitionDuration);
    if (isOL) this.delta.yRadius    = createNumber(this.current.yRadius,    target.yRadius,    this.current.transitionDuration);
    if (isFL) this.delta.beamLength = createNumber(this.current.beamLength, target.beamLength, this.current.transitionDuration);
    if (isFL) this.delta.beamWidth  = createNumber(this.current.beamWidth,  target.beamWidth,  this.current.transitionDuration);
    if (isFL) this.delta.direction  = createNumber(this.current.direction,  target.direction,  this.current.transitionDuration);

    // assign new currents for existing deltas to propagate currents for duration = 0
    if (this.delta.color != null)      this.current.color      = this.delta.color     .get();
    if (this.delta.brightness != null) this.current.brightness = this.delta.brightness.get();
    if (this.delta.xOffset != null)    this.current.xOffset    = this.delta.xOffset   .get();
    if (this.delta.yOffset != null)    this.current.yOffset    = this.delta.yOffset   .get();
    if (this.delta.xRadius !=null)     this.current.xRadius    = this.delta.xRadius   .get();
    if (this.delta.yRadius !=null)     this.current.yRadius    = this.delta.yRadius   .get();
    if (this.delta.beamLength != null) this.current.beamLength = this.delta.beamLength.get();
    if (this.delta.beamWidth != null)  this.current.beamWidth  = this.delta.beamWidth .get();
    if (this.delta.direction != null)  this.current.direction  = this.delta.direction .get();
  }

  /**
   * Computes the next deltas in between the current parameters and target parameters.
   * @returns {this}
   */
  next() {
    // Compared the last time a delta has been generated to the last time the target has been updated
    if (this.current.updateFrame < this.target.updateFrame) this.createDeltas();
    // Check if transition and pause durations have reached zero
    if (this.finished()) return this;
    // only update if transition duration isn't 0 (finished)
    if (this.current.transitionDuration > 0) {
      if (this.delta.color      != null) this.current.color      = this.delta.color     .next().get();
      if (this.delta.brightness != null) this.current.brightness = this.delta.brightness.next().get();
      if (this.delta.xOffset    != null) this.current.xOffset    = this.delta.xOffset   .next().get();
      if (this.delta.yOffset    != null) this.current.yOffset    = this.delta.yOffset   .next().get();
      if (this.delta.xRadius    != null) this.current.xRadius    = this.delta.xRadius   .next().get();
      if (this.delta.yRadius    != null) this.current.yRadius    = this.delta.yRadius   .next().get();
      if (this.delta.beamLength != null) this.current.beamLength = this.delta.beamLength.next().get();
      if (this.delta.beamWidth  != null) this.current.beamWidth  = this.delta.beamWidth .next().get();
      if (this.delta.direction  != null) this.current.direction  = this.delta.direction .next().get();
      this.current.transitionDuration--;
    } else
      this.current.pauseDuration--;
    return this;
  }

  /**
   * Returns whether the light has finished transitioning and pausing.
   * @returns {Boolean}
   */
  finished() { return this.current.transitionDuration <= 0 && this.current.pauseDuration <= 0; }
}

/**
 * Class representing individual number deltas for providing number changes over time at different speeds.
 */
class NumberDelta {
  /**
   * Creates a number delta from the start number, target number, and duration.
   * @param {VRGBA}  start
   * @param {VRGBA}  target
   * @param {Number} duration
   * @returns {NumberDelta}
   */
  constructor(start, target, duration) {
    this.name = NumberDelta.name;
    if (arguments.length == 0) return;
    let delta = target == start ? 0 : (target - start) / duration;
    [this.current, this.target, this.duration, this.lazyEquals, this.delta] = [start, target, duration, false, delta];
    this.finished(); // check for duration = 0
  }

  /**
   * Creates a copy of the NumberDelta object.
   * @returns {NumberDelta}
   */
  clone() {
    let that = new NumberDelta();
    [that.current, that.target, that.duration, that.lazyEquals, that.delta] =
    [this.current, this.target, this.duration, this.lazyEquals, this.delta];
    return that;
  }

  /**
   * Creates a number delta from the start number, target number, and duration.
   * @param {VRGBA}  start
   * @param {VRGBA}  target
   * @param {Number} duration
   * @returns {NumberDelta}
   */
  static create(start, target, duration) { return new NumberDelta(start, target, duration); }

  /**
   * Computes the next delta number in between the current number and target number.
   * @returns {this}
   */
  next() {
    if (this.finished()) return this; // lazy-short-circuit
    if (this.current != this.target) this.current = Math.minmax(this.delta > 0, this.current + this.delta, this.target);
    this.duration -= 1;
    this.finished();
    return this;
  }

  /**
   * Returns the current delta number.
   * @returns {Number}
   */
  get() { return this.current; }

  /**
   * Returns true if the current number is equal to the target number; otherwise false.
   * @returns {Boolean}
   */
  finished() {
    if (this.lazyEquals) return true; // lazy-short-circuit comparison followed by real comparison
    if ((this.lazyEquals = this.duration <= 0))
      return (this.current = this.target, true); // set cur to refer to target on match
    return false;
  }
}

/**
 * Class representing a color delta for providing color changes over time at different speeds.
 */
class ColorDelta {
  /**
   * Create a color delta from the start color, target color, fade duration, and
   * whether to consider the remaining ticks or not for speed purposes.
   * @param {VRGBA}  start
   * @param {VRGBA}  target
   * @param {Number} fadeDuration
   * @param {Number} useTicksRemaining
   * @returns {ColorDelta}
   */
  constructor(start, target = start, fadeDuration = 0, useTicksRemaining = false) {
    this.name = ColorDelta.name;
    if (arguments.length == 0) return;
    this.current       = start.clone();           // - deep copy
    this.target        = target.clone();          // - deep copy
    this.fadeDuration  = orNaN(fadeDuration, 0);  // - use the remaining time (of the hour) or total fade duration
    this.fadeDuration -= (useTicksRemaining ? Community.Lighting.ticks() : 0);
    this.lazyEqual     = false;                   // - true when current value == target value
    this.delta         = new VRGBA(this.target.v, // - divide by zero is +inf or -inf so deltas work for speed = 0
                                  (this.target.r - this.current.r) / this.fadeDuration,
                                  (this.target.g - this.current.g) / this.fadeDuration,
                                  (this.target.b - this.current.b) / this.fadeDuration,
                                  (this.target.a - this.current.a) / this.fadeDuration);
    this.finished(); // check for duration = 0
  }
  /**
   * Creates a copy of the ColorDelta object.
   * @returns {ColorDelta}
   */
  clone() {
    let that = new  ColorDelta();
    that.current      = this.current.clone();
    that.target       = this.target.clone();
    that.fadeDuration = this.fadeDuration;
    that.lazyEquals   = this.lazyEquals;
    that.delta        = this.delta.clone();
    return that;
  }

  /**
   * Creates a light delta from the start color, target color, and fade duration.
   * @param {VRGBA}  start
   * @param {VRGBA}  target
   * @param {Number} fadeDuration
   * @returns {ColorDelta}
   */
  static create(start, target, fadeDuration) {
    return new ColorDelta(start, target, fadeDuration, false /* don't use remaining ticks */);
  }

  /**
   * Creates a map color delta from the current map tint, target tint, and fade duration.
   * @param {VRGBA}  targetTint
   * @param {Number} fadeDuration
   * @returns {ColorDelta}
   */
  static createTint(targetTint, fadeDuration = 0) {
    return new ColorDelta($gameVariables.GetTint(), targetTint, fadeDuration);
  }

  /**
   * Creates a battle color delta from the current battle tint, target tint, and fade duration.
   * @param {VRGBA}  targetTint
   * @param {Number} fadeDuration
   * @returns {ColorDelta}
   */
  static createBattleTint(targetTint, fadeDuration = 0) {
    return new ColorDelta($gameTemp._BattleTintTarget.current, targetTint, fadeDuration);
  }

  /**
   * Creates a time color delta from the current time and speed. useCurrentTint specifies whether to
   * fade from the current color to the target or to have the start color be the color it would
   * normally be at the given time interval (difference between current hour and next).
   * @param {Boolean} useCurrentTint
   * @returns {ColorDelta}
   */
  static createTimeTint(useCurrentTint = true) {
    let fadeDuration = 60 * $gameVariables.GetDaynightSpeed(); // fade duration
    if (useCurrentTint) { // delta should fade from current color to target
      return new ColorDelta($gameVariables.GetTint(), $gameVariables.GetTintByTime(1), fadeDuration, true);
    } else {              // start color should be the color it would normally be at the given time
      let CL = Community.Lighting; // reference CL
      let ticks    = fadeDuration == 0 ? CL.minutes() * 60 + CL.seconds() : CL.ticks();
      fadeDuration = fadeDuration == 0 ? 60 * 60 : fadeDuration; // dur = 0 needs a ref speed to compute the start color
      let delta = new ColorDelta($gameVariables.GetTintByTime(), $gameVariables.GetTintByTime(1), fadeDuration);
      delta.next(ticks); // get current color based off of ticks elapsed in hour
      return delta;
    }
  }

  /**
   * Computes the next delta color in between the current color and target color.
   * Scale is used to scale the delta increment by a factor of the scale amount.
   * @param {Number} scale
   * @returns {this}
   */
  next(scale = 1) {
    if (this.finished()) return this; // lazy-short-circuit
    let current = this.current, target = this.target, delta = this.delta; // reference
    if (current.v != target.v) current.v = target.v;  // Compute next step & clamp to target, check to avoid recomputing
    if (current.r != target.r) current.r = Math.minmax(delta.r > 0, current.r + scale * delta.r, target.r);
    if (current.g != target.g) current.g = Math.minmax(delta.g > 0, current.g + scale * delta.g, target.g);
    if (current.b != target.b) current.b = Math.minmax(delta.b > 0, current.b + scale * delta.b, target.b);
    if (current.a != target.a) current.a = Math.minmax(delta.a > 0, current.a + scale * delta.a, target.a);
    this.fadeDuration -= 1;
    return this;
  }

  /**
   * Returns the current delta color.
   * @returns {Number}
   */
  get() { return this.current.clone(); } // duplicate color so reference can't be messed with

  /**
   * Returns true if the current color is equal to the target; otherwise false.
   * @returns {Boolean}
   */
  finished() {
    if (this.lazyEquals) return true; // lazy-short-circuit comparison followed by real comparison
    if ((this.lazyEquals = this.fadeDuration <= 0)) return (this.current = this.target, true);
    return false;
   }
}

(function ($$) {

  class Mask_Bitmaps {
    constructor(width, height) {
      this.multiply = new Bitmap(width, height); // one big bitmap to fill the intire screen with black
      this.additive = new Bitmap(width, height);
    }
  }

  let cachedFunctions = false; // used pre-call some functions to force js engine to cache them early
  let GameLoaded = true;
  let ReloadMapEventsRequired = false;
  let colorcycle_count = [1000];
  let colorcycle_timer = [1000];
  let eventObjId = [];
  let event_id = [];
  let events;
  let event_stacknumber = [];
  let event_eventcount = 0;
  let light_tiles = [];
  let block_tiles = [];

  let parameters                = $$.parameters;
  let lightMaskPadding          = +parameters["Lightmask Padding"] || 0;
  let useSmootherLights         = orBoolean(parameters['Use smoother lights'], false);
  let light_event_required      = orBoolean(parameters["Light event required"], false);
  let triangular_flashlight     = orBoolean(parameters["Triangular flashlight"], false);
  let shift_lights_with_events  = orBoolean(parameters['Shift lights with events'], false);
  let player_radius             = +parameters['Player radius'] || 0;
  let reset_each_map            = orBoolean(parameters['Reset Lights'], false);
  let noteTagKey                = parameters["Note Tag Key"] !== "" ? parameters["Note Tag Key"] : false;
  let dayNightSaveSeconds       = +parameters['Save DaynightSeconds'] || 0;
  let dayNightSaveNight         = +parameters["Save Night Switch"] || 0;
  let dayNightNoAutoshadow      = orBoolean(parameters["No Autoshadow During Night"], false);
  let hideAutoShadow            = false;
  let daynightCycleEnabled      = orBoolean(parameters['Daynight Cycle'], true);
  let daynightTintEnabled       = false;
  let dayNightList              = (function (dayNight, nightHours) {
    let result = [];
    try {
      dayNight = JSON.parse(dayNight);
      nightHours = nightHours.split(",").map(x => x = +x);
      result = [];
      for (let i = 0; i < dayNight.length; i++)
        result[i] = { "color": new VRGBA(dayNight[i]), "isNight": nightHours.contains(i) };
    }
    catch (e) {
      let CL = Community.Lighting;
      console.log(`${CL.name} - Night Hours and/or DayNight Colors contain invalid JSON data - cannot parse.`);
      result = new Array(24).fill(undefined).map(() => ({ "color": VRGBA.minRGBA(), "isNight": false }));
    }
    return result;
  })(parameters["DayNight Colors"], parameters["Night Hours"]);
  let flashlightYoffset = Number(parameters['Flashlight offset']) || 0;
  let flashlightXoffset = Number(parameters['Flashlight X offset']) || 0;
  let killswitch = parameters['Kill Switch'] || 'None';
  if (killswitch !== 'A' && killswitch !== 'B' && killswitch !== 'C' && killswitch !== 'D') {
    killswitch = 'None'; //Set any invalid value to no switch
  }
  let killSwitchAuto = orBoolean(parameters['Kill Switch Auto'], false);
  let optionText = parameters["Options Menu Entry"] || "";
  let lightInBattle = orBoolean(parameters['Battle Tinting'], false);
  let battleMaskPosition = parameters['Light Mask Position'] || 'Above';
  if (!battleMaskPosition.equalsIC('Above', 'Between')) {
    battleMaskPosition = 'Above'; //Get rid of any invalid value
  }

  let options_lighting_on = true;
  let maxX = (Number(parameters['Screensize X']) || 816) + 2 * lightMaskPadding;
  let maxY = Number(parameters['Screensize Y']) || 624;
  let notetag_reg = RegExp("<" + noteTagKey + ":[ ]*([^>]+)>", "i");
  $$.getFirstComment = function (page) {
    let result = null;
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
  $$.getDayNightList = function () {
    return dayNightList;
  };
  $$.saveTime = function () {
    let index = $gameVariables.GetDaynightColorArray()[$$.hours()];
    if (dayNightSaveSeconds > 0) $gameVariables.setValue(dayNightSaveSeconds, $gameVariables.GetDaynightSeconds());
    if (dayNightSaveNight > 0 && index instanceof Object) $gameSwitches.setValue(dayNightSaveNight, index.isNight);
    if (dayNightNoAutoshadow && index instanceof Object && index.isNight !== hideAutoShadow) {
      hideAutoShadow = index.isNight; // We can not use $$.isNight because DaynightCycle hasn't been updated yet!
      // Update the shadow manually
      if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._tilemap) {
        SceneManager._scene._spriteset._tilemap.refresh();
      }
    }
  };
  $$.isNight = function () {
    let hour = $$.hours();
    return dayNightList[hour] instanceof Object ? dayNightList[hour].isNight : false;
  };
  $$.hours   = () => Math.floor($gameVariables.GetDaynightSeconds () / (60 * 60));
  $$.minutes = () => Math.floor($gameVariables.GetDaynightSeconds () / 60) % 60;
  $$.seconds = () => Math.floor($gameVariables.GetDaynightSeconds() % 60);
  $$.ticks   = () => Math.floor($$.seconds() / $gameVariables.GetDaynightTick() + $$.minutes() *
                                $gameVariables.GetDaynightSpeed());
  $$.time = function (showSeconds) {
    let result = $$.hours() + ":" + $$.minutes().padZero(2);
    if (showSeconds) result = result + ":" + $$.seconds().padZero(2);
    return result;
  };

  let _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    GameLoaded = true; // mark the game as newly loaded to construct things properly _UpdateMask later
    _DataManager_extractSaveContents.call(this, contents);
    return;
  };

  /**
  * Tests the value at the specified index of the $gameTemp object for equality with the
  * passed in value and sets it. Returns true if the values match, or false otherwise.
  * @param {String} index
  * @param {any}    value
  * @returns {Boolean}
  */
  Game_Temp.prototype.testAndSet = function (index, value) {
    if (this[index] && this[index] == value) return false;
    return (this[index] = value, true);
  };

  let _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function () { // Hook Game_Event.setupPage() to detect page changes
    _Game_Event_setupPage.call(this);
    ReloadMapEventsRequired = true; // force refresh
  };
  let _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function () { // hook $GameMap.setupEvents() and _events to detect event changes.
    _Game_Map_setupEvents.call(this);
    this._events = new Proxy(this._events, { // called on events pop, push, splice, assign
      set: function (...a) { ReloadMapEventsRequired = true; return Reflect.set(...a); }
    }); // force refresh
  };
  Game_Event.prototype.getCLTag = function () {
    let result;
    let pageNote = noteTagKey ? $$.getFirstComment(this.page()) : null;
    let note = this.event().note;
    if (pageNote) result = $$.getCLTag(pageNote);
    if (!result) result = $$.getCLTag(note);
    return result || "";
  };
  Game_Event.prototype.initLightData = function () {   // Event note tag caching
    this._cl = {};
    this._cl.lastLightPage = this._pageIndex;
    let tagData = this.getCLTag().toLowerCase();

    // parse new cycle groups format within {} braces and extract from tag data for separate handling
    // old cycle groups are parsed in tagData loop below and are converted to the new group format
    let cycleGroups = [];
    tagData = tagData.replace(/\{(.*?)\}/g, (_, group) => ((cycleGroups.push(group.split(/\s+/)), '')));
    tagData = tagData.split(/\s+/);
    this._cl.type = LightType[tagData.shift()];
    // Handle parsing of light, fire, and flashlight
    if (this._cl.type) {
      let isFL       = ()             => this._cl.type.is(LightType.Flashlight); // is flashlight
      let isEq       = (e, s0, s1)    => s0 && e.equalsIC(s0)     || s1 && e.equalsIC(s1);
      let isPre      = (e, p0, p1)    => p0 && e.startsWithIC(p0) || p1 && e.startsWithIC(p1);
      let isPreNum   = (e, p, n0, n1) => p && e.startsWithIC(p) && !isNaN(n0) && (n1 == void (0) || !isNaN(n1));
      let isNul      = (e)            => e == null;
      let isDayNight = (e)            => isEq(e, "night", "day");
      let getNum     = (e)            => orNaN(+e.slice(1).split(":")[0], +e.slice(2).split(":")[0]);
      let getNum2    = (e)            => orNaN(+e.slice(1).split(":")[1], +e.slice(2).split(":")[1]);
      let cycleIndex, hasCycle = false;
      tagData.forEach((e) => {
        let n  = getNum(e);
        let n2 = getNum2(e);
        if      (!isFL() && isPreNum(e, 'r', n)     && isNul(this._cl.xRadius))    this._cl.xRadius    = n;
        else if (!isFL() && isPreNum(e, 'xr', n)    && isNul(this._cl.xRadius))    this._cl.xRadius    = n;
        else if (!isFL() && isPreNum(e, 'yr', n)    && isNul(this._cl.yRadius))    this._cl.yRadius    = n;
        else if (!isFL() && !isNaN(+e)              && isNul(this._cl.xRadius))    this._cl.xRadius    = +e;
        else if (isFL()  && !isNaN(+e)              && isNul(this._cl.beamLength)) this._cl.beamLength = +e;
        else if (isFL()  && !isNaN(+e)              && isNul(this._cl.beamWidth))  this._cl.beamWidth  = +e;
        else if (isFL()  && isPreNum(e, 'l', n)     && isNul(this._cl.beamLength)) this._cl.beamLength = n;
        else if (isFL()  && isPreNum(e, 'w', n)     && isNul(this._cl.beamWidth))  this._cl.beamWidth  = n;
        else if (           isEq(e, 'cycle')        && isNul(this._cl.color))      hasCycle            = true;
        else if (           isPre(e, '#', 'a#')     && hasCycle)                   cycleIndex = cycleGroups.push([e]) - 2;
        else if (           !isNaN(+e)              && cycleGroups[cycleIndex])    cycleGroups[cycleIndex] .push('p' + e);
        else if (           isPre(e, '#', 'a#')     && isNul(this._cl.color))      this._cl.color      = new VRGBA(e);
        else if (           isPreNum(e, 'e', n)     && isNul(this._cl.enable))     this._cl.enable     = Boolean(n);
        else if (           isOn(e)                 && isNul(this._cl.enable))     this._cl.enable     = true;
        else if (           isOff(e)                && isNul(this._cl.enable))     this._cl.enable     = false;
        else if (           isDayNight(e)           && isNul(this._cl.switch))     this._cl.switch     = e;
        else if (           isPreNum(e, 'b', n)     && isNul(this._cl.brightness)) this._cl.brightness = (n / 100).clamp(0, 1);
        else if (!isFL() && isPreNum(e, 'd', n)     && isNul(this._cl.direction))  this._cl.direction  = n;
        else if (!isFL() && isPreNum(e, 'a', n, n2) && isNul(this._cl.direction))  this._cl.direction  = [Math.PI / 180 * n, Math.PI / 180 * n2];
        else if ( isFL() && !isNaN(+e)              && isNul(this._cl.direction))  this._cl.direction  = +e;
        else if ( isFL() && isPreNum(e, 'd', n)     && isNul(this._cl.direction))  this._cl.direction  = CLDirectionMap[n];
        else if ( isFL() && isPreNum(e, 'a', n)     && isNul(this._cl.direction))  this._cl.direction  = Math.PI / 180 * n;
        else if (           isPreNum(e, 'x', n)     && isNul(this._cl.xOffset))    this._cl.xOffset    = n;
        else if (           isPreNum(e, 'y', n)     && isNul(this._cl.yOffset))    this._cl.yOffset    = n;
        else if (           e.length > 0            && isNul(this._cl.id))         this._cl.id         = e;
        cycleIndex += 1; // increment index. Valid for 1 iteration after a cycle color is parsed before OOB.
      }, this);

      // normalize parameters
      this._cl.xRadius    = orNaN(this._cl.xRadius, 0);
      this._cl.yRadius    = orNaN(this._cl.yRadius, 0);
      this._cl.color      = orNullish(this._cl.color, VRGBA.minRGBA());
      this._cl.enable     = orBoolean(this._cl.enable, this._cl.id ? false : true);
      this._cl.brightness = orNaN(this._cl.brightness, 0);
      this._cl.direction  = orNullish(this._cl.direction, undefined); // must be undefined for later checks
      this._cl.id         = orNullish(this._cl.id, 0); // Alphanumeric
      this._cl.beamLength = orNaN(this._cl.beamLength, 0);
      this._cl.beamWidth  = orNaN(this._cl.beamWidth, 0);
      this._cl.xOffset    = orNaN(this._cl.xOffset, 0);
      this._cl.yOffset    = orNaN(this._cl.yOffset, 0);
      this._cl.cycle      = this._cl.cycle || null;

      // Store initial light properties
      let props = [this._cl.color, this._cl.enable, this._cl.direction, this._cl.brightness, this._cl.xOffset,
                   this._cl.yOffset, this._cl.xRadius, this._cl.yRadius, this._cl.length, this._cl.width];

      // create initial properties
      let startProps = new LightProperties(this._cl.type, ...props);

      // Process cycle parameters - for each cycle group create currentProps and targetProps and cooresponding light
      // delta. Then put the deltas into a list to loop/cycle through repeatedly. Note: Last cycle targets first.
      if (cycleGroups.length) { // check if tag included color cycling
        this._cl.cycle = [];     // only define if cycle exists
        let currentProps = startProps, targetProps;
        cycleGroups.forEach((e, i, a) => {                                          // ------ loop each group ------
          let n = a[++i < a.length ? i : 0];                                        // - get next element
          currentProps = currentProps.clone();                                      // - inherit existing props
          currentProps.parseProps(e);                                               // - parse for new props
          targetProps = i == a.length ? startProps : currentProps.clone();          // - create target props
          targetProps.parseProps(n);                                                // - parse for new props
          this._cl.cycle.push(new LightDelta(currentProps, targetProps, this._cl)); // - create light delta object
        }, this);                                                                   // -----------------------------
        let delta = this._cl.cycle.shift(); // pop front
        this._cl.delta = delta.clone();     // clone front as the initial lightDelta state for this cond light
        this._cl.cycle.push(delta);         // push original on back of list
      }
      // Process conditional lighting - for a cond light, currentProps are light specific and targets are shared by ID
      // a target can be updated on the fly using commands and all lights with matching IDs will use the properties
      else if (this._cl.id) { // check for a conditional lighting ID
        let lightArray = $gameVariables.GetLightArray();                            // get target light Object
        if (lightArray[this._cl.id] == null)                                        // check if shared target exists
          lightArray[this._cl.id] = new LightProperties();                          // - if not, create empty reference
        let targetProps = lightArray[this._cl.id];                                  // get target prop reference
        this._cl.delta  = new LightDelta(startProps, targetProps, this._cl, false); // create light delta object
      }
    }
  };
  Game_Event.prototype.cycleLightingNext = function () {
    let cycleList = this.getLightCycle();
    if (cycleList && this._cl.delta && this._cl.delta.finished()) {
      let delta = cycleList.shift();  // pop delta from front
      this._cl.delta = delta.clone(); // duplicate delta
      cycleList.push(delta);          // push delta on back
    }
  };
  Game_Event.prototype.conditionalLightingNext = function () {
    if (this.getLightCycle() || this.getLightId()) this._cl.delta.next();
  };
  Game_Event.prototype.getLightEnabled          = function () {
    if (!this._cl.switch) return this._cl.delta ? this._cl.delta.current.enable : this._cl.enable;
    return (this._cl.switch.equalsIC("night") && $$.isNight()) ||
           (this._cl.switch.equalsIC("day")   && !$$.isNight());
  };
  Game_Event.prototype.getLightType             = function () { return this._cl.type; };
  Game_Event.prototype.getLightXRadius          = function () { return this._cl.delta ? this._cl.delta.current.xRadius       : this._cl.xRadius; };
  Game_Event.prototype.getLightYRadius          = function () { return this._cl.delta ? this._cl.delta.current.yRadius       : this._cl.yRadius; };
  Game_Event.prototype.getLightColor            = function () { return this._cl.delta ? this._cl.delta.current.color.clone() : this._cl.color.clone(); };
  Game_Event.prototype.getLightBrightness       = function () { return this._cl.delta ? this._cl.delta.current.brightness    : this._cl.brightness; };
  Game_Event.prototype.getLightDirection        = function () { return this._cl.delta ? this._cl.delta.current.direction     : this._cl.direction ; };
  Game_Event.prototype.getLightId               = function () { return this._cl.id; };
  Game_Event.prototype.getLightFlashlightLength = function () { return this._cl.delta ? this._cl.delta.current.beamLength    : this._cl.beamLength; };
  Game_Event.prototype.getLightFlashlightWidth  = function () { return this._cl.delta ? this._cl.delta.current.beamWidth     : this._cl.beamWidth; };
  Game_Event.prototype.getLightXOffset          = function () { return this._cl.delta ? this._cl.delta.current.xOffset       : this._cl.xOffset; };
  Game_Event.prototype.getLightYOffset          = function () { return this._cl.delta ? this._cl.delta.current.yOffset       : this._cl.yOffset; };
  Game_Event.prototype.getLightCycle            = function () { return this._cl.cycle; };

  let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (typeof command !== 'undefined') this.communityLighting_Commands(command, args);
  };

  let _Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
  Game_Player.prototype.clearTransferInfo = function () {
    _Game_Player_clearTransferInfo.call(this);
    if (reset_each_map) {
      $gameVariables.SetLightArray({});
      $$.defaultBrightness = 0;
      $$.mapBrightness = undefined;
      $gameVariables.SetTint(null);
      $gameVariables.SetTintTarget(null);
    }
  };
  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.communityLighting_Commands = function (command, args) {
    $$.interpreter = this; //assign 'local' interpreter (for parallel processes)
    command = command.toLowerCase();

    const allCommands = {
      tileblock: 'addTileBlock', regionblock: 'addTileBlock', tilelight: 'addTileLight', regionlight: 'addTileLight',
      tilefire: 'addTileLight', regionfire: 'addTileLight', tileglow: 'addTileLight', regionglow: 'addTileLight',
      tint: 'tint', daynight: 'dayNight', flashlight: 'flashLight', setfire: 'setFire', fire: 'fire', light: 'light',
      script: 'scriptF', reload: 'reload', tintbattle: 'tintbattle'
    };
    const result = allCommands[command];
    if (result) this[result](command, args);
  };

  if (isRMMZ()) { // RMMZ only command interface
    let mapOnOff = a  => a.enabled === "true" ? "on" : "off";
    let hasWait  = a  => a.wait === "true";
    let tileType = a  => (a.tileType === "terrain" ? "tile" : "region") + (a.lightType ? a.lightType : "block");
    let tintType = () => $gameParty.inBattle() ? "tintbattle" : "tint";
    let timeMode = a  => a.cycles ? 'cycles' : '';
    let dayMode =  a  => a.fade === "true" ? "fade" : "";
    let tintMode = a  => a.color ? "set" : "reset";
    let mathMode = a  => a.mode === "set" ? "hour" : a.mode; // set, add, or subtract.
    let showMode = a  => a.enabled.equalsIC("true") ? (a.showSeconds.equalsIC("true") ? "showseconds" : "show") : "hide";
    let radMode  = a  => +a.fadeSpeed ? "radiusgrow" : "radius";

    let r = PluginManager.registerCommand.bind(PluginManager, $$.name); // registar bound with first parameter.
    let f = (c, a) => $$.interpreter.communityLighting_Commands(c, a.filter(_ => _ !== "")); //command wrapper.

    r("masterSwitch",       function (a) { $$.interpreter = this; f("script",     [mapOnOff(a)]); });
    r("tileBlock",          function (a) { $$.interpreter = this; f(tileType(a),  [a.id, mapOnOff(a), a.color, a.shape, a.xOffset, a.yOffset, a.blockWidth, a.blockHeight]); });
    r("tileLight",          function (a) { $$.interpreter = this; f(tileType(a),  [a.id, mapOnOff(a), a.color, a.radius, a.brightness]); });
    r("daynightEnable",     function (a) { $$.interpreter = this; f("daynight",   [mapOnOff(a), dayMode(a)]); });
    r("setTimeSpeed",       function (a) { $$.interpreter = this; f("dayNight",   ["speed", a.speed]); });
    r("setTime",            function (a) { $$.interpreter = this; f("dayNight",   [mathMode(a), a.hours, a.minutes, dayMode(a)]); });
    r("setHoursInDay",      function (a) { $$.interpreter = this; f("dayNight",   ["hoursinday", a.hours, dayMode(a)]); });
    r("showTime",           function (a) { $$.interpreter = this; f("dayNight",   [showMode(a)]); });
    r("setHourColor",       function (a) { $$.interpreter = this; f("dayNight",   ["color", a.hour, a.color, dayMode(a)]); });
    r("flashlight",         function (a) { $$.interpreter = this; f("flashLight", [mapOnOff(a), a.beamLength, a.beamWidth, a.color, a.density]); });
    r("setFire",            function (a) { $$.interpreter = this; f("setFire",    [a.radiusShift, a.redYellowShift]); });
    r("playerLightRadius",  function (a) { $$.interpreter = this; f("light",      [radMode(a), a.radius, a.color, "B" + a.brightness, a.fadeSpeed]); });
    r("activateById",       function (a) { $$.interpreter = this; f("light",      [mapOnOff(a), a.id]); });
    r("lightColor",         function (a) { $$.interpreter = this; f("light",      ["color", a.id, a.color]); });
    r("resetLightSwitches", function ()  { $$.interpreter = this; f("light",      ["switch", "reset"]); });
    r("setTint",            function (a) { $$.interpreter = this; f(tintType(),   [tintMode(a), a.color, a.fadeSpeed, timeMode(a)]); if (hasWait(a)) f(tintType(), ["wait"]); });
    r("resetTint",          function (a) { $$.interpreter = this; f(tintType(),   ["reset", a.fadeSpeed, timeMode(a)]); if (hasWait(a)) f(tintType(), ["wait"]); });
    r("waitTint",           function ()  { $$.interpreter = this; f(tintType(),   ["wait"]); });
    r("condLight",          function (a) { $$.interpreter = this; f("light",      ["cond", a.id].concat(a.properties.split(/\s+/))); if (hasWait(a)) f("light", ["wait", a.id]); });
    r("condLightWait",      function (a) { $$.interpreter = this; f("light",      ["wait", a.id]); });
  }

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
    let index = tilearray.findIndex(e => e.tileType === tile.tileType && e.lightType === tile.lightType &&
                                    e.id === tile.id);
    void (index === -1 ? tilearray.push(tile) : tilearray[index] = tile);
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
    void (index === -1 ? tilearray.push(tile) : tilearray[index] = tile);
    $gameVariables.SetTileBlockArray(tilearray);
    $$.ReloadTagArea();
  };

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.tint = (command, args) => $$.tint(args);

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.tintbattle = (command, args) => $$.tintbattle(args);

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.dayNight = (command, args) => $$.DayNight(args);

  /**
     *
     * @param {String} command
     * @param {String[]} args
     */
  Game_Interpreter.prototype.flashLight = (command, args) => $$.flashlight(args);

  /**
   *
   * @param {String} command
   * @param {String[]} args
   */
  Game_Interpreter.prototype.setFire = function (command, args) {
    $gameVariables.SetFireRadius(args[0]);
    $gameVariables.SetFireColorshift(args[1]);
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

  Spriteset_Map.prototype.createLightmask = function () {
    this._lightmask = new Lightmask();
    this.addChild(this._lightmask);
  };

  function Lightmask() { this.initialize.apply(this, arguments); }

  Lightmask.prototype = Object.create(PIXI.Container.prototype);
  Lightmask.prototype.constructor = Lightmask;

  Lightmask.prototype.initialize = function () {
    PIXI.Container.call(this);
    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];
    this._createBitmaps();
  };

  //Updates the Lightmask for each frame.

  Lightmask.prototype.update = function () { this._updateMask(); };

  //@method _createBitmaps
  Lightmask.prototype._createBitmaps = function () {
    this._maskBitmaps = new Mask_Bitmaps(maxX, maxY);
  };

  let _Game_Map_prototype_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function () {
    _Game_Map_prototype_setupEvents.call(this);
    $$.ReloadMapEvents();
  };

  Lightmask.prototype._updateMask = function () {
    // ****** DETECT MAP CHANGES ********
    let map_id = $gameMap.mapId();
    if (map_id != $gameVariables.GetOldMapId()) {
      daynightTintEnabled = false; // reset daynight tint on map load
      $gameVariables.SetOldMapId(map_id);
      $gameVariables._cl = {}; // empty init game var light data on map load
      // recalc tile and region tags.
      $$.ReloadTagArea();

      //clear color cycle arrays
      for (let i = 0; i < 1000; i++) {
        colorcycle_count[i] = 0;
        colorcycle_timer[i] = 0;
      }

      $$.ReloadMapEvents();  // reload map events on map change
    }

    // remove all old sprites
    for (let i = 0, len = this._sprites.length; i < len; i++) this._removeSprite();

    // No lighting on maps less than 1 || Plugin deactivated in options || Plugin deactivated by plugin command
    if (map_id <= 0 || !options_lighting_on || !$gameVariables.GetScriptActive()) return;

    // reload map when a refresh is requested (event erase, page change, or _events object change) or game loaded
    if (ReloadMapEventsRequired || GameLoaded) {
      ReloadMapEventsRequired = false;
      $$.ReloadMapEvents();
    }

    // If no lightsources on this map, no lighting if light_event_required set to true.
    if (light_event_required && eventObjId.length <= 0) return;

    this._addSprite(-lightMaskPadding, 0, this._maskBitmaps.multiply, PIXI.BLEND_MODES.MULTIPLY);
    this._addSprite(-lightMaskPadding, 0, this._maskBitmaps.additive, PIXI.BLEND_MODES.ADD);

    // ******** GROW OR SHRINK GLOBE PLAYER *********
    let firstrun = $gameVariables.GetFirstRun();
    if (firstrun === true) {
      $gameVariables.SetFirstRun(false);
      player_radius = +parameters['Player radius'];
      $gameVariables.SetRadius(player_radius);
    } else {
      player_radius = $gameVariables.GetRadius();
    }

    // compute radius lightgrow.
    let lightgrow_target = $gameVariables.GetRadiusTarget();
    let lightgrow_speed = (player_radius < lightgrow_target ? 1 : -1) * $gameVariables.GetRadiusSpeed();
    if (lightgrow_speed != 0 && player_radius != lightgrow_target) {
      player_radius = Math.minmax(lightgrow_speed > 0, player_radius + lightgrow_speed, lightgrow_target); // clamp
      $gameVariables.SetRadius(player_radius);
    }

    // ****** PLAYER LIGHTGLOBE ********
    let ctxMul = this._maskBitmaps.multiply.context;
    let ctxAdd = this._maskBitmaps.additive.context;
    this._maskBitmaps.multiply.fillRect(0, 0, maxX, maxY, '#000000');
    this._maskBitmaps.additive.fillRect(0, 0, maxX, maxY, '#000000');

    ctxMul.globalCompositeOperation = 'lighter';
    ctxAdd.globalCompositeOperation = 'lighter';
    let pw = $gameMap.tileWidth();
    let ph = $gameMap.tileHeight();
    let dx = $gameMap.displayX();
    let dy = $gameMap.displayY();
    let px = $gamePlayer._realX;
    let py = $gamePlayer._realY;
    let pd = RMDirectionMap[$gamePlayer._direction];
    let x1 = (pw / 2) + ((px - dx) * pw);
    let y1 = (ph / 2) + ((py - dy) * ph);
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
    let playercolor      = $gameVariables.GetPlayerColor();
    let flashlightlength = $gameVariables.GetFlashlightLength();
    let flashlightwidth  = $gameVariables.GetFlashlightWidth();
    let playerflicker    = $gameVariables.GetFire();
    let playerbrightness = $gameVariables.GetPlayerBrightness();
    let iplayer_radius   = Math.floor(player_radius);

    if (playerflashlight == true) {
      this._maskBitmaps.radialgradientFlashlight(x1, y1, playercolor, pd, flashlightlength, flashlightwidth);
    }
    if (iplayer_radius > 0) {
      x1 = x1 - flashlightXoffset;
      y1 = y1 - flashlightYoffset;
      if (iplayer_radius < 100) {
        // dim the light a bit at lower lightradius for a less focused effect.
        playercolor.r = Math.max(0, playercolor.r - 50);
        playercolor.g = Math.max(0, playercolor.g - 50);
        playercolor.b = Math.max(0, playercolor.b - 50);
      }
      this._maskBitmaps.radialgradientFillRect(x1, y1, iplayer_radius, null, playercolor, playerflicker, playerbrightness);
    }

    // *********************************** DAY NIGHT CYCLE TIMER **************************
    if (daynightCycleEnabled) { //
      let speed = $gameVariables.GetDaynightSpeed();
      if (speed > 0 && speed < 5000) {
        if ($gameTemp.testAndSet('_daynightTimeout', Math.floor((new Date()).getTime() / 10))) {
          let seconds = $gameVariables.GetDaynightSeconds();                   // current time in seconds
          seconds += $gameVariables.GetDaynightTick();                         // add tick amount in (seconds)
          let secondsinDay = $gameVariables.GetDaynightHoursinDay() * 60 * 60; // convert to total seconds in day
          if (seconds >= secondsinDay) seconds = 0;                            // clamp
          $gameVariables.SetDaynightSeconds(seconds);                          // set
          $$.saveTime();                                                       // save
          // Set target to the next hour tint if enabled and the tint matches the current target
          if (daynightTintEnabled && $gameVariables.GetTintTarget().finished()) {
            let delta = ColorDelta.createTimeTint(true, 60 * speed);
            $gameVariables.SetTint(delta.get());
            $gameVariables.SetTintTarget(delta);
          }
        }
      }
    }

    // ********** OTHER LIGHTSOURCES **************
    for (let i = -1, len = eventObjId.length; i < len; i++) {
      let evid, cur;
      if (i != -1) {
        evid = event_id[i];
        cur  = events[eventObjId[i]];
      } else { // call the functions early to cache them. Avoids some stuttering on first calls.
        if (!cachedFunctions) {
          cachedFunctions = true;
          let props = [VRGBA.minRGBA(), true, 0, 0, 0, 0, 20, 20, 20];
          let s0 = new LightProperties(LightType.Light, ...props);
          let s1 = new LightProperties(LightType.Flashlight, ...props);
          let t0 = s0.clone(), t1 = s1.clone();
          t0.parseProps(['t1', 'p1', 'a#FFFFFF', 'e1', 'b1', 'x1', 'y1', 'r20', 'l20', 'w20', 'a20', '+a20', '-a20']);
          t1.parseProps(['t1', 'p1', 'a#FFFFFF', 'e1', 'b1', 'x1', 'y1', 'r20', 'l20', 'w20', 'a20', '+a20', '-a20']);
          let d0 = new LightDelta(s0, t0, s0).clone(), d1 = new LightDelta(s1, t1, s0).clone();
          d0.next(); d1.next();
          this._maskBitmaps.radialgradientFillRect(0, 0, 10, 10, VRGBA.minRGBA(), true, 0, 0);
          this._maskBitmaps.radialgradientFlashlight(0, 0, VRGBA.minRGBA(), 0, 20, 20, LightType.Flashlight);
          this._maskBitmaps.radialgradientFlashlight(0, 0, VRGBA.minRGBA(), 0, 20, 20, LightType.Conelight);
          this._maskBitmaps.radialgradientFlashlight(0, 0, VRGBA.minRGBA(), 0, 20, 20, LightType.Spotlight);
        }
        continue;
      }

      if (cur._cl == null) {
        cur.initLightData();
        $gameVariables._cl[evid] = cur._cl; // store the current light data in gamevars so it gets saved
      }

      let lightsOnRadius = $gameVariables.GetActiveRadius();
      if (lightsOnRadius > 0) {
        let distanceApart = Math.round(Community.Lighting.distance($gamePlayer.x, $gamePlayer.y, cur._realX, cur._realY));
        if (distanceApart > lightsOnRadius) {
          continue;
        }
      }

      let lightType = cur.getLightType();
      if (lightType) {
        cur.cycleLightingNext();       // Cycle colors
        cur.conditionalLightingNext(); // conditional lighting
        let objectflicker  = lightType.is(LightType.Fire);
        let lightId        = cur.getLightId();
        let color          = cur.getLightColor();      // light color
        let direction      = cur.getLightDirection();  // direction
        let brightness     = cur.getLightBrightness(); // brightness
        let xOffset        = cur.getLightXOffset() * $gameMap.tileWidth();
        let yOffset        = cur.getLightYOffset() * $gameMap.tileHeight();
        let state          = cur.getLightEnabled();    // checks for on, off, day, and night

        // Set kill switch to ON if the conditional light is deactivated,
        // or to OFF if it is active.
        if (lightId && killSwitchAuto && killswitch !== 'None') {
          let key = [map_id, evid, killswitch];
          if ($gameSelfSwitches.value(key) === state) $gameSelfSwitches.setValue(key, !state);
        }
        // kill switch
        if (killswitch !== 'None' && state) {
          let key = [map_id, evid, killswitch];
          if ($gameSelfSwitches.value(key) === true) state = false;
        }
        // show light
        if (state === true) {
          let lx1 = events[event_stacknumber[i]].screenX();
          let ly1 = events[event_stacknumber[i]].screenY() - 24;
          if (!shift_lights_with_events) {
            ly1 += events[event_stacknumber[i]].shiftY();
          }

          // apply offsets
          lx1 += +xOffset;
          ly1 += +yOffset;

          if (lightType.is(LightType.Flashlight)) {
            let ldir = RMDirectionMap[events[event_stacknumber[i]]._direction] || 0;
            let flashlength = cur.getLightFlashlightLength();
            let flashwidth  = cur.getLightFlashlightWidth();
            if (!isNaN(direction)) ldir = direction;
            this._maskBitmaps.radialgradientFlashlight(lx1, ly1, color, ldir, flashlength, flashwidth);
          } else if (lightType.is(LightType.Light, LightType.Fire)) {
            let xRadius = cur.getLightXRadius();
            let yRadius = cur.getLightYRadius();
            this._maskBitmaps.radialgradientFillRect(lx1, ly1, xRadius, yRadius, color, objectflicker, brightness, direction);
          }
        }
      }
    }

    // *************************** TILE TAG *********************
    //glow/colorfade
    if ($gameTemp.testAndSet('_glowTimeout', Math.floor((new Date()).getTime() / 100))) {
      $gameTemp._glowDirection = orNaN($gameTemp._glowDirection, 1);
      $gameTemp._glowAmount    = orNaN($gameTemp._glowAmount, 0) + $gameTemp._glowDirection;
      if ($gameTemp._glowAmount > 120) $gameTemp._glowDirection = -1;
      if ($gameTemp._glowAmount < 1)   $gameTemp._glowDirection = 1;
    }

    light_tiles = $gameVariables.GetLightTiles();
    block_tiles = $gameVariables.GetBlockTiles();

    light_tiles.forEach(tuple => {
      let [tile, x, y] = tuple;
      let x1 = (pw / 2) + (x - dx) * pw;
      let y1 = (ph / 2) + (y - dy) * ph;

      let objectflicker = tile.lightType.is(LightType.Fire);
      let tile_color = tile.color.clone();
      if (tile.lightType.is(LightType.Glow)) {
        tile_color.r = Math.floor(tile_color.r + (60 - $gameTemp._glowAmount)).clamp(0, 255);
        tile_color.g = Math.floor(tile_color.g + (60 - $gameTemp._glowAmount)).clamp(0, 255);
        tile_color.b = Math.floor(tile_color.b + (60 - $gameTemp._glowAmount)).clamp(0, 255);
        tile_color.a = Math.floor(tile_color.a + (60 - $gameTemp._glowAmount)).clamp(0, 255);
      }
      this._maskBitmaps.radialgradientFillRect(x1, y1, tile.radius, null, tile_color, objectflicker, tile.brightness);
    });

    // Tile blocks
    ctxMul.globalCompositeOperation = "multiply";
    ctxAdd.globalCompositeOperation = "multiply";
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
        this._maskBitmaps.FillRect(x1, y1, pw, ph, tile.color);
      }
      else if (tile.shape == 1) {
        x1 = x1 + tile.xOffset;
        y1 = y1 + tile.yOffset;
        this._maskBitmaps.FillRect(x1, y1, tile.blockWidth, tile.blockHeight, tile.color);
      }
      else if (tile.shape == 2) {
        x1 = x1 + tile.xOffset;
        y1 = y1 + tile.yOffset;
        this._maskBitmaps.FillEllipse(x1, y1, tile.blockWidth, tile.blockHeight, tile.color);
      }
    }, this);
    ctxMul.globalCompositeOperation = 'lighter';
    ctxAdd.globalCompositeOperation = "lighter";

    // Compute tint for next frame
    let tintValue = $gameVariables.GetTintTarget().next().get();
    $gameVariables.SetTint(tintValue);
    this._maskBitmaps.FillRect(-lightMaskPadding, 0, maxX, maxY, tintValue); // offset to fill entire mask

    // reset drawmode to normal
    ctxMul.globalCompositeOperation = 'source-over';
    ctxAdd.globalCompositeOperation = 'source-over';
  };

  /**
   * @method _addSprite
   * @private
   */
  Lightmask.prototype._addSprite = function (x, y, selectedbitmap, blendMode) {

    let sprite = new Sprite(this.viewport);
    sprite.bitmap = selectedbitmap;
    sprite.opacity = 255;
    sprite.blendMode = blendMode;
    sprite.x = x;
    sprite.y = y;
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
  Lightmask.prototype._removeSprite = function () { this.removeChild(this._sprites.pop()); };

  // *******************  ADD COLOR STOPS ***********************************
  /**
  * @param {Number} brightness
  * @param {VRGBA}  c
  */
  CanvasGradient.prototype.addTransparentColorStops = function (brightness, c) {
    if (!useSmootherLights) {
      this.addColorStop(0, c.toWebHex());

      if (brightness) {
        if (!useSmootherLights) {
          let c0 = c.clone();
          c0.alpha = Math.min(Math.floor(brightness * 100 * 2.55), c0.alpha);
          this.addColorStop(brightness, c0.toWebHex());
        }
      }
      this.addColorStop(1, VRGBA.minRGBA().toWebHex({ a: c.a })); // alpha should not be higher than the color
    }
    else {
      for (let distanceFromCenter = 0; distanceFromCenter < 1; distanceFromCenter += 0.1) {
        let newRed   = c.r - (distanceFromCenter * 100 * 2.55);
        let newGreen = c.g - (distanceFromCenter * 100 * 2.55);
        let newBlue  = c.b - (distanceFromCenter * 100 * 2.55);
        let newAlpha = 1 - distanceFromCenter;
        if (brightness > 0) newAlpha = Math.max(0, brightness - distanceFromCenter);
        this.addColorStop(distanceFromCenter, rgba(~~newRed, ~~newGreen, ~~newBlue, newAlpha));
      }
      this.addColorStop(1, VRGBA.minRGBA().toWebHex({ a: 0 }));
    }
  };

  // *******************  NORMAL BOX SHAPE ***********************************
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {VRGBA}  c
   */
  Mask_Bitmaps.prototype.FillRect = function (x, y, width, height, c) {
    x = x + lightMaskPadding;
    let ctxMul = this.multiply._context;
    //ctxMul.save(); // unnecessary significant performance hit

    // gradients have smoother color transitions for transparent colors (a < 255) in chrome
    let grad = ctxMul.createRadialGradient(0, 0, 0, 1, 1, 1);
    grad.addColorStop(0, c.toWebHex());

    ctxMul.fillStyle = grad;
    ctxMul.fillRect(x, y, width, height);
    if (isRMMV()) this.multiply._setDirty(); // doesn't exist in RMMZ
    if (c.v) {
      let ctxAdd = this.additive._context; // Additive lighting context
      ctxAdd.fillStyle = grad;
      ctxAdd.fillRect(x, y, width, height);
      if (isRMMV()) this.additive._setDirty(); // doesn't exist in RMMZ
    }
    //ctxMul.restore();
  };

  // *******************  CIRCLE/OVAL SHAPE ***********************************
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {VRGBA}  c
   */
  Mask_Bitmaps.prototype.FillEllipse = function (x, y, width, height, c) {
    x = x + lightMaskPadding;
    let xradius = width / 2;
    let yradius = height / 2;
    let centerX = x + xradius;
    let centerY = y + yradius;
    let ctxMul = this.multiply._context;
    //ctxMul.save(); // unnecessary significant performance hit

    // gradients have smoother color transitions for transparent colors (a < 255) in chrome
    let grad = ctxMul.createRadialGradient(0, 0, 0, 1, 1, 1);
    grad.addColorStop(0, c.toWebHex());

    ctxMul.fillStyle = grad;
    ctxMul.beginPath();
    ctxMul.ellipse(centerX, centerY, xradius, yradius, 0, 0, M_2PI, true);
    ctxMul.fill();
    if (isRMMV()) this.multiply._setDirty(); // doesn't exist in RMMZ
    if (c.v) {
      let ctxAdd = this.additive._context; // Additive lighting context
      ctxAdd.fillStyle = grad;
      ctxAdd.beginPath();
      ctxAdd.ellipse(centerX, centerY, xradius, yradius, 0, 0, M_2PI, true);
      ctxAdd.fill();
      if (isRMMV()) this.additive._setDirty(); // doesn't exist in RMMZ
    }
    //ctxMul.restore();
  };

  // *******************  NORMAL LIGHT SHAPE ***********************************
  /**
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Number} xr
  * @param {Number} yr
  * @param {VRGBA}  c
  * @param {Boolean} flicker
  * @param {Number} brightness
  * @param {Number} direction
  */
  Mask_Bitmaps.prototype.radialgradientFillRect = function (x, y, xr, yr, c, flicker, brightness, direction) {

    x = x + lightMaskPadding;
    if (!yr) yr = xr; // use xradius if y not avaliable or 0

    // clipping
    let nx = Number(x);
    let ny = Number(y);
    let nxr = Number(xr);
    let nyr = Number(yr);

    // if not clipped
    if (!(nx - nxr > maxX || ny - nyr > maxY || nx + nxr < 0 || ny + nyr < 0)) {
      if (!brightness) brightness = 0.0;
      if (!direction) direction = 0;

      let r = Math.max(xr, yr); // use the larger radius as the drawing radius

      let ctxMul = this.multiply._context;
      let ctxAdd = this.additive._context;  // Additive lighting context
      let wait = Math.floor((Math.random() * 8) + 1);
      if (flicker == true && wait == 1) {
        let flickerradiusshift = $gameVariables.GetFireRadius();
        let flickercolorshift = $gameVariables.GetFireColorshift();
        let gradrnd = Math.floor((Math.random() * flickerradiusshift) + 1);
        let colorrnd = Math.floor((Math.random() * flickercolorshift) - (flickercolorshift / 2));

        c.g = (c.g + colorrnd).clamp(0, 255);
        r = r - gradrnd;
        if (r < 0) r = 0;
      }

      let grad = ctxMul.createRadialGradient(x, y, 0, x, y, r);
      grad.addTransparentColorStops(brightness, c);

      //ctxMul.save(); // unnecessary significant performance hit

      ctxMul.fillStyle = grad;
      ctxAdd.fillStyle = grad;
      if (direction.length != 2) { // check if angle range
        // single directional number
        direction = Number(direction);
        let pw = $gameMap.tileWidth() / 2;
        let ph = $gameMap.tileHeight() / 2;
        let xS1, yS1, xE1, yE1, xS2, yS2, xE2, yE2;
        let xP, yP; // pivot
        switch (direction) {
          case 0:
            xS1 = x - r;    yS1 = y - r;
            xE1 = r * 2;    yE1 = r * 2;
            xP  = x;        yP  = y;
            break;
          case 1: // north wall
            xS1 = x - r;    yS1 = y - ph;
            xE1 = r * 2;    yE1 = r * 2;
            xP  = x;        yP  = yS1;
            break;
          case 2: // east wall
            xS1 = x - r;    yS1 = y - r;
            xE1 = r + pw;   yE1 = r * 2;
            xP  = x + pw;   yP  = y;
            break;
          case 3: // south wall
            xS1 = x - r;    yS1 = y - r;
            xE1 = r * 2;    yE1 = r + ph;
            xP  = x;        yP  = y + ph;
            break;
          case 4: // west wall
            xS1 = x - pw;   yS1 = y - r;
            xE1 = r * 2;    yE1 = r * 2;
            xP  = xS1;      yP  = y;
            break;
          case 5: // north east wall
            xS1 = x - r;    yS1 = y - ph;
            xE1 = r + pw;   yE1 = r + ph;
            xP  = x + pw;   yP  = yS1;
            break;
          case 6: // south east wall
            xS1 = x - r;    yS1 = y - r;
            xE1 = r + pw;   yE1 = r + ph;
            xP  = x + pw;   yP  = y + ph;
            break;
          case 7: // south west wall
            xS1 = x - pw;   yS1 = y - r;
            xE1 = r + pw;   yE1 = r + ph;
            xP  = xS1;      yP  = y + ph;
            break;
          case 8: // north west wall
            xS1 = x - pw;   yS1 = y - ph;
            xE1 = r + pw;   yE1 = r + ph;
            xP  = xS1;      yP  = yS1;
            break;
          case 9: // north east corner
            xS1 = x - r;    yS1 = y - ph;
            xE1 = r * 2;    yE1 = r * 2;
            xS2 = x - r;    yS2 = y - r;
            xE2 = r - pw;   yE2 = r - ph;
            xP  = x - pw;   yP = yS1;
            break;
          case 10: // south east corner
            xS1 = x - r;    yS1 = y - r;
            xE1 = r * 2;    yE1 = r + ph;
            xS2 = x - r;    yS2 = y + ph;
            xE2 = r - pw;   yE2 = r - ph;
            xP =  x - pw;   yP = yS2;
            break;
          case 11: // south west corner
            xS1 = x - r;    yS1 = y - r;
            xE1 = r * 2;    yE1 = r + ph;
            xS2 = x + pw;   yS2 = y + ph;
            xE2 = r - pw;   yE2 = r - ph;
            xP  = xS2;      yP  = yS2;
            break;
          case 12: // north west corner
            xS1 = x - r;    yS1 = y - ph;
            xE1 = r * 2;    yE1 = r * 2;
            xS2 = x + pw;   yS2 = y - r;
            xE2 = r - pw;   yE2 = r - ph;
            xP  = xS2;      yP  = yS1;
            break;
        }

        // elliptical lights (transformation: scaling + shift)
        if (xr > yr) {
          let scale = yr / xr;
          ctxMul.setTransform(1, 0, 0, scale, 0, yP - scale * yP);
          ctxAdd.setTransform(1, 0, 0, scale, 0, yP - scale * yP);
        } else if (yr > xr) {
          let scale = xr / yr;
          ctxMul.setTransform(scale, 0, 0, 1, xP - scale * xP, 0);
          ctxAdd.setTransform(scale, 0, 0, 1, xP - scale * xP, 0);
        }

        // Draw light
        ctxMul.fillRect(xS1, yS1, xE1, yE1);
        if (c.v) ctxAdd.fillRect(xS1, yS1, xE1, yE1);
        if (direction > 8) {
          ctxMul.fillRect(xS2, yS2, xE2, yE2);
          if (c.v) ctxAdd.fillRect(xS2, yS2, xE2, yE2);
        }

        // Undo elliptical light transformation
        if (xr != yr) {
          ctxMul.resetTransform();
          ctxAdd.resetTransform();
        }
      } else {
        //angle range

        // elliptical lights (transformation: scaling + shift)
        if (xr > yr) {
          let scale = yr / xr;
          ctxMul.setTransform(1, 0, 0, scale, 0, y - scale * y);
          ctxAdd.setTransform(1, 0, 0, scale, 0, y - scale * y);
        } else if (yr > xr) {
          let scale = xr / yr;
          ctxMul.setTransform(scale, 0, 0, 1, x - scale * x, 0);
          ctxAdd.setTransform(scale, 0, 0, 1, x - scale * x, 0);
        }

        // draw light
        ctxMul.beginPath();
        ctxMul.moveTo(x, y);
        ctxMul.arc(x, y, r, direction[0], direction[1]);
        ctxMul.fill();
        if (c.v) {
          ctxAdd.beginPath();
          ctxAdd.moveTo(x, y);
          ctxAdd.arc(x, y, r, direction[0], direction[1]);
          ctxAdd.fill();
        }

        // Undo elliptical light transformation
        if (xr != yr) {
          ctxMul.resetTransform();
          ctxAdd.resetTransform();
        }
      }

      //ctxMul.restore();
      if (isRMMV()) {
        this.multiply._setDirty(); // doesn't exist in RMMZ
        if (c.v) this.additive._setDirty(); // doesn't exist in RMMZ
      }
    }
  };

  // ********************************** FLASHLIGHT *************************************
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {VRGBA} c
   * @param {Number} direction
   * @param {Number} flashlength
   * @param {Number} flashwidth
   */
  Mask_Bitmaps.prototype.radialgradientFlashlight = function (x, y, c, dirAngle, flashlength, flashwidth) {
    x = x + lightMaskPadding;
    x = x - flashlightXoffset;
    y = y - flashlightYoffset;
    let ctxMul = this.multiply._context;
    let ctxAdd = this.additive._context; // Additive lighting context

    //ctxMul.save(); // unnecessary significant performance hit

    // small dim glove around player
    // there's no additive light globe for flashlights because it looks bad
    let r1 = 1; let r2 = 40;
    let grad = ctxMul.createRadialGradient(x, y, r1, x, y, r2);
    let s = 0x99 / Math.max(0x99 * c.r, 0x99 * c.g, 0x99 * c.b); // scale factor: max should be 0x99
    grad.addColorStop(0, c.toWebHex({ v: false, r: s * c.r, g: s * c.g, b: s * c.b }));
    grad.addColorStop(1, VRGBA.minRGBA().toWebHex({ a: c.a })); // alpha should not be higher than the color
    ctxMul.fillStyle = grad;
    ctxMul.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);

    // flashlight
    let flashlightdensity = $gameVariables.GetFlashlightDensity();
    if (flashlightdensity >= flashwidth) flashlightdensity = flashwidth - 1;

    if (triangular_flashlight) { // Triangular flashlight
      // Compute distance to spot and flashlight density
      let distance = 3 * (flashlength * (flashlength - 1));

      // Compute spotlight radiuses
      r1 = Math.max((flashlength - 1) * flashlightdensity, 0);
      r2 = Math.max((flashlength - 1) * flashwidth, 0);

      // Compute beam left start coordinates
      let xLeftBeamStart = x - (r2 / 7) * Math.sin(dirAngle);
      let yLeftBeamStart = y + (r2 / 7) * Math.cos(dirAngle);

      // Compute beam right start coordinates
      let xRightBeamStart = x + (r2 / 7) * Math.sin(dirAngle);
      let yRightBeamStart = y - (r2 / 7) * Math.cos(dirAngle);

      // Compute beam start control point coordinates
      let xStartCtrlPoint = x - (r2 / 4.5) * Math.cos(dirAngle);
      let yStartCtrlPoint = y - (r2 / 4.5) * Math.sin(dirAngle);

      // Compute beam distance
      let endPointDistance = distance - r2 / 2;
      let endCtrlPointDistance = distance + 1.6 * r2;

      // Compute beam width based off of angle (for drawing beam)
      let beamWidth = Math.atan(0.80 * r2 / distance); // 70% of spot outer radius.

      // Compute left beam angle and coordinates
      let leftBeamAngle = dirAngle + beamWidth;
      let xLeftBeamEnd = xLeftBeamStart + endPointDistance * Math.cos(leftBeamAngle);
      let yLeftBeamEnd = yLeftBeamStart + endPointDistance * Math.sin(leftBeamAngle);

      // Compute right beam angle and coordinates
      let rightBeamAngle = dirAngle - beamWidth;
      let xRightBeamEnd = xRightBeamStart + endPointDistance * Math.cos(rightBeamAngle);
      let yRightBeamEnd = yRightBeamStart + endPointDistance * Math.sin(rightBeamAngle);

      // Compute left bezier curve control point
      let xLeftCtrlPoint = xLeftBeamStart + endCtrlPointDistance * Math.cos(leftBeamAngle);
      let yLeftCtrlPoint = yLeftBeamStart + endCtrlPointDistance * Math.sin(leftBeamAngle);

      // Compute right bezier curve control point
      let xRightCtrlPoint = xRightBeamStart + endCtrlPointDistance * Math.cos(rightBeamAngle);
      let yRightCtrlPoint = yRightBeamStart + endCtrlPointDistance * Math.sin(rightBeamAngle);

      // Grab web colors for beam
      let outerHex = c.toWebHex({ a: Math.round(0.65 * c.a) });
      let innerHex = c.toWebHex({ a: Math.round(0.1  * c.a) });

      // gradients have smoother color transitions for transparent colors (a < 255) in chrome
      let grad = ctxMul.createRadialGradient(0, 0, 0, 1, 1, 1);
      grad.addColorStop(0, "#000000ff");

      // Draw outer beam as a shadow (needs an alpha of non-zero for fillstyle)
      ctxMul.fillStyle = grad;
      ctxMul.shadowColor = outerHex;
      ctxMul.shadowBlur = 20;
      ctxMul.beginPath();
      ctxMul.moveTo(xRightBeamStart, yRightBeamStart);
      ctxMul.quadraticCurveTo(xStartCtrlPoint, yStartCtrlPoint, xLeftBeamStart, yLeftBeamStart);
      ctxMul.lineTo(xLeftBeamEnd, yLeftBeamEnd);
      ctxMul.bezierCurveTo(xLeftCtrlPoint, yLeftCtrlPoint, xRightCtrlPoint, yRightCtrlPoint, xRightBeamEnd,
                           yRightBeamEnd);
      ctxMul.lineTo(xRightBeamStart, yRightBeamStart);
      ctxMul.fill();
      if (c.v) {
        ctxAdd.fillStyle = grad;
        ctxAdd.shadowColor = outerHex;
        ctxAdd.shadowBlur = 20;
        ctxAdd.beginPath();
        ctxAdd.moveTo(xRightBeamStart, yRightBeamStart);
        ctxAdd.quadraticCurveTo(xStartCtrlPoint, yStartCtrlPoint, xLeftBeamStart, yLeftBeamStart);
        ctxAdd.lineTo(xLeftBeamEnd, yLeftBeamEnd);
        ctxAdd.bezierCurveTo(xLeftCtrlPoint, yLeftCtrlPoint, xRightCtrlPoint, yRightCtrlPoint, xRightBeamEnd,
                             yRightBeamEnd);
        ctxAdd.lineTo(xRightBeamStart, yRightBeamStart);
        ctxAdd.fill();
      }

      // Draw inner beam as a shadow
      ctxMul.shadowColor = innerHex;
      ctxMul.shadowBlur = 1;
      ctxMul.beginPath();
      ctxMul.moveTo(xRightBeamStart, yRightBeamStart);
      ctxMul.quadraticCurveTo(xStartCtrlPoint, yStartCtrlPoint, xLeftBeamStart, yLeftBeamStart);
      ctxMul.lineTo(xLeftBeamEnd, yLeftBeamEnd);
      ctxMul.bezierCurveTo(xLeftCtrlPoint, yLeftCtrlPoint, xRightCtrlPoint, yRightCtrlPoint, xRightBeamEnd,
                           yRightBeamEnd);
      ctxMul.lineTo(xRightBeamStart, yRightBeamStart);
      ctxMul.fill();
      if (c.v) {
        // Draw inner beam as a shadow
        ctxAdd.shadowColor = innerHex;
        ctxAdd.shadowBlur = 1;
        ctxAdd.beginPath();
        ctxAdd.moveTo(xRightBeamStart, yRightBeamStart);
        ctxAdd.quadraticCurveTo(xStartCtrlPoint, yStartCtrlPoint, xLeftBeamStart, yLeftBeamStart);
        ctxAdd.lineTo(xLeftBeamEnd, yLeftBeamEnd);
        ctxAdd.bezierCurveTo(xLeftCtrlPoint, yLeftCtrlPoint, xRightCtrlPoint, yRightCtrlPoint, xRightBeamEnd,
                             yRightBeamEnd);
        ctxAdd.lineTo(xRightBeamStart, yRightBeamStart);
        ctxAdd.fill();
      }

      // Compute spot location
      x += distance * Math.cos(dirAngle);
      y += distance * Math.sin(dirAngle);

      // Draw spot
      grad = ctxMul.createRadialGradient(x, y, r1, x, y, r2);
      grad.addTransparentColorStops(0, c);
      ctxMul.shadowColor = "#000000"; // Clear shadow style outside of check as ctxMul state changes always occur
      ctxMul.shadowBlur = 0;
      if (!c.v) {
        ctxMul.fillStyle = grad;
        ctxMul.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
        ctxMul.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
      } else {
        ctxAdd.shadowColor = "#000000"; // Clear shadow style inside of check as ctxAdd state changes are conditional
        ctxAdd.shadowBlur = 0;
        ctxAdd.fillStyle = grad;
        ctxAdd.fillRect(x - r2, y - r2, r2 * 2, r2 * 2); // single call as to not blur things so much.
      }
    } else { // Circular flashlight
      // Compute diagonal length scalars.
      let xScalar = Math.cos(dirAngle);
      let yScalar = Math.sin(dirAngle);

      // Draw spots
      for (let cone = 0; cone < flashlength; cone++) {
        r1 = cone * flashlightdensity;
        r2 = cone * flashwidth;
        x = x + cone * 6 * xScalar; // apply scalars.
        y = y + cone * 6 * yScalar;
        grad = ctxMul.createRadialGradient(x, y, r1, x, y, r2);
        grad.addTransparentColorStops(0, c);
        ctxMul.fillStyle = grad;
        ctxAdd.fillStyle = grad;
        ctxMul.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
        if (c.v) ctxAdd.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
      }
      ctxMul.fillStyle = grad;
      ctxAdd.fillStyle = grad;
      ctxMul.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
      if (c.v) ctxAdd.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
    }

    //ctxMul.restore();
    if (isRMMV()) {
      this.multiply._setDirty(); // doesn't exist in RMMZ
      if (c.v) this.additive._setDirty(); // doesn't exist in RMMZ
    }
  };

  // ALIASED Scene_Battle initialization: create the light mask.
  let Community_Lighting_Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function () {
    Community_Lighting_Spriteset_Battle_createLowerLayer.call(this);
    if (battleMaskPosition.equalsIC('Above')) this.createBattleLightmask();
  };

  if (isRMMV()) {
    let Community_Lighting_Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function () {
      Community_Lighting_Spriteset_Battle_createBattleback.call(this);
      if (battleMaskPosition.equalsIC('Between')) this.createBattleLightmask();
    };
  } else {
    let Community_Lighting_Spriteset_Battle_createBattleField = Spriteset_Battle.prototype.createBattleField;
    Spriteset_Battle.prototype.createBattleField = function () {
      Community_Lighting_Spriteset_Battle_createBattleField.call(this);
      if (battleMaskPosition.equalsIC('Between')) this.createBattleLightmask();
    };
  }

  Spriteset_Battle.prototype.createBattleLightmask = function () {
    // If the script is active and configuration specifies light
    // to be active during battle, then create the light mask.
    if ($gameVariables.GetScriptActive() && lightInBattle) {
      this._battleLightmask = new BattleLightmask();
      if (battleMaskPosition.equalsIC('Above')) {
        this.addChild(this._battleLightmask);
      } else if (battleMaskPosition.equalsIC('Between')) {
        this._battleField.addChild(this._battleLightmask);
      }
    }
  };

  function BattleLightmask() { this.initialize.apply(this, arguments); }

  BattleLightmask.prototype = Object.create(PIXI.Container.prototype);
  BattleLightmask.prototype.constructor = BattleLightmask;
  BattleLightmask.prototype.initialize = function () {
    PIXI.Container.call(this);
    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];
    this._createBitmaps();

    // Initialize the bitmap
    // +24 on Y to inverse RMMZ Spriteset_Battle.prototype.battleFieldOffsetY() math
    // Graphics width/height adjustments to inverse Spriteset_Battle.prototype.createBattleField() offsets
    let spriteXOffset = -lightMaskPadding - (Graphics.width - Graphics.boxWidth) / 2;
    let spriteYOffset = (isRMMZ() ? 24 : 0) - (Graphics.height - Graphics.boxHeight) / 2;
    this._addSprite(spriteXOffset, spriteYOffset, this._maskBitmaps.multiply, PIXI.BLEND_MODES.MULTIPLY);
    this._addSprite(spriteXOffset, spriteYOffset, this._maskBitmaps.additive, PIXI.BLEND_MODES.ADD);

    this._maskBitmaps.multiply.fillRect(0, 0, maxX, maxY, '#000000');
    this._maskBitmaps.additive.clearRect(0, 0, maxX, maxY);

    // if we came from a map, script is active, configuration authorizes using lighting effects,
    // then use the tint of the map, otherwise use full brightness
    let c = (!DataManager.isBattleTest() && !DataManager.isEventTest() && $gameMap.mapId() >= 0 &&
             $gameVariables.GetScriptActive() && options_lighting_on && lightInBattle) ?
            $gameVariables.GetTint() : VRGBA.maxRGBA();

    let note = $$.getCLTag($$.getFirstComment($dataTroops[$gameTroop._troopId].pages[0]));
    if ((/^tintbattle\b/i).test(note)) {
      let data = note.split(/\s+/);
      data.splice(0, 1);
      data.map(x => x.trim());
      $$.tintbattle(data, true);
    }

    // Prevent the battle scene from being too dark
    if (c.magnitude() < 0x66 * 3 && c.r < 0x66 && c.g < 0x66 && c.b < 0x66)
      c.set({ v: false, r: 0x66, g: 0x66, b: 0x66, a: 0xff });

    $gameTemp._BattleTintInitial = c;
    $gameTemp._BattleTintTarget = ColorDelta.createTint(c);
    this._maskBitmaps.FillRect(-lightMaskPadding, 0, maxX, maxY, c); // offset to fill entire mask
    this._maskBitmaps.multiply._baseTexture.update(); // Required to update battle texture in RMMZ optional for RMMV
    this._maskBitmaps.additive._baseTexture.update(); // Required to update battle texture in RMMZ optional for RMMV
  };

  //@method _createBitmaps
  BattleLightmask.prototype._createBitmaps = function () {
    this._maskBitmaps = new Mask_Bitmaps(maxX, maxY);
  };

  BattleLightmask.prototype.update = function () {
    this._maskBitmaps.multiply.fillRect(0, 0, maxX, maxY, '#000000');
    this._maskBitmaps.additive.clearRect(0, 0, maxX, maxY);

    // Prevent the battle scene from being too dark
    let c = $gameTemp._BattleTintTarget.next().get(); // get next color
    if (c.magnitude() < 0x66 * 3 && c.r < 0x66 && c.g < 0x66 && c.b < 0x66) {
      c.set({ v: false, r: 0x66, g: 0x66, b: 0x66, a: 0xff });
      $gameTemp._BattleTintTarget.current = c; // reassign if out of bounds. Shouldn't be possible.
    }

    // Compute tint for next frame
    this._maskBitmaps.FillRect(-lightMaskPadding, 0, maxX, maxY, c);
    this._maskBitmaps.multiply._baseTexture.update(); // Required to update battle texture in RMMZ optional for RMMV
    this._maskBitmaps.additive._baseTexture.update(); // Required to update battle texture in RMMZ optional for RMMV
  };

  /**
   * @method _addSprite
   * @private
   */
  BattleLightmask.prototype._addSprite = function (x1, y1, selectedbitmap, blendMode) {

    var sprite = new Sprite(this.viewport);
    sprite.bitmap = selectedbitmap;
    //sprite.opacity = 255;
    sprite.blendMode = blendMode;
    sprite.x = x1;
    sprite.y = y1;
    this._sprites.push(sprite);
    this.addChild(sprite);
    sprite.rotation = 0;
    sprite.ax = 0;
    sprite.ay = 0;
    //sprite.opacity = 255;
  };

  /**
   * @method _removeSprite
   * @private
   */
  BattleLightmask.prototype._removeSprite = function () { this.removeChild(this._sprites.pop()); };

  // ALIASED Move event location => reload map.
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

  // Reconstruct types after game load
  $$.ReconstructTypes = function (variable, cl_name_check) {
    for (let property_name in variable) {
      let property = variable[property_name];

      // Check for CL names at root to avoid checking non-cl game variables to avoid any incompatibility issues
      if(cl_name_check && !property_name.startsWithIC("_Community_Lighting") && !property_name.startsWith("_cl")) continue;

      // Make sure the type is an actual object (we only need to reconstruct objects)
      if (property == null || typeof property != "object") continue;

      // Compare type names
      if (property.name == VRGBA.name)
        Object.setPrototypeOf(property, VRGBA.prototype);
      else if (property.name == LightProperties.name)
        Object.setPrototypeOf(property, LightProperties.prototype);
      else if (property.name == ColorDelta.name)
        Object.setPrototypeOf(property, ColorDelta.prototype);
      else if (property.name == LightDelta.name)
        Object.setPrototypeOf(property, LightDelta.prototype);
      else if (property.name == NumberDelta.name)
        Object.setPrototypeOf(property, NumberDelta.prototype);
        $$.ReconstructTypes(property, false); // no need to do name checks for inner-objects
    }
  };

  $$.ReloadMapEvents = function () {
    //**********************fill up new map-array *************************
    eventObjId = [];
    event_id = [];
    events = $gameMap.events(); // cache because events() API calls filter for each call
    event_stacknumber = [];
    event_eventcount = events.length;

    if (GameLoaded) $$.ReconstructTypes($gameVariables, true); // on game loaded, we need to reconstruct the stored types

    for (let i = 0; i < event_eventcount; i++) {
      if (events[i]) {
        if (events[i].event() && !events[i]._erased) {
          let note = events[i].getCLTag();

          let note_args = note.split(" ");
          let note_command = LightType[note_args.shift().toLowerCase()];
          if (note_command) {
            eventObjId.push(i);
            event_id.push(events[i]._eventId);
            event_stacknumber.push(i);

          }
        }

        // on game loaded, restore light event data
        if (GameLoaded && $gameVariables._cl && $gameVariables._cl[events[i]._eventId]) {
          events[i]._cl = $gameVariables._cl[events[i]._eventId];
        }
      }
    }
    
    // Mark game as not loaded
    GameLoaded = false;

    // *********************************** DAY NIGHT Setting **************************
    let mapNote = $dataMap.note ? $dataMap.note.split("\n") : [];
    mapNote.forEach((note) => {
      /**
       * @type {String}
       */
      let mapnote = $$.getCLTag(note.trim());
      if (mapnote) {
        mapnote = mapnote.toLowerCase().trim();
        if ((/^daynight\b/i).test(mapnote)) {
          if (daynightCycleEnabled && !daynightTintEnabled) {
            daynightTintEnabled = true;
            let dnspeed = note.match(/\d+/);
            if (dnspeed) {
              let daynightspeed = +dnspeed[0];
              if (daynightspeed < 1) daynightspeed = 5000;
              $gameVariables.SetDaynightSpeed(daynightspeed);
            }
            let delta = ColorDelta.createTimeTint(false, 60 * $gameVariables.GetDaynightSpeed());
            $gameVariables.SetTint(delta.get());
            $gameVariables.SetTintTarget(delta);
          }
        }
        else if ((/^RegionFire\b/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionfire", data);
        }
        else if ((/^RegionGlow\b/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionglow", data);
        }
        else if ((/^RegionLight\b/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileLight("regionlight", data);
        }
        else if ((/^RegionBlock\b/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          $gameMap._interpreter.addTileBlock("regionblock", data);
        }
        else if ((/^tint\b/i).test(mapnote)) {
          let data = mapnote.split(/\s+/);
          data.splice(0, 1);
          data.map(x => x.trim());
          if (typeof $$.mapBrightness !== "undefined") {
            let color = data[1];
            let c = new VRGBA(color);
            if (c.a == 255) c.a = $$.mapBrightness;
            data[1] = c.toHex();
          }
          $$.tint(data);
        }
        else if ((/^defaultBrightness\b/i).test(mapnote)) {
          let brightness = note.match(/\d+/);
          if (brightness) $$.defaultBrightness = Math.max(0, Math.min(Number(brightness[0], 100))) / 100;
        }
        else if ((/^mapBrightness\b/i).test(mapnote)) {
          let brightness = note.match(/\d+/);
          if (brightness) {
            let c = $gameVariables.GetTint();
            if (!c.r && !c.g && !c.b) { c.r = 255; c.g = 255; c.b = 255; }
            let value = Math.max(0, Math.min(Number(brightness[0], 100)));
            c.a = Math.floor(value * 2.55);
            $$.tint(["set", c.toHex()]);
            $$.mapBrightness = c.a;
          }
        }
      }
    });
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
      let targetProps = $gameVariables.GetLightArray()[args[1].toLowerCase()];
      if (targetProps) { targetProps.parseProps(["e1"]); }
    }

    // *********************** TURN SPECIFIC LIGHT OFF *********************
    else if (isOff(args[0])) {
      let targetProps = $gameVariables.GetLightArray()[args[1].toLowerCase()];
      if (targetProps) { targetProps.parseProps(["e0"]); }
    }

    // *********************** SET COLOR *********************
    else if (args[0].equalsIC('color')) {
      let targetProps = $gameVariables.GetLightArray()[args[1].toLowerCase()];
      if (targetProps) targetProps.parseProps([(args[2] != null && !args[2].equalsIC("defaultcolor")) ? args[2] : "#"]);
    }

    // *********************** SET CONDITIONAL LIGHT *********************
    else if (args[0].equalsIC('cond')) {
      let targetProps = $gameVariables.GetLightArray()[args[1].toLowerCase()];
      if (targetProps) targetProps.parseProps(args[2] != null ? args.slice(2) : ['']);
    }

    // *********************** WAIT on CONDITIONAL LIGHT *********************
    else if (args[0].equalsIC('wait')) { // wait for conditional light to finish processing
      let targetProps = $gameVariables.GetLightArray()[args[1].toLowerCase()];
      if (targetProps) {
        if (targetProps.updateFrame == Graphics.frameCount) {
          // light was scheduled to transition this frame and the deltas haven't been updated to use targets duration
          $$.interpreter.wait(targetProps.transitionDuration + targetProps.pauseDuration + 1); // +1 needed for off by one
        } else { // light was scheduled to transition in a prior frame so lookup how much time is left
          for (let i = 0, len = eventObjId.length; i < len; i++) {
            let cur = events[eventObjId[i]];
            if (cur._cl.delta.target == targetProps) {
              $$.interpreter.wait(cur._cl.delta.current.transitionDuration + cur._cl.delta.current.pauseDuration + 1); // +1 needed for off by one
              break;
            }
          }
        }
      }
    }

    // **************************** RESET ALL SWITCHES ***********************
    else if (args[0].equalsIC('switch') && args[1].equalsIC('reset')) {
      let lightArray = $gameVariables.GetLightArray();
      for (let i in lightArray) lightArray[i].parseProps(['t', 'p', '#', 'e', 'b', 'x', 'y', 'r', 'l', 'w', 'a']); // clear
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.tint = function (args) {
    let cmd = args[0].trim();
    if (cmd.equalsIC('set', 'fade')) {
      let fadeDuration = (args[3] && args[3].equalsIC('cycles') ? 1 : 60) * (+args[2] || 0); // arg is speed or cycles
      $gameVariables.SetTintTarget(ColorDelta.createTint(new VRGBA(args[1]), fadeDuration));
    } else if (cmd.equalsIC('reset', 'daylight')) {
      let fadeDuration = (args[2] && args[2].equalsIC('cycles') ? 1 : 60) * (+args[1] || 0); // arg is speed or cycles
      let delta = ColorDelta.createTimeTint(false, 0); // get the daynight tint for the current time
      delta = ColorDelta.createTint(delta.get(), fadeDuration); // use tint for current time as target
      $gameVariables.SetTintTarget(delta);
    } else if (cmd.equalsIC('wait')) {
      $$.interpreter.wait($gameVariables.GetTintTarget().fadeDuration + 1); // +1 needed for off by one
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.tintbattle = function (args, overrideInBattleCheck = false) {
    if ($gameVariables.GetScriptActive() && lightInBattle && ($gameParty.inBattle() || overrideInBattleCheck)) {
      let cmd = args[0].trim();
      if (cmd.equalsIC('set', 'fade')) {
        let fadeDuration = (args[3] && args[3].equalsIC('cycles') ? 1 : 60) * (+args[2] || 0); // arg is speed or cycles
        $gameTemp._BattleTintTarget = ColorDelta.createBattleTint(new VRGBA(args[1], '#666666'), fadeDuration);
      }
      else if (cmd.equalsIC('reset', 'daylight')) {
        let fadeDuration = (args[2] && args[2].equalsIC('cycles') ? 1 : 60) * (+args[1] || 0); // arg is speed or cycles
        $gameTemp._BattleTintTarget = ColorDelta.createBattleTint($gameTemp._BattleTintInitial, fadeDuration);
      } else if (cmd.equalsIC('wait')) {
        $$.interpreter.wait($gameVariables.GetTintTarget().fadeDuration + 1); // +1 needed for off by one
      }
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.DayNight = function (args) {
    let modTime = (hoursInDay, hours, minutes, seconds) => { // helper function to modify (set/add/subtract) time
      hoursInDay = Math.max(orNaN(+hoursInDay, 24), 1); // minimum of 1, err results in 24
      hours = orNaN(hours, 0);
      minutes = orNaN(minutes, 0);
      seconds = orNaN(seconds, 0);
      seconds += hours * 60 * 60 + minutes * 60;
      let totalSeconds = hoursInDay * 60 * 60;
      seconds %= totalSeconds; // clamp to within total seconds
      if (seconds < 0) seconds += totalSeconds;
      gV.SetDaynightSeconds(seconds);
      gV.SetDaynightHoursinDay(hoursInDay);
      setTimeColorDelta();
      $$.saveTime();
    };
    let setColorDelta = () => {
      let delta = ColorDelta.createTint(gV.GetTint());
      $gameVariables.SetTint(delta.get());
      $gameVariables.SetTintTarget(delta);
    };
    let setTimeColorDelta = () => {
      if (daynightCycleEnabled && daynightTintEnabled) {
        let hasFade = 'fade'.equalsIC(...a) || gV.GetDaynightSpeed() == 0;
        let delta = ColorDelta.createTimeTint(hasFade, 60 * $gameVariables.GetDaynightSpeed());
        $gameVariables.SetTint(delta.get());
        $gameVariables.SetTintTarget(delta);
      }
    };
    let isCmd                      = (s)    => a[0].equalsIC(s);
    let showTime                   = (w, s) => [gV._clShowTimeWindow, gV._clShowTimeWindowSeconds] = [w, s];
    let [gV, a]                    = [$gameVariables, args];
    let [secondsTotal, hoursInDay] = [gV.GetDaynightSeconds(), gV.GetDaynightHoursinDay()];
    let [hours, minutes, seconds]  = [$$.hours(), $$.minutes(), $$.seconds()];
    if      (isCmd('on'))          void (daynightTintEnabled = true, setTimeColorDelta());              // enable daynight tint
    else if (isCmd('off'))         void (daynightTintEnabled = false, setColorDelta());                 // disable daynight tint
    else if (isCmd('speed'))       void (gV.SetDaynightSpeed(a[1]), setTimeColorDelta());               // set daynight speed
    else if (isCmd('add'))         void modTime(hoursInDay, +a[1],   +a[2],   secondsTotal, 0);         // add to cur time
    else if (isCmd('subtract'))    void modTime(hoursInDay, -+a[1], -+a[2],   secondsTotal, 0);         // sub from cur time
    else if (isCmd('hour'))        void modTime(hoursInDay, +a[1],   +a[2],   0);                       // set the cur time
    else if (isCmd('hoursinday'))  void modTime(+a[1],      hours,   minutes, seconds);                 // set number of hours in day
    else if (isCmd('show'))        void showTime(true, false);                                          // show clock
    else if (isCmd('showseconds')) void showTime(true, true);                                           // show clock seconds
    else if (isCmd('hide'))        void showTime(false, false);                                         // hide clock
    else if (isCmd('color'))       void (gV.SetTintAtHour(a[1], new VRGBA(a[2])), setTimeColorDelta()); // change hour color
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
  this._Community_Lighting_Tint_Value = value.clone();
};
Game_Variables.prototype.GetTint = function () {
  if (!this._Community_Lighting_Tint_Value) this._Community_Lighting_Tint_Value = VRGBA.minRGBA();
  return this._Community_Lighting_Tint_Value.clone();
};
Game_Variables.prototype.SetTintAtHour = function (hour, color) {
  let result = this.GetDaynightColorArray()[Math.max((+hour || 0), 0)];
  if (color) result.color = color.clone(); // hour color
};
Game_Variables.prototype.GetTintByTime = function (inc = 0) {
  let hours = Community.Lighting.hours() + inc; // increment from current hour
  let hoursinDay = this.GetDaynightHoursinDay();
  hours %= hoursinDay; // clamp to within total hours in day
  if (hours < 0) hours += hoursinDay;
  let result = this.GetDaynightColorArray()[hours];
  return result ? result.color.clone() : VRGBA.minRGBA();
};
Game_Variables.prototype.SetTintTarget = function (delta) {
  this._Community_Lighting_TintTarget = delta;
};
Game_Variables.prototype.GetTintTarget = function () {
  if (!this._Community_Lighting_TintTarget) this._Community_Lighting_TintTarget = new ColorDelta(this.GetTint());
  return this._Community_Lighting_TintTarget;
};
Game_Variables.prototype.SetFlashlight = function (value) {
  this._Community_Lighting_Flashlight = value;
};
Game_Variables.prototype.GetFlashlight = function () {
  return orNullish(this._Community_Lighting_Flashlight, false);
};
Game_Variables.prototype.SetFlashlightDensity = function (value) { // don't set if invalid or 0
  if (+value > 0) this._Community_Lighting_FlashlightDensity = +value;
};
Game_Variables.prototype.GetFlashlightDensity = function () {
  let value = +this._Community_Lighting_FlashlightDensity;
  return value || 3; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightLength = function (value) { // don't set if invalid or 0
  if (+value > 0) this._Community_Lighting_FlashlightLength = +value;
};
Game_Variables.prototype.GetFlashlightLength = function () {
  let value = +this._Community_Lighting_FlashlightLength;
  return value || 8; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightWidth = function (value) { // don't set if invalid or 0
  if (+value > 0) this._Community_Lighting_FlashlightWidth = +value;
};
Game_Variables.prototype.GetFlashlightWidth = function () {
  let value = +this._Community_Lighting_FlashlightWidth;
  return value || 12; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetPlayerColor = function (value) { // don't set if empty
  if (value) this._Community_Lighting_PlayerColor = new VRGBA(value);
};
Game_Variables.prototype.GetPlayerColor = function () {
  if (!this._Community_Lighting_PlayerColor) this._Community_Lighting_PlayerColor = VRGBA.maxRGBA();
  return this._Community_Lighting_PlayerColor.clone();
};
Game_Variables.prototype.SetPlayerBrightness = function (value) { // don't set if invalid.
  if (value && value[0].equalsIC('b')) { // must exist and be prefixed with b or B
    let b = +value.slice(1); // strip and convert to number
    if (!isNaN(b)) (this._Community_Lighting_PlayerBrightness = (b / 100).clamp(0, 1)); // clamp between [0,1]
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
    return this.GetRadius();
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
Game_Variables.prototype.GetDaynightColorArray = function () {
  let result = this._Community_Lighting_DayNightColorArray || Community.Lighting.getDayNightList();
  if (!result) {
    result = ['#000000', '#000000', '#000000', '#000000',
      '#000000', '#000000', '#666666', '#AAAAAA',
      '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
      '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
      '#FFFFFF', '#FFFFFF', '#AAAAAA', '#666666',
      '#000000', '#000000', '#000000', '#000000'].map(x => x = { "color": new VRGBA(x), "isNight": false });
    this._Community_Lighting_DayNightColorArray = result;
  }
  let hoursInDay = this.GetDaynightHoursinDay();
  if (hoursInDay > result.length) { // lazy check bounds before returning and add colors if too small
    let origLength = result.length;
    result.length = hoursInDay;     // more efficient than a for loop
    result.fill({ "color": VRGBA.maxRGBA(), "isNight": false }, origLength);
  }
  this._Community_Lighting_DayNightColorArray = result; // assign reference
  return result;
};
Game_Variables.prototype.SetDaynightSpeed = function (value) {
  this._Community_Lighting_DaynightSpeed = orNaN(+value, 5000);
};
Game_Variables.prototype.GetDaynightSpeed = function () {
  if (this._Community_Lighting_DaynightSpeed >= 0) return this._Community_Lighting_DaynightSpeed;
  return orNullish(Number(Community.Lighting.parameters['Daynight Initial Speed']), 10);
};
Game_Variables.prototype.GetDaynightTick = function () {
  return 60 / this.GetDaynightSpeed();
};
Game_Variables.prototype.SetDaynightSeconds = function (value) {
  this._Community_Lighting_DaynightSeconds = orNaN(+value);
};
Game_Variables.prototype.GetDaynightSeconds = function () {
  return orNaN(+this._Community_Lighting_DaynightSeconds, 0);
};
Game_Variables.prototype.SetDaynightHoursinDay = function (value) {
  this._Community_Lighting_DaynightHoursinDay = orNaN(+value);
};
Game_Variables.prototype.GetDaynightHoursinDay = function () {
  return orNaN(this._Community_Lighting_DaynightHoursinDay, 24);
};
Game_Variables.prototype.SetFireRadius = function (value) {
  this._Community_Lighting_FireRadius = orNaN(+value);
};
Game_Variables.prototype.GetFireRadius = function () {
  return orNaN(this._Community_Lighting_FireRadius, 7);
};
Game_Variables.prototype.SetFireColorshift = function (value) {
  this._Community_Lighting_FireColorshift = orNaN(+value);
};
Game_Variables.prototype.GetFireColorshift = function () {
  return orNaN(this._Community_Lighting_FireColorshift, 10);
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
}
Window_TimeOfDay.prototype = Object.create(Window_Selectable.prototype);
Window_TimeOfDay.prototype.constructor = Window_TimeOfDay;
Window_TimeOfDay.prototype.initialize = function () {
  const ww = 150;
  const wh = isRMMZ() ? SceneManager._scene.calcWindowHeight(1, true) : 65;
  const wx = Graphics.boxWidth - ww - (isRMMZ() ? (ConfigManager.touchUI ? 30 : 0) : 0);
  const wy = 0;
  const rect = isRMMZ() ? [new Rectangle(wx, wy, ww, wh)] : [wx, wy, ww, wh];
  Window_Selectable.prototype.initialize.call(this, ...rect);
  this._baseX = wx;
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
