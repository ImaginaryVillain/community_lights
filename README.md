# Community Lighting
A community driven lighting plugin for RPG Maker MV and MZ

# Quickstart:

**If you want to have the demo:**
On the front Github page, click on CommunityLightingMVDemo.zip or CommunityLightingMZDemo.zip.
On the next screen, click the 'Download' button.
Don't use Save Link As, you will instead save an empty zip.

When the download is done, you can open as any MV/MZ project.

**If you want just to use the script:**

On the front Github page, click on Community_Lighting.js or Community_Lighting_MZ.js.
On the next screen, right-click the 'Raw' button, and choose Save Link As.
Don't use Save Link As on the front page, you will instead download a weird html version of the script.

Add it to your project as you will do with any other plugin.

# FAQ:

**-The demo doesn't work?**

Please make sure you downloaded the good file corresponding to you rpgmaker version, as described in the quickstart.
If you followed the instructions of the quickstart and still have problems with the demo,
please report it on the related thread on rpgmakerweb: https://forums.rpgmakerweb.com/index.php?threads/community-lighting-mv-mz.124274/.

**-Is the MV version of this plugin a direct update to Terrax Lighting? Can I migrate from Terrax Lighting to this plugin without additional effort?**

Yes to both. All the syntax is the same, however note that by default it now uses proper note tags for events.
This is so it can play better with other plugins that might also involve using note tags on events.

<cl: light 250 #ffffff> // community lighting version

light 250 #ffffff // original terrax version

You can switch back to the terrax formatting in the plugin parameters. (Parameter 'Note Tag Key', leave it blank to use Terrax's synthax.)

**-Do I still have to put at least one light event in order to activate the script on a map?**

There is now a plugin paramater ('Light event required') who allows you to have the plugin active even with no lightsource on a map.

**-How would I make the black areas not be pitch black?**

Use the set tint plugin command.

**-Why is the MV demo way bigger than the MZ one?**

MZ RTP graphics take very little disc space compared to the MV's ones.

**-What if I have questions not answered there?**

You can post your questions on the related thread on rpgmakerweb: https://forums.rpgmakerweb.com/index.php?threads/community-lighting-mv-mz.124274/.

# Help File:

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
	* Light radius color [enable] [day|night] [brightness] [direction] [x] [y] [id]
	* Light radius cycle <color [pauseDuration]>... [enable] [day|night] [brightness] [direction] [x] [y] [id]
	* Light [radius] [color] [{CycleProps}...] [enable] [day|night] [brightness] [direction] [x] [y] [id]
	* - Light
	* - radius      Any number, optionally preceded by "R" or "r", so 100, R100, r100, etc.
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
	* - sdir:       Forced direction (optional): 0:auto, 1:up, 2:right, 3:down, 4:left
	*               Can be preceded by "D" or "d", so D4, d4, etc. If omitted, defaults to 0
	* - angle:      Forced direction in degrees (optional): must be preceded by "A" or "a". If
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
	* Creates a basic light
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
	*

# Dev Notes
Automatically Pretty JSON data files for pre-commit
**This will make json files more readable for easier code reviews**

Used below Tutorial and modified script to suit this project.
https://forums.rpgmakerweb.com/index.php?threads/automatically-pretty-json-files-for-clean-git-commit-diffs-using-git-hooks.108122/

This is a client side hook so all developers need to update their `.git/hooks/pre-commit` with what I have provided.
hooks/pre-commit-1.0.js

Developers can just rename to `pre-commit` (no extension) then copy and paste in .git/hooks/

When updates are needed the shared hook should be updated and the local .git hook can be found here and also be updated.
.git/hooks/pre-commit
