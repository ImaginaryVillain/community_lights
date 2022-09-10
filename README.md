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
	* Creates a fire that only lights up at night.
	*
	* <cl: Flashlight l8 w12 #ff0000 on asdf>
	* Creates a flashlight beam with id asdf which can be turned on or off via
	* plugin commands.
	*
	* --------------------------------------------------------------------------
	* Additive Lighting Effects
	* --------------------------------------------------------------------------
	* Additive lighting gives lights a volumetric appearance. To enable, put 'a' or 'A'
	* in front of any color light color.
	*
	* Example note tags:
	* <cl: light 300 cycle a#990000 15 a#999900 15 a#009900 15 a#009999 15 a#000099 15>
	* Creates a cycling volumetric light that rotates every 15 frames.
	*
	* <cl: Flashlight l8 w12 a#660000 on asdf>
	* Creates a red volumetric flashlight beam with id asdf which can be turned on or off
	* via plugin commands.
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
	* The default light radius that Khas appears to be around 122.
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
	* RegionFire, RegionGlow
	* - Same as above, but different lighting effects
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
	* - Adds the specified hours (h) and minutes (m) to the in game clock
	*
	* Daynight subtract h m
	* - Subtracts the specified hours (h) and minutes (m) from the in game clock
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
