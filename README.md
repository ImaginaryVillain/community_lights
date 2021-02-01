# Community Lighting
A community driven lighting plugin for RPG Maker MV and MZ

# Quickstart:

**If you want to have the demo:**

First download the demo zip corresponding to your rpg maker version:
First select the desired item, then on the next screen, click the 'Download' button. Don't use Save Link As, you will save an empty zip.
In the mean time, create a new blank project in rpg maker.
When the download is done, unzip the demo and paste the content of the zip in the blank project.
Reopen the blank project, your demo is ready to go.

**If you want just to use the script:**

Download the Community_Lighting.js or Community_Lighting_MZ.js file corresponding to your rpg maker version:
First select the desired item, then on the next screen, then right-click the 'Raw' button, and choose Save Link As.
Don't use Save Link As on the front page, you will instead download a weird html version of the script.
Add it to your project as you will do with any other plugin.
Create a map with a light source (an event with a notetag like <cl: light 250 #ffffff> by default), and see the result in game.

# FAQ:

**-I have the plugin activated, (I may even put a daylight notetag in the map's notes) but there is no light effect on my map.**

The plugin will not do anything on maps who don't have at least one light source.
An easy fix is to just add a notetag like this one to any existing event: <cl: light 0 #000000>.
It will create the first light source (invisble, since it has a radius of 0) needed to activate the plugin.

**-The demo doesn't work?**

Please make sure you downloaded the good file, as described in the quickstart.
If you followed the instructions of the quickstart and still have problems with the demo,
please report it on the related thread on rpgmakerweb: https://forums.rpgmakerweb.com/index.php?threads/community-lighting-mv-mz.124274/.

**-Is the MV version of this plugin a direct update to Terrax Lighting? Can I migrate from Terrax Lighting to this plugin without additional effort?**

Yes to both. All the syntax is the same, however note that by default it now uses proper note tags for events.
This is so it can play better with other plugins that might also involve using note tags on events.

<cl: light 250 #ffffff> // community lighting version

light 250 #ffffff // original terrax version

You can switch back to the terrax formatting in the plugin parameters. (Parameter 'Note Tag Key', leave it blank to use Terrax's synthax.)

**-How would I make the black areas not be pitch black?**

Use the set tint plugin command.

**-Why is the MV demo way bigger than the MZ one?**

MZ RTP graphics take very little disc space compared to the MV's ones.

**-What if I have questions not answered there?**

You can post your questions on the related thread on rpgmakerweb: https://forums.rpgmakerweb.com/index.php?threads/community-lighting-mv-mz.124274/.

# Help File:

* --------------------------------------------------------------------------
* Important info about note tags and the note tag key plugin paramter:  This
* plugin features an optional note tag key that lets this plugin's note tags
* work alongside those of other plugins--a feature not found in the original
* Terrax Lighting plugin. If a note tag key is set in the plugin paramters,
* all of these commands must be enclosed in a note tag with that particular
* key in in order to be recognized.
*
* This note tag key applies to anything this plugin would have placed inside
* a note box, such as "DayNight" on a map or "Light/Fire/etc on an event.
*
* Examples:
*
* With the default note tag key, "CL" (not case sensitive):
* <CL: Light 250 #ffffff>
* <CL: Daynight>
* ...etc
*
* Without a note tag key set:
* Light 250 #ffffff
* Daynight
* ...etc
*
* Using a note tag key is recommended since it allows for other things
* (plugins, or even you rown personal notes) to make use of the note box
* without breaking things.  Omiting the key is intended primarily as legacy
* support, allowing this plugin to be used with older projects that use Terrax
* Lighting so they don't have to go back and change a bunch of event and map
* notes.
*
* Notation characters:
* []   Values are optional (the brightness parameter in light, etc)
* |    Select the value from the specified list (on|off, etc)
*
* Do not include these in the actual plugin commands.
* --------------------------------------------------------------------------
* List of Note Tags
* --------------------------------------------------------------------------
* Events
* --------------------------------------------------------------------------
* DayNight
* - Activates day/night cycle.  Put in map note or event note
*
* Light radius color [brightness] [direction] [x] [y] [id]
* - Light
* - radius      100, 250, etc
* - color       #ffffff, #ff0000, etc
* - brightness  B50, B25, etc [optional]
* - direction   D1: n.wall, D2: e.wall, D3: s.wall, D4: w.wall
*               D5 n.+e. walls, D6 s.+e. walls, D7 s.+w. walls,
*               D8 n.+w. walls, D9 n.-e. corner, D10 s.-e. corner
*               D11 s.-w. corner, D12 n.-w. corner  [optional]
* - x           x offset [optional] (0.5: half tile, 1 = full tile, etc)
* - y           y offset [optional]
* - id          1, 2, 2345, etc--an id number for plugin commands [optional]

*
* Light radius cycle color dur color dur [color dur]  [x] [y]  [color dur]
* Cycles the specified light colors and durations.  Min 2, max 4
* - radius      Same as standard Light command above
* - color       Color (#ff8800, etc)
* - dur         Duration in ms
*
* Fire ...params
* - Same as Light params above, but adds a subtle flicker
*
* Flashlight [bl] [bw] [c] [onoff]  [x] [y]  [sdir]
* - Sets the light as a flashlight with beam length (bl) beam width (bw) color (c),
*      0|1 (onoff), and 1=up, 2=right, 3=down, 4=left for static direction (sdir)
*
* -------------------------------------------------------------------------------
* Maps
* -------------------------------------------------------------------------------
* DayNight [speed]
* Activates day/night cycle.  Put in map note or event note
* - speed     Optional parameter to alter the speed at which time passes.  10 is
				 the default speed, higher numbers are slower, lower numbers are
				 faster, and 0 stops the flow of time entirely.  If speed is not
				 specified, then the current speed is used.
*
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
* Light radiusgrow r c b
* - Same as above, but apply changes over time
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
* - Changes the speec by which hours pass ingame in relation to real life seconds
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
* Daynight debug
* - Shows current ingame time
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
* effect_on_event id radius color frames
* - id			event id
* - radius		radius
* - color		color
* - frames		frames to persist
*
* effect_on_xy x y radius color frames
* - x			x coord
* - y			y coord
* - radius		radius
* - color		color
* - frames		frames to persist
*
* --------------------------------------------------------------------------
* Kill Switch and conditional lighting
* --------------------------------------------------------------------------
*
* If the 'Kill Switch Auto' parameter has been set to true, any event with
* a (non) active conditional light have their killswitch locked to ON(OFF).
* You can use this difference to give alternate apparences to these events.
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
