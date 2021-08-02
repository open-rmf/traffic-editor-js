export enum CoordinateSystem {
  Undefined = 0,
  Legacy = 1,
  WGS84 = 2,
  WebMercator = 3,
}
 
// Wanted to have these functions inside a CoordinateSystem
// namespace, but this triggers @typescript-eslint/no-redeclare
// so I'll just prefix the function names below. Not sure
// if there is a nicer way to do this.

export function CoordinateSystemToString(cs: CoordinateSystem): string {
  if (cs === CoordinateSystem.Legacy) {
    return "legacy";
  }
  else if (cs === CoordinateSystem.WGS84) {
    return "wgs84";
  }
  else if (cs === CoordinateSystem.WebMercator) {
    return "web_mercator";
  }
  else {
    return "unknown";
  }
}

export function CoordinateSystemFromString(s: string): CoordinateSystem {
  let cs: CoordinateSystem = CoordinateSystem.Undefined;
  if (s === "legacy") {
    cs = CoordinateSystem.Legacy;
  }
  else if (s === "wgs84") {
    cs = CoordinateSystem.WGS84;
  }
  else if (s === "web_mercator") {
    cs = CoordinateSystem.WebMercator;
  }
  else {
    console.log("AHHHHH unknown coordinate system: " + s);
  }
  return cs;
}
