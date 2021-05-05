//const yaml = require('js-yaml');
import YAML from 'yaml'

export interface Vertex {
  x: number;
  y: number;
  name: string;
}

const VertexFromYAML = (vertex_data: any): Vertex => {
  const vertex: Vertex = {
    x: vertex_data[0],
    y: vertex_data[1],
    name: vertex_data[3],
  };
  return vertex;
}

export interface Level {
  name: string;
  vertices: Vertex[];
}

const LevelFromYAML = (level_name: string, level_data: any): Level => {
  const level: Level = {
    name: level_name,
    vertices: []
  };
  for (const vertex_data of level_data['vertices']) {
    level.vertices.push(VertexFromYAML(vertex_data));
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
  crowd_sim: undefined
}

export const BuildingParseYAML = (building: Building, filename: string, yaml_text: string) => {
  building.filename = filename;
  building.yaml = yaml_text;
  const y = YAML.parse(yaml_text);  //load(yaml_text);
  building.name = y['name'];
  building.crowd_sim = y['crowd_sim'];
  building.levels = [];
  for (const level_name in y['levels']) {
    const level_data = y['levels'][level_name];
    building.levels.push(LevelFromYAML(level_name, level_data));
  }
  console.log('parsed it');
}
