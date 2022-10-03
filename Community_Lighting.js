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
    ConfigManager,
  } = require("../rpg_managers");
  var { Window_Selectable, Window_Options } = require("../rpg_windows");
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
* Light radius color [onoff] [day|night] [brightness] [direction] [x] [y] [id]
* Light radius cycle <color [pauseDuration]>... [onoff] [day|night] [brightness] [direction] [x] [y] [id]
* Light [radius] [color] [{CycleProps}...] [onoff] [day|night] [brightness] [direction] [x] [y] [id]
* - Light
* - radius      100, 250, etc
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
* - onoff:      Initial state:  0, 1, off, on (default). Ignored if day|night passed [optional]
* - day         Causes the light to only come on during the day [optional]
* - night       Causes the light to only come on during the night [optional]
* - brightness  B50, B25, etc [optional]
* - direction   D1: n.wall, D2: e.wall, D3: s.wall, D4: w.wall
*               D5 n.+e. walls, D6 s.+e. walls, D7 s.+w. walls,
*               D8 n.+w. walls, D9 n.-e. corner, D10 s.-e. corner
*               D11 s.-w. corner, D12 n.-w. corner  [optional]
* - x           x offset [optional] (0.5: half tile, 1 = full tile, etc)
* - y           y offset [optional]
* - id          1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*               These should not be in the format of 'aN', 'bN', dN', 'lN', 'wN' 'xN' or 'yN'
*               where N is a number otherwise they will be mistaken for one of the previous
*               optional parameters.
*
* Fire ...params
* - Same as Light params above, but adds a subtle flicker
*
* Flashlight bl bw color [onoff] [day|night] [sdir|angle] [x] [y] [id]
* Flashlight bl bw cycle <color [pauseDuration]>... [onoff] [day|night] [sdir|angle] [x] [y] [id]
* Flashlight [bl] [bw] [{CycleProps}...] [onoff] [day|night] [sdir|angle] [x] [y] [id]
* - Sets the light as a flashlight with beam length (bl) beam width (bw) color (c),
*      0|1 (onoff), and 1=up, 2=right, 3=down, 4=left for static direction (sdir)
* - bl:         Beam length:  Any number, optionally preceded by "L", so 8, L8
* - bw:         Beam width:  Any number, optionally preceded by "W", so 12, W12
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
* - onoff:      Initial state:  0, 1, off, on (default). Ignored if day|night passed [optional]
* - day         Sets the event's light to only show during the day [optional]
* - night       Sets the event's light to only show during night time [optional]
* - sdir:       Forced direction (optional): 0:auto, 1:up, 2:right, 3:down, 4:left
*               Can be preceded by "D", so D4.  If omitted, defaults to 0
* - angle:      Forced direction in degrees (optional): must be preceded by "A". If
*               omitted, sdir is used. [optional]
* - x           x[offset] Work the same as regular light [optional]
* - y           y[offset] [optional]
* - id          1, 2, potato, etc. An id (alphanumeric) for plugin commands [optional]
*               These should not be in the format of 'aN', 'bN', dN', 'lN', 'wN' 'xN' or 'yN'
*               where N is a number otherwise they will be mistaken for one of the previous
*               optional parameters.
*
* Example note tags:
*
* <cl: light 250 #ffffff>
* Creates a basic light
*
* <cl: light 300 cycle #ff0000 15 #ffff00 15 #00ff00 15 #00ffff 15 #0000ff 15>
* <cl: light 300 {#ff0000 p15} {#ffff00} {#00ff00} {#00ffff} {#0000ff}>
* Creates a cycling light that rotates every 15 frames.  Great for parties!
*
* <cl: light 300 {#ff0000 t30 p60} {#ffff00} {#00ff00} {#00ffff}>
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
* <cl: light 300 {a#990000 t15} {a#999900} {a#009900} {a#009999} {a#000099}>
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
* The following chart shows all supported properties:
* ---------------------------------------------------------------------------------------------------------------------
* | Property    |  Prefix   |         Format*         |       Examples       |              Description               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   pause     |     p     |           pN            |     p0, p1, p20      | time period in cycles to pause after   |
* |  duration   |           |                         |                      | transitioning for cycling lights       |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | transition  |     t     |           tN            |     t0, t1, t30      | time period to transition the          |
* |  duration   |           |                         |                      | specified properties over              |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   color     |   #, #a   | <#|#a><RRGGBBAA|RRGGBB> | #, a#FFEEDD, #ffeedd | color or additive color                |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  enable     |     e     |         e<1|0>          |        e1, e0        | turns light on or off instantly        |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   angle     | a, +a, -a |       <a|+a|-a>N        |  a, a30, +a30, -a30  | flashlight angle in degrees. '+' moves |
* |             |           |                         |                      | clockwise, '-' moves counterclockwise  |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | brightness  |     b     |           bN            |    b, b0, b1, b5     | brightness                             |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  x offset   |     x     |           xN            |      x, x2, x-2      | x offset                               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |  y offset   |     y     |           yN            |      y, y2, y-2      | y offset                               |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* |   radius    |     r     |           rN            |     r, r50, r150     | light radius                           |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | beam length |     l     |           lN            |    l, l8, l9, l10    | flashlight beam length                 |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | beam width  |     w     |           wN            |   w, w12, w13, w14   | flashlight beam width                  |
* |-------------|-----------|-------------------------|----------------------|----------------------------------------|
* | * Omitting N or RBG value will transition the given property back to its initial state                                 |
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
* Light cond id [tN] [pN] [<#|#a><RRGGBBAA|RRGGBB>] [<a|+a|-a>N] [bN] [xN] [yN] [rN] [lN] [wN]
* - transitions a conditional light to the specified properties over the the given
* - time period in cycles. Supported propreties are color, flashlight angle (a),
* - brightness (b), x offset (x), y offset (y), radius (r), flashlight beam length (l),
* - flashlight beam width (w). Must use the specified prefixes. Unsupported prefixes are
* - ignored. See the Conditional Light section for more detail on each property.
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
* Tint set c [s]
* Tint fade c [s]
* - Sets or fades the current screen tint to the color (c)
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - Both commands operate identically.
*
* Tint reset [s]
* Tint daylight [s]
* - Resets or fades the tint based on the current hour.
* - The optional argument speed (s) sets the fade speed (1 = fast, 20 = very slow)
* - Both commands operate identically.
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
Number.prototype.clone        = function()         { return this; };
Boolean.prototype.clone       = function()         { return this; };
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
   * Creates an VRGBA object will r,g,b,a = 0 and v = false.
   * @returns {VRGBA}
   */
  static minRGBA() {
    let that = new VRGBA();
    [that.v, that.r, that.g, that.b, that.a] = [false, 0, 0, 0, 0];
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
   * @param {Number}    radius
   * @param {Number}    beamLength
   * @param {Number}    beamWidth
   */
  constructor(type, color, enable, direction, brightness, xOffset, yOffset, radius, beamLength, beamWidth) {
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
    if (isOL) this.radius     = radius;
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
      if      (        e.equalsIC('t'))        this.transitionDuration = 0;
      else if (        e.equalsIC('p'))        this.pauseDuration      = 0;
      else if (        e.equalsIC('#'))        this.color      = void(0);
      else if (        e.equalsIC('a#'))       this.color      = void(0);
      else if (        e.equalsIC('e'))        this.enable     = void(0);
      else if (        e.equalsIC('b'))        this.brightness = void(0);
      else if (        e.equalsIC('x'))        this.xOffset    = void(0);
      else if (        e.equalsIC('y'))        this.yOffset    = void(0);
      else if (isOL && e.equalsIC('r'))        this.radius     = void(0);
      else if (isFL && e.equalsIC('l'))        this.beamLength = void(0);
      else if (isFL && e.equalsIC('w'))        this.beamWidth  = void(0);
      else if (isFL && e.equalsIC('a'))        this.clockwise  = this.direction = void(0);
      else if (isFL && e.equalsIC('+a'))       this.clockwise  = this.direction = void(0);
      else if (isFL && e.equalsIC('-a'))       this.clockwise  = this.direction = void(0);
      // on or off checks
      // prefix checks
      else if (        e.startsWithIC('t'))  { this.transitionDuration = orNaN(+e.slice(1), 0); }
      else if (        e.startsWithIC('p'))  { this.pauseDuration      = orNaN(+e.slice(1), 0); }
      else if (        e.startsWithIC('#'))    this.color      = new VRGBA(e);
      else if (        e.startsWithIC('a#'))   this.color      = new VRGBA(e);
      else if (        e.startsWithIC('e'))    this.enable     = Boolean(orNaN(+e.slice(1), 0));
      else if (        e.startsWithIC('b'))    this.brightness = orNaN(+e.slice(1), 0);
      else if (        e.startsWithIC('x'))    this.xOffset    = orNaN(+e.slice(1), 0);
      else if (        e.startsWithIC('y'))    this.yOffset    = orNaN(+e.slice(1), 0);
      else if (isOL && e.startsWithIC('r'))    this.radius     = orNaN(+e.slice(1), 0);
      else if (isFL && e.startsWithIC('l'))    this.beamLength = orNaN(+e.slice(1), 0);
      else if (isFL && e.startsWithIC('w'))    this.beamWidth  = orNaN(+e.slice(1), 0);
      else if (isFL && e.startsWithIC('a'))  { this.clockwise  = true;  this.direction = M_PI_180 * orNaN(+e.slice(1), 0); }
      else if (isFL && e.startsWithIC('+a')) { this.clockwise  = true;  this.direction = M_PI_180 * orNaN(+e.slice(2), 0); }
      else if (isFL && e.startsWithIC('-a')) { this.clockwise  = false; this.direction = M_PI_180 * orNaN(+e.slice(2), 0); }
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
    if (this.radius             != null) that.radius             = this.radius    .clone();
    if (this.clockwise          != null) that.clockwise          = this.clockwise .clone();
    if (this.direction          != null) that.direction          = this.direction .clone();
    if (this.beamLength         != null) that.beamLength         = this.beamLength.clone();
    if (this.beamWidth          != null) that.beamWidth          = this.beamWidth .clone();
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
    if (arguments.length == 0) return;
    this.current = current;
    this.target  = target;
    this.defaults = defaults;
    this.delta   = new LightProperties();
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

    // Set current durations or 0 if not fading
    this.current.transitionDuration = fade ? target.transitionDuration : 0;
    this.current.pauseDuration      = fade ? target.pauseDuration : 0;

    // Enable or disable the current immediately based off of target value
    this.current.enable = target.enable != null ? target.enable : this.defaults.enable;

    // For currents (flashlights) check the movement direction and normalize the current and target
    if      (this.current.direction != null && target.clockwise)  normalizeClockwiseMovement();
    else if (this.current.direction != null && !target.clockwise) normalizeCounterClockwiseMovement();

    // Set any null targets to default (normalization for nulls) (allows defaults to gradually transition)
    if(target.color == null)      target.color      = this.defaults.color;
    if(target.direction == null)  target.direction  = this.defaults.direction;
    if(target.brightness == null) target.brightness = this.defaults.brightness;
    if(target.xOffset == null)    target.xOffset    = this.defaults.xOffset;
    if(target.yOffset == null)    target.yOffset    = this.defaults.yOffset;
    if(target.radius == null)     target.radius     = this.defaults.radius;
    if(target.beamLength == null) target.beamLength = this.defaults.beamLength;
    if(target.beamWidth == null)  target.beamWidth  = this.defaults.beamWidth;

    // assign deltas if current & targets exist
    this.delta.color      = createColor (this.current.color,      target.color,      this.current.transitionDuration);
    this.delta.color      = createColor (this.current.color,      target.color,      this.current.transitionDuration);
    this.delta.direction  = createNumber(this.current.direction,  target.direction,  this.current.transitionDuration);
    this.delta.brightness = createNumber(this.current.brightness, target.brightness, this.current.transitionDuration);
    this.delta.xOffset    = createNumber(this.current.xOffset,    target.xOffset,    this.current.transitionDuration);
    this.delta.yOffset    = createNumber(this.current.yOffset,    target.yOffset,    this.current.transitionDuration);
    this.delta.radius     = createNumber(this.current.radius,     target.radius,     this.current.transitionDuration);
    this.delta.beamLength = createNumber(this.current.beamLength, target.beamLength, this.current.transitionDuration);
    this.delta.beamWidth  = createNumber(this.current.beamWidth,  target.beamWidth,  this.current.transitionDuration);

    // assign new currents for existing deltas to propagate currents for duration = 0
    if(this.delta.color != null)      this.current.color      = this.delta.color     .get();
    if(this.delta.direction != null)  this.current.direction  = this.delta.direction .get();
    if(this.delta.brightness != null) this.current.brightness = this.delta.brightness.get();
    if(this.delta.xOffset != null)    this.current.xOffset    = this.delta.xOffset   .get();
    if(this.delta.yOffset != null)    this.current.yOffset    = this.delta.yOffset   .get();
    if(this.delta.radius != null)     this.current.radius     = this.delta.radius    .get();
    if(this.delta.beamLength != null) this.current.beamLength = this.delta.beamLength.get();
    if(this.delta.beamWidth != null)  this.current.beamWidth  = this.delta.beamWidth .get();
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
      if (this.delta.direction  != null) this.current.direction  = this.delta.direction .next().get();
      if (this.delta.brightness != null) this.current.brightness = this.delta.brightness.next().get();
      if (this.delta.xOffset    != null) this.current.xOffset    = this.delta.xOffset   .next().get();
      if (this.delta.yOffset    != null) this.current.yOffset    = this.delta.yOffset   .next().get();
      if (this.delta.radius     != null) this.current.radius     = this.delta.radius    .next().get();
      if (this.delta.beamLength != null) this.current.beamLength = this.delta.beamLength.next().get();
      if (this.delta.beamWidth  != null) this.current.beamWidth  = this.delta.beamWidth .next().get();
      this.current.transitionDuration--;
    } else
      this.current.pauseDuration--;
    return this;
  }

  /**
   * Returns whether all deltas are finished or not.
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
    if(current.v != target.v) current.v = target.v;  // Compute next step & clamp to target, check to avoid recomputing
    if(current.r != target.r) current.r = Math.minmax(delta.r > 0, current.r + scale * delta.r, target.r);
    if(current.g != target.g) current.g = Math.minmax(delta.g > 0, current.g + scale * delta.g, target.g);
    if(current.b != target.b) current.b = Math.minmax(delta.b > 0, current.b + scale * delta.b, target.b);
    if(current.a != target.a) current.a = Math.minmax(delta.a > 0, current.a + scale * delta.a, target.a);
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
  let radialColor2 = new VRGBA(useSmootherLights ? "#00000000" : "#000000");
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
      let isFL       = ()        => this._cl.type.is(LightType.Flashlight); // is flashlight
      let isEq       = (e, ...a) => { for (let i of a) if (e.equalsIC(i)) return true; return false; };
      let isPre      = (e, ...a) => { for (let i of a) if (e.startsWithIC(i)) return true; return false; };
      let isNul      = (e)       => e == null;
      let isDayNight = (e)       => isEq(e, "night", "day");
      let clip       = (e)       => orNaN(+e.slice(1)); // clip prefix & convert to number or undefined
      let cycleIndex, hasCycle = false;
      tagData.forEach((e) => {
        let n = clip(e);
        if      (!isFL() && !isNaN(+e)          && isNul(this._cl.radius))     this._cl.radius     = +e;
        else if (isFL()  && !isNaN(+e)          && isNul(this._cl.beamLength)) this._cl.beamLength = +e;
        else if (isFL()  && !isNaN(+e)          && isNul(this._cl.beamWidth))  this._cl.beamWidth  = +e;
        else if (isFL()  && isPre(e, "l") && n  && isNul(this._cl.beamLength)) this._cl.beamLength = n;
        else if (isFL()  && isPre(e, "w") && n  && isNul(this._cl.beamWidth))  this._cl.beamWidth  = n;
        else if (           isEq(e, "cycle")    && isNul(this._cl.color))      hasCycle            = true;
        else if (           isPre(e, "#", "a#") && hasCycle)                   cycleIndex = cycleGroups.push([e]) - 2;
        else if (           !isNaN(+e)          && cycleGroups[cycleIndex])    cycleGroups[cycleIndex].push('p' + e);
        else if (           isPre(e, "#", "a#") && isNul(this._cl.color))      this._cl.color      = new VRGBA(e);
        else if (           isOn(e)             && isNul(this._cl.enable))     this._cl.enable    = true;
        else if (           isOff(e)            && isNul(this._cl.enable))     this._cl.enable    = false;
        else if (           isDayNight(e)       && isNul(this._cl.switch))     this._cl.switch     = e;
        else if (           isPre(e, "b") && n  && isNul(this._cl.brightness)) this._cl.brightness = (n / 100).clamp(0, 1);
        else if (!isFL() && isPre(e, "d") && n  && isNul(this._cl.direction))  this._cl.direction  = n;
        else if ( isFL() && !isNaN(+e)          && isNul(this._cl.direction))  this._cl.direction  = +e;
        else if ( isFL() && isPre(e, "d") && n  && isNul(this._cl.direction))  this._cl.direction  = CLDirectionMap[n];
        else if ( isFL() && isPre(e, "a") && n  && isNul(this._cl.direction))  this._cl.direction  = Math.PI / 180 * n;
        else if (           isPre(e, "x") && n  && isNul(this._cl.xOffset))    this._cl.xOffset    = n;
        else if (           isPre(e, "y") && n  && isNul(this._cl.yOffset))    this._cl.yOffset    = n;
        else if (           e.length > 0        && isNul(this._cl.id))         this._cl.id         = e;
        cycleIndex += 1; // increment index. Valid for 1 iteration after a cycle color is parsed before OOB.
      }, this);

      // normalize parameters
      this._cl.radius        = orNaN(this._cl.radius, 0);
      this._cl.color         = orNullish(this._cl.color, VRGBA.minRGBA());
      this._cl.enable        = orBoolean(this._cl.enable, true);
      this._cl.brightness    = orNaN(this._cl.brightness, 0);
      this._cl.direction     = orNaN(this._cl.direction, undefined); // must be undefined for later checks
      this._cl.id            = orNullish(this._cl.id, 0); // Alphanumeric
      this._cl.beamLength    = orNaN(this._cl.beamLength, 0);
      this._cl.beamWidth     = orNaN(this._cl.beamWidth, 0);
      this._cl.xOffset       = orNaN(this._cl.xOffset, 0);
      this._cl.yOffset       = orNaN(this._cl.yOffset, 0);
      this._cl.cycle         = this._cl.cycle || null;

      // Store initial light properties
      let props = [this._cl.color, this._cl.enable, this._cl.direction, this._cl.brightness, this._cl.xOffset,
                   this._cl.yOffset, this._cl.radius, this._cl.beamLength, this._cl.beamWidth];

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
      // Non-conditional light
      else {
        this._cl.delta = { current: this._cl };// really just a self reference
      }
    }
  };
  Game_Event.prototype.cycleLightingNext = function () {
    let cycleList = this.getLightCycle();
    if (cycleList && this._cl.delta.finished()) {
      let delta = cycleList.shift();  // pop delta from front
      this._cl.delta = delta.clone(); // duplicate delta
      cycleList.push(delta);          // push delta on back
    }
  };
  Game_Event.prototype.conditionalLightingNext = function () {
    if (this.getLightCycle() || this.getLightId()) this._cl.delta.next();
  };
  Game_Event.prototype.getLightEnabled          = function () {
    if (!this._cl.switch) return this._cl.delta.current.enable;
    return (this._cl.switch.equalsIC("night") && $$.isNight()) ||
           (this._cl.switch.equalsIC("day")   && !$$.isNight());
  };
  Game_Event.prototype.getLightType             = function () { return this._cl.type; };
  Game_Event.prototype.getLightRadius           = function () { return this._cl.delta.current.radius; };
  Game_Event.prototype.getLightColor            = function () { return this._cl.delta.current.color.clone(); };
  Game_Event.prototype.getLightBrightness       = function () { return this._cl.delta.current.brightness; };
  Game_Event.prototype.getLightDirection        = function () { return this._cl.delta.current.direction; };
  Game_Event.prototype.getLightId               = function () { return this._cl.id; };
  Game_Event.prototype.getLightFlashlightLength = function () { return this._cl.delta.current.beamLength; };
  Game_Event.prototype.getLightFlashlightWidth  = function () { return this._cl.delta.current.beamWidth; };
  Game_Event.prototype.getLightXOffset          = function () { return this._cl.delta.current.xOffset; };
  Game_Event.prototype.getLightYOffset          = function () { return this._cl.delta.current.yOffset; };
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
    let tileType = a  => (a.tileType === "terrain" ? "tile" : "region") + (a.lightType ? a.lightType : "block");
    let tintType = () => $gameParty.inBattle() ? "tintbattle" : "tint";
    let dayMode =  a  => a.fade === "true" ? "fade" : "";
    let tintMode = a  => a.color ? "set" : "reset";
    let mathMode = a  => a.mode === "set" ? "hour" : a.mode; // set, add, or subtract.
    let showMode = a  => a.enabled.equalsIC("true") ? (a.showSeconds.equalsIC("true") ? "showseconds" : "show") : "hide";
    let radMode  = a  => +a.fadeSpeed ? "radiusgrow" : "radius";

    let r = PluginManager.registerCommand.bind(PluginManager, $$.name); // registar bound with first parameter.
    let f = (c, a) => $gameMap._interpreter.communityLighting_Commands(c, a.filter(_ => _ !== "")); //command wrapper.

    r("masterSwitch",       a  => f("script",     [mapOnOff(a)]));
    r("tileBlock",          a  => f(tileType(a),  [a.id, mapOnOff(a), a.color, a.shape,  a.xOffset, a.yOffset, a.blockWidth, a.blockHeight]));
    r("tileLight",          a  => f(tileType(a),  [a.id, mapOnOff(a), a.color, a.radius, a.brightness]));
    r("setTint",            a  => f(tintType(),   [tintMode(a), a.color, a.fadeSpeed]));
    r("daynightEnable",     a  => f("daynight",   [mapOnOff(a), dayMode(a)]));
    r("setTimeSpeed",       a  => f("dayNight",   ["speed", a.speed]));
    r("setTime",            a  => f("dayNight",   [mathMode(a), a.hours, a.minutes, dayMode(a)]));
    r("setHoursInDay",      a  => f("dayNight",   ["hoursinday", a.hours, dayMode(a)]));
    r("showTime",           a  => f("dayNight",   [showMode(a)]));
    r("setHourColor",       a  => f("dayNight",   ["color", a.hour, a.color, dayMode(a)]));
    r("flashlight",         a  => f("flashLight", [mapOnOff(a), a.beamLength, a.beamWidth, a.color, a.density]));
    r("setFire",            a  => f("setFire",    [a.radiusShift, a.redYellowShift]));
    r("playerLightRadius",  a  => f("light",      [radMode(a), a.radius, a.color, "B"+a.brightness, a.fadeSpeed]));
    r("activateById",       a  => f("light",      [mapOnOff(a), a.id]));
    r("lightColor",         a  => f("light",      ["color", a.id, a.color]));
    r("resetLightSwitches", () => f("light",      ["switch", "reset"]));
    r("resetTint",          a  => f(tintType(),   ["reset", a.fadeSpeed]));
    r("condLight",          a  => f("light",      ["cond", a.id, a.properties]));
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

    // remove all old sprites
    for (let i = 0, len = this._sprites.length; i < len; i++) this._removeSprite();

    // No lighting on maps less than 1 || Plugin deactivated in options || Plugin deactivated by plugin command
    if (map_id <= 0 || !options_lighting_on || !$gameVariables.GetScriptActive()) return;

    // reload map when a refresh is requested (event erase, page change, or _events object change)
    if (ReloadMapEventsRequired) {
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
    this._maskBitmaps.additive.clearRect(0, 0, maxX, maxY);

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
    let playercolor = $gameVariables.GetPlayerColor();
    let flashlightlength = $gameVariables.GetFlashlightLength();
    let flashlightwidth = $gameVariables.GetFlashlightWidth();
    let playerflicker = $gameVariables.GetFire();
    let playerbrightness = $gameVariables.GetPlayerBrightness();


    let iplayer_radius = Math.floor(player_radius);

    if (playerflashlight == true) {
      this._maskBitmaps.radialgradientFlashlight(x1, y1, playercolor, radialColor2, pd, flashlightlength,
                                                 flashlightwidth);
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
      this._maskBitmaps.radialgradientFillRect(x1, y1, 0, iplayer_radius, playercolor, radialColor2, playerflicker,
                                               playerbrightness);
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
    for (let i = 0, len = eventObjId.length; i < len; i++) {
      let evid = event_id[i];
      let cur  = events[eventObjId[i]];
      if (cur._cl == null) cur.initLightData();

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
        let light_radius   = cur.getLightRadius();
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
            this._maskBitmaps.radialgradientFlashlight(lx1, ly1, color, VRGBA.minRGBA(), ldir, flashlength, flashwidth);
          } else if (lightType.is(LightType.Light, LightType.Fire)) {
            this._maskBitmaps.radialgradientFillRect(lx1, ly1, 0, light_radius, color, VRGBA.minRGBA(), objectflicker,
                                                     brightness, direction);
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
      this._maskBitmaps.radialgradientFillRect(x1, y1, 0, tile.radius, tile_color, VRGBA.minRGBA(), objectflicker,
                                               tile.brightness);
    });

    // Tile blocks
    ctxMul.globalCompositeOperation = "multiply";
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

    // Compute tint for next frame
    let tintValue = $gameVariables.GetTintTarget().next().get();
    $gameVariables.SetTint(tintValue);
    this._maskBitmaps.FillRect(-lightMaskPadding, 0, maxX, maxY, tintValue); // offset to fill entire mask

    // reset drawmode to normal
    ctxMul.globalCompositeOperation = 'source-over';
  };

  /**
   * @method _addSprite
   * @private
   */
  Lightmask.prototype._addSprite = function (x1, y1, selectedbitmap, blendMode) {

    let sprite = new Sprite(this.viewport);
    sprite.bitmap = selectedbitmap;
    sprite.opacity = 255;
    sprite.blendMode = blendMode;
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
  Lightmask.prototype._removeSprite = function () { this.removeChild(this._sprites.pop()); };

  // *******************  ADD COLOR STOPS ***********************************
  /**
  * @param {Number} brightness
  * @param {VRGBA} c1
  * @param {VRGBA} c2
  */
  CanvasGradient.prototype.addTransparentColorStops = function (brightness, c1, c2) {
    if (brightness) {
      if (!useSmootherLights) {
        let alpha = Math.floor(brightness * 100 * 2.55).toString(16);
        if (alpha.length < 2) alpha = "0" + alpha;
        this.addColorStop(0, '#FFFFFF' + alpha);
      }
    }

    if (useSmootherLights) {
      for (let distanceFromCenter = 0; distanceFromCenter < 1; distanceFromCenter += 0.1) {
        let newRed   = c1.r - (distanceFromCenter * 100 * 2.55);
        let newGreen = c1.g - (distanceFromCenter * 100 * 2.55);
        let newBlue  = c1.b - (distanceFromCenter * 100 * 2.55);
        let newAlpha = 1 - distanceFromCenter;
        if (brightness > 0) newAlpha = Math.max(0, brightness - distanceFromCenter);
        this.addColorStop(distanceFromCenter, rgba(~~newRed, ~~newGreen, ~~newBlue, newAlpha));
      }
    } else {
      this.addColorStop(brightness, c1.toWebHex());
    }

    this.addColorStop(1, c2.toWebHex());
  };

  // *******************  NORMAL BOX SHAPE ***********************************
  /**
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @param {VRGBA} c
   */
  Mask_Bitmaps.prototype.FillRect = function (x1, y1, x2, y2, c) {
    x1 = x1 + lightMaskPadding;
    let hex = c.toWebHex();
    let ctxMul = this.multiply._context;
    //ctxMul.save(); // unnecessary significant performance hit
    ctxMul.fillStyle = hex;
    ctxMul.fillRect(x1, y1, x2, y2);
    if (isRMMV()) this.multiply._setDirty(); // doesn't exist in RMMZ
    if (c.v) {
      let ctxAdd = this.additive._context; // Additive lighting context
      ctxAdd.fillStyle = hex;
      ctxAdd.fillRect(x1, y1, x2, y2);
      if (isRMMV()) this.additive._setDirty(); // doesn't exist in RMMZ
    }
    //ctxMul.restore();
  };

  // *******************  CIRCLE/OVAL SHAPE ***********************************
  /**
   * @param {Number} centerX
   * @param {Number} centerY
   * @param {Number} xradius
   * @param {Number} yradius
   * @param {VRGBA} c
   */
  Mask_Bitmaps.prototype.FillEllipse = function (centerX, centerY, xradius, yradius, c) {
    centerX = centerX + lightMaskPadding;
    let hex = c.toWebHex();
    let ctxMul = this.multiply._context;
    //ctxMul.save(); // unnecessary significant performance hit
    ctxMul.fillStyle = hex;
    ctxMul.beginPath();
    ctxMul.ellipse(centerX, centerY, xradius, yradius, 0, 0, M_2PI);
    ctxMul.fill();
    if (isRMMV()) this.multiply._setDirty(); // doesn't exist in RMMZ
    if (c.v) {
      let ctxAdd = this.additive._context; // Additive lighting context
      ctxAdd.fillStyle = hex;
      ctxAdd.beginPath();
      ctxAdd.ellipse(centerX, centerY, xradius, yradius, 0, 0, M_2PI);
      ctxAdd.fill();
      if (isRMMV()) this.additive._setDirty(); // doesn't exist in RMMZ
    }
    //ctxMul.restore();
  };

  // *******************  NORMAL LIGHT SHAPE ***********************************
  /**
  *
  * @param {Number} x1
  * @param {Number} y1
  * @param {Number}  r1
  * @param {Number} r2
  * @param {VRGBA} c1
  * @param {VRGBA} c2
  * @param {Boolean} flicker
  * @param {Number} brightness
  * @param {Number} direction
  */
  Mask_Bitmaps.prototype.radialgradientFillRect = function (x1, y1, r1, r2, c1, c2, flicker, brightness, direction) {

    x1 = x1 + lightMaskPadding;

    // clipping
    let nx1 = Number(x1);
    let ny1 = Number(y1);
    let nr2 = Number(r2);

    // if not clipped
    if (!(nx1 - nr2 > maxX || ny1 - nr2 > maxY || nx1 + nr2 < 0 || nx1 + nr2 < 0)) {
      if (!brightness) brightness = 0.0;
      if (!direction) direction = 0;

      let ctxMul = this.multiply._context;
      let ctxAdd = this.additive._context;  // Additive lighting context
      let wait = Math.floor((Math.random() * 8) + 1);
      if (flicker == true && wait == 1) {
        let flickerradiusshift = $gameVariables.GetFireRadius();
        let flickercolorshift = $gameVariables.GetFireColorshift();
        let gradrnd = Math.floor((Math.random() * flickerradiusshift) + 1);
        let colorrnd = Math.floor((Math.random() * flickercolorshift) - (flickercolorshift / 2));

        c1.g = (c1.g + colorrnd).clamp(0, 255);
        r2 = r2 - gradrnd;
        if (r2 < 0) r2 = 0;
      }

      let grad = ctxMul.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(brightness, c1, c2);

      //ctxMul.save(); // unnecessary significant performance hit

      ctxMul.fillStyle = grad;
      ctxAdd.fillStyle = grad;

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

      ctxMul.fillRect(xS1, yS1, xE1, yE1);
      if (c1.v) ctxAdd.fillRect(xS1, yS1, xE1, yE1);
      if (direction > 8) {
        ctxMul.fillRect(xS2, yS2, xE2, yE2);
        if (c1.v) ctxAdd.fillRect(xS2, yS2, xE2, yE2);
      }

      //ctxMul.restore();
      if (isRMMV()) {
        this.multiply._setDirty(); // doesn't exist in RMMZ
        if (c1.v) this.additive._setDirty(); // doesn't exist in RMMZ
      }
    }
  };


  // ********************************** FLASHLIGHT *************************************
  /**
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} r1
   * @param {Number} r2
   * @param {VRGBA} c1
   * @param {VRGBA} c2
   * @param {Number} direction
   * @param {Number} flashlength
   * @param {Number} flashwidth
   */
  Mask_Bitmaps.prototype.radialgradientFlashlight = function (x1, y1, c1, c2, dirAngle, flashlength, flashwidth) {
    x1 = x1 + lightMaskPadding;
    x1 = x1 - flashlightXoffset;
    y1 = y1 - flashlightYoffset;
    let ctxMul = this.multiply._context;
    let ctxAdd = this.additive._context; // Additive lighting context

    //ctxMul.save(); // unnecessary significant performance hit

    // small dim glove around player
    // there's no additive light globe for flashlights because it looks bad
    let r1 = 1; let r2 = 40;
    let grad = ctxMul.createRadialGradient(x1, y1, r1, x1, y1, r2);
    let s = 0x99 / Math.max(0x99 * c1.r, 0x99 * c1.g, 0x99 * c1.b); // scale factor: max should be 0x99
    grad.addColorStop(0, c1.toWebHex({ v: false, r: s * c1.r, g: s * c1.g, b: s * c1.b }));
    grad.addColorStop(1, c2.toWebHex());
    ctxMul.fillStyle = grad;
    ctxMul.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);

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
      let xLeftBeamStart = x1 - (r2 / 7) * Math.sin(dirAngle);
      let yLeftBeamStart = y1 + (r2 / 7) * Math.cos(dirAngle);

      // Compute beam right start coordinates
      let xRightBeamStart = x1 + (r2 / 7) * Math.sin(dirAngle);
      let yRightBeamStart = y1 - (r2 / 7) * Math.cos(dirAngle);

      // Compute beam start control point coordinates
      let xStartCtrlPoint = x1 - (r2 / 4.5) * Math.cos(dirAngle);
      let yStartCtrlPoint = y1 - (r2 / 4.5) * Math.sin(dirAngle);

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
      let outerHex = c1.toWebHex({ a: Math.round(0.65 * c1.a) });
      let innerHex = c1.toWebHex({ a: Math.round(0.1  * c1.a) });

      // Draw outer beam as a shadow
      ctxMul.fillStyle = "#000000"; // Clear fillstyle for drawing beam
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
      if (c1.v) {
        ctxAdd.fillStyle = "#000000"; // Clear fillstyle for drawing beam
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
      if (c1.v) {
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
      x1 += distance * Math.cos(dirAngle);
      y1 += distance * Math.sin(dirAngle);

      // Draw spot
      grad = ctxMul.createRadialGradient(x1, y1, r1, x1, y1, r2);
      grad.addTransparentColorStops(0, c1, c2);
      ctxMul.shadowColor = "#000000"; // Clear shadow style outside of check as ctxMul state changes always occur
      ctxMul.shadowBlur = 0;
      if (!c1.v) {
        ctxMul.fillStyle = grad;
        ctxMul.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
        ctxMul.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
      } else {
        ctxAdd.shadowColor = "#000000"; // Clear shadow style inside of check as ctxAdd state changes are conditional
        ctxAdd.shadowBlur = 0;
        ctxAdd.fillStyle = grad;
        ctxAdd.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2); // single call as to not blur things so much.
      }
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
        grad = ctxMul.createRadialGradient(x1, y1, r1, x1, y1, r2);
        grad.addTransparentColorStops(0, c1, c2);
        ctxMul.fillStyle = grad;
        ctxAdd.fillStyle = grad;
        ctxMul.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
        if (c1.v) ctxAdd.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
      }
      ctxMul.fillStyle = grad;
      ctxAdd.fillStyle = grad;
      ctxMul.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
      if (c1.v) ctxAdd.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
    }

    //ctxMul.restore();
    if (isRMMV()) {
      this.multiply._setDirty(); // doesn't exist in RMMZ
      if (c1.v) this.additive._setDirty(); // doesn't exist in RMMZ
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

  $$.ReloadMapEvents = function () {
    //**********************fill up new map-array *************************
    eventObjId = [];
    event_id = [];
    events = $gameMap.events(); // cache because events() API calls filter for each call
    event_stacknumber = [];
    event_eventcount = events.length;

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
      }
    }
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
      if (targetProps) targetProps.parseProps(args[2] != null ? args[2].split(/\s+/) : ['']);
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
    if (cmd.equalsIC('set', 'fade'))
      $gameVariables.SetTintTarget(ColorDelta.createTint(new VRGBA(args[1]), 60 * (+args[2] || 0)));
    else if (cmd.equalsIC("reset", "daylight")) {
      let fadeDuration = 60 * (+args[1] || 0);
      let delta = ColorDelta.createTimeTint(false, 0); // get the daynight tint for the current time
      delta = ColorDelta.createTint(delta.get(), fadeDuration); // use tint for current time as target
      $gameVariables.SetTintTarget(delta);
    }
  };

  /**
   *
   * @param {String[]} args
   */
  $$.tintbattle = function (args, overrideInBattleCheck = false) {
    if ($gameVariables.GetScriptActive() && lightInBattle && ($gameParty.inBattle() || overrideInBattleCheck)) {
      let cmd = args[0].trim();
      if (cmd.equalsIC("set", 'fade'))
        $gameTemp._BattleTintTarget = ColorDelta.createBattleTint(new VRGBA(args[1], "#666666"), 60 * (+args[2] || 0));
      else if (cmd.equalsIC('reset', 'daylight')) {
        $gameTemp._BattleTintTarget = ColorDelta.createBattleTint($gameTemp._BattleTintInitial, 60 * (+args[1] || 0));
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
  this._Community_Tint_Value = value.clone();
};
Game_Variables.prototype.GetTint = function () {
  if (!this._Community_Tint_Value) this._Community_Tint_Value = VRGBA.minRGBA();
  return this._Community_Tint_Value.clone();
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
  this._Community_TintTarget = delta;
};
Game_Variables.prototype.GetTintTarget = function () {
  if (!this._Community_TintTarget) this._Community_TintTarget = new ColorDelta(this.GetTint());
  return this._Community_TintTarget;
};
Game_Variables.prototype.SetFlashlight = function (value) {
  this._Community_Lighting_Flashlight = value;
};
Game_Variables.prototype.GetFlashlight = function () {
  return orNullish(this._Community_Lighting_Flashlight, false);
};
Game_Variables.prototype.SetFlashlightDensity = function (value) { // don't set if invalid or 0
  if(+value > 0) this._Community_Lighting_FlashlightDensity = +value;
};
Game_Variables.prototype.GetFlashlightDensity = function () {
  let value = +this._Community_Lighting_FlashlightDensity;
  return value || 3; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightLength = function (value) { // don't set if invalid or 0
  if(+value > 0) this._Community_Lighting_FlashlightLength = +value;
};
Game_Variables.prototype.GetFlashlightLength = function () {
  let value = +this._Community_Lighting_FlashlightLength;
  return value || 8; // not undefined, null, NaN, or 0
};
Game_Variables.prototype.SetFlashlightWidth = function (value) { // don't set if invalid or 0
  if(+value > 0) this._Community_Lighting_FlashlightWidth = +value;
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
