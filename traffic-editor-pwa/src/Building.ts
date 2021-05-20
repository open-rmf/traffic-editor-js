import YAML from 'yaml'
import { EditorObject } from './EditorObject';

export class Param extends EditorObject {
  type_idx: number = 0;
  name: string = '';
  value: any = null;

  static fromYAML(param_name: string, param_data: any): Param {
    let p = new Param();
    p.name = param_name;
    p.type_idx = param_data[0];
    p.value = param_data[1];
    return p;
  }
}

// useful helper in a few of our YAML parsing spots
const ParamArrayFromYAML = (params_data: any | null) => {
  if (!params_data)
    return [];
  let params = [];
  for (const param_name in params_data) {
    const param = Param.fromYAML(param_name, params_data[param_name]);
    params.push(param);
  }
  return params;
}

export class Lane {
  start_idx: number = -1;
  end_idx: number = -1;
  params: Param[] = [];

  static fromYAML(lane_data: any): Lane {
    let lane = new Lane();
    lane.start_idx = lane_data[0];
    lane.end_idx = lane_data[1];
    lane.params = ParamArrayFromYAML(lane_data[2]);
    return lane;
  }
}

export class Wall {
  start_idx: number = -1;
  end_idx: number = -1;
  params: Param[] = [];

  static fromYAML(wall_data: any): Wall {
    let wall = new Wall();
    wall.start_idx = wall_data[0];
    wall.end_idx = wall_data[1];
    wall.params = ParamArrayFromYAML(wall_data[2]);
    return wall;
  }
}

export class Vertex {
  x: number = 0;
  y: number = 0;
  name: string = '';
  params: Param[] = [];

  static fromYAML(vertex_data: any): Vertex {
    let vertex = new Vertex();
    vertex.x = vertex_data[0];
    vertex.y = -vertex_data[1];
    vertex.name = vertex_data[3];
    vertex.params = ParamArrayFromYAML(vertex_data[4]);
    return vertex;
  }
}

export class Level {
  name: string = '';
  elevation: number = 0;
  vertices: Vertex[] = [];
  walls: Wall[] = [];
  lanes: Lane[] = [];

  static fromYAML(level_name: string, level_data: any): Level {
    let level = new Level();
    level.name = level_name;
    level.elevation = level_data['elevation'];
    for (const vertex_data of level_data['vertices']) {
      level.vertices.push(Vertex.fromYAML(vertex_data));
    }
    for (const wall_data of level_data['walls']) {
      level.walls.push(Wall.fromYAML(wall_data));
    }
    for (const lane_data of level_data['lanes']) {
      level.lanes.push(Lane.fromYAML(lane_data));
    }
    return level;
  }
}

export class Lift {
  name: string = '';
  // todo
}

export class Building extends EditorObject {
  name: string = '';
  filename: string = '';
  yaml: string = '';
  levels: Level[] = [];
  lifts: Lift[] = [];
  crowd_sim: any = undefined;

  static fromYAML(yaml_text: string): Building {
    let building = new Building();
    building.yaml = yaml_text;
    const y = YAML.parse(yaml_text);
    building.name = y['name'];
    building.crowd_sim = y['crowd_sim'];
    building.levels = [];
    for (const level_name in y['levels']) {
      const level_data = y['levels'][level_name];
      building.levels.push(Level.fromYAML(level_name, level_data));
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
