//const yaml = require('js-yaml');
import YAML from 'yaml'

export interface Param {
  type_idx: number;
  name: string;
  value: any;
}

export interface Lane {
  start_idx: number;
  end_idx: number;
  params: Param[];
}

export interface Wall {
  start_idx: number;
  end_idx: number;
  params: Param[];
}

export interface Vertex {
  x: number;
  y: number;
  name: string;
  params: Param[];
}

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


export interface Level {
  name: string;
  vertices: Vertex[];
  walls: Wall[];
  lanes: Lane[];
}

const LevelFromYAML = (level_name: string, level_data: any): Level => {
  const level: Level = {
    name: level_name,
    vertices: [],
    walls: [],
    lanes: []
  };
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

export interface Lift {
  name: string;
}

export interface Building {
  name: string;
  filename: string;
  yaml: string;
  levels: Level[];
  lifts: Lift[];
  crowd_sim: any;
}

export const BuildingDefault: Building = {
  name: '',
  filename: '',
  yaml: '',
  levels: [],
  lifts: [],
  crowd_sim: undefined,
}

export const BuildingParseYAML = (building: Building, filename: string, yaml_text: string) => {
  building.filename = filename;
  building.yaml = yaml_text;
  const y = YAML.parse(yaml_text);
  building.name = y['name'];
  building.crowd_sim = y['crowd_sim'];
  building.levels = [];
  for (const level_name in y['levels']) {
    const level_data = y['levels'][level_name];
    building.levels.push(LevelFromYAML(level_name, level_data));
  }
  console.log('parsed it');
}
