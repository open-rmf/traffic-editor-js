//const yaml = require('js-yaml');
import YAML from 'yaml'

export class Param {
  type_idx: number = 0;
  name: string = '';
  value: any = null;

  static fromYAML(params_data: any): Param {
    let p = new Param();
    p.name = this.name;
    return p;
  }
  /*
  if (!params_data)
    return [];
  const p = [];
  for (const param_name in params_data) {
    const param_data = params_data[param_name];
    const param: Param = {
      name: param_name,
      type_idx: param_data[0],
      value: param_data[1],
    };
    p.push(param);
  }
  return p;
  */
}

export class Lane {
  start_idx: number = -1;
  end_idx: number = -1;
  params: Param[] = [];
}

export class Wall {
  start_idx: number = -1;
  end_idx: number = -1;
  params: Param[] = [];
}

export class Vertex {
  x: number = 0;
  y: number = 0;
  name: string = '';
  params: Param[] = [];
}

export class Level {
  name: string = '';
  elevation: number = 0;
  vertices: Vertex[] = [];
  walls: Wall[] = [];
  lanes: Lane[] = [];
}

export class Lift {
  name: string = '';
}

export class Building {
  name: string = '';
  filename: string = '';
  yaml: string = '';
  levels: Level[] = [];
  lifts: Lift[] = [];
  crowd_sim: any = undefined;

  constructor() {
    this.clear();
  }

  clear() {
    this.name = '';
    this.filename = '';
    this.yaml = '';
    this.levels = [];
    this.lifts = [];
    this.crowd_sim = undefined;
  }

  static fromYAML(yaml_text: string): Building {
    let building = new Building();
    building.yaml = yaml_text;
    const y = YAML.parse(yaml_text);
    building.name = y['name'];
    building.crowd_sim = y['crowd_sim'];
    building.levels = [];
    for (const level_name in y['levels']) {
      const level_data = y['levels'][level_name];
      building.levels.push(LevelFromYAML(level_name, level_data));
    }
    return building;
  }

  static async fromURL(uri: string): Promise<Building> {
    return fetch(uri)
      .then(response => response.text())
      .then(text => Building.fromYAML(text));
  }

  static async fromDemo(name: string): Promise<Building> {
    return fetch(process.env.PUBLIC_URL + `/demos/${name}/${name}.building.yaml`)
      .then(response => response.text())
      .then(text => Building.fromYAML(text));
  }

}

///////////////////////////////////////////////////////////////////

const ParamArrayFromYAML = (params_data: any | null) => {
  if (!params_data)
    return [];
  const p = [];
  for (const param_name in params_data) {
    const param_data = params_data[param_name];
    const param: Param = {
      name: param_name,
      type_idx: param_data[0],
      value: param_data[1],
    };
    p.push(param);
  }
  return p;
}

const VertexFromYAML = (vertex_data: any): Vertex => {
  const vertex: Vertex = {
    x: vertex_data[0],
    y: -vertex_data[1],
    name: vertex_data[3],
    params: ParamArrayFromYAML(vertex_data[4])
  };
  return vertex;
}

const WallFromYAML = (wall_data: any): Wall => {
  const wall: Wall = {
    start_idx: wall_data[0],
    end_idx: wall_data[1],
    params: ParamArrayFromYAML(wall_data[2]),
  }
  return wall;
}

const LaneFromYAML = (lane_data: any): Wall => {
  const lane: Lane = {
    start_idx: lane_data[0],
    end_idx: lane_data[1],
    params: ParamArrayFromYAML(lane_data[2]),
  }
  return lane;
}

const LevelFromYAML = (level_name: string, level_data: any): Level => {
  const level: Level = {
    name: level_name,
    elevation: 0,
    vertices: [],
    walls: [],
    lanes: []
  };
  level.elevation = level_data['elevation'];
  for (const vertex_data of level_data['vertices']) {
    level.vertices.push(VertexFromYAML(vertex_data));
  }
  for (const wall_data of level_data['walls']) {
    level.walls.push(WallFromYAML(wall_data));
  }
  for (const lane_data of level_data['lanes']) {
    level.lanes.push(LaneFromYAML(lane_data));
  }
  return level;
}
