export enum CoordinateSystem {
  Undefined = 0,
  Legacy = 1,
  CartesianMeters = 2,
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
  else if (cs === CoordinateSystem.CartesianMeters) {
    return "cartesian_meters";
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
  else if (s === "cartesian_meters") {
    cs = CoordinateSystem.CartesianMeters;
  }
  else if (s === "web_mercator") {
    cs = CoordinateSystem.WebMercator;
  }
  else {
    console.log("AHHHHH unknown coordinate system: " + s);
  }
  return cs;
}

export function CoordinateSystemScale(cs: CoordinateSystem): [number, number] {
  if (cs === CoordinateSystem.Legacy) {
    return [1.0, -1.0];
  }
  else if (cs === CoordinateSystem.CartesianMeters) {
    return [1.0, 1.0];
  }
  else if (cs === CoordinateSystem.WebMercator) {
    return [1000.0, 1000.0];
  }
  else {
    return [1.0, 1.0];
  }
}
