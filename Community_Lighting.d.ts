interface Bitmap {
  radialgradientFillRect(x1: number, y1: number, innerRadius: number, outerRadius: number, color1: string, color2: String, flicker: boolean, brightness: number, direction: number): void

  FillCircle(centerX: number, centerY: number, xradius: number, yradius: number, color1: String): void;
}

interface Game_Interpreter {

  reload(command: String, arg: String[]);
  tileType(command: String, args: String[]);
}

interface Game_Event {
  getLightCycle(): String[];
  getCLTag(): String;

  incrementLightCycle(): void;
}



namespace Community {
  interface Lighting {
    tint(args: String[]);
    tile(args: String[]);
    ReloadMapEvents(): void;

    ReloadTagArea(): void;

    distance(): number;

    name: String;
  }
}

interface Game_Variables {

  _Community_Lighting_LightTags: String[];
  GetTileArray(): String[];

  GetLightTags(): String[];
  SetTileArray(array: String[]): void;


  SetLightTags(array: String[]): void;

  SetLightArrayId(id: String): void;

  SetBlockTags(array: String[]): void;

  GetBlockTags(): void;

  SetPlayerColor(color: String): void;

  GetDaynightSpeed(): Number;

  SetDaynightSpeed(speed: Number): void;

  GetDaynightTimer(): Number;

  SetDaynightTimer(timer: Number): void;

  GetDaynightCycle(): Number;

  SetDaynightCycle(cycle: Number): void;

  GetDaynightHoursinDay(): Number;
}
