import * as THREE from 'three'
import YAML from 'yaml'
import { EditorObject } from './EditorObject';
import { ParamArrayFromYAML } from './Param';

export class Lane extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(lane_data: any): Lane {
    let lane = new Lane();
    lane.start_idx = lane_data[0];
    lane.end_idx = lane_data[1];
    lane.generate_uuid();
    lane.params = ParamArrayFromYAML(lane_data[2]);
    return lane;
  }
}

export class Wall extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(wall_data: any): Wall {
    let wall = new Wall();
    wall.start_idx = wall_data[0];
    wall.end_idx = wall_data[1];
    wall.params = ParamArrayFromYAML(wall_data[2]);
    wall.generate_uuid();
    return wall;
  }
}

export class Floor extends EditorObject {
  vertex_indices: number[] = [];

  static fromYAML(floor_data: any): Floor {
    let floor = new Floor();
    floor.generate_uuid();
    floor.params = ParamArrayFromYAML(floor_data['parameters']);
    for (const vertex_idx of floor_data['vertices']) {
      floor.vertex_indices.push(vertex_idx);
    }
    return floor;
  }
}

export class Vertex extends EditorObject {
  x: number = 0;
  y: number = 0;
  name: string = '';

  static fromYAML(vertex_data: any): Vertex {
    let vertex = new Vertex();
    vertex.x = vertex_data[0];
    vertex.y = -vertex_data[1];
    vertex.name = vertex_data[3];
    vertex.params = ParamArrayFromYAML(vertex_data[4]);
    vertex.generate_uuid();
    return vertex;
  }
}

export class Level extends EditorObject {
  name: string = '';
  elevation: number = 0;
  vertices: Vertex[] = [];
  walls: Wall[] = [];
  lanes: Lane[] = [];
  floors: Floor[] = [];

  static fromYAML(level_name: string, level_data: any): Level {
    let level = new Level();
    level.name = level_name;
    level.elevation = level_data['elevation'];
    level.generate_uuid();
    for (const vertex_data of level_data['vertices']) {
      level.vertices.push(Vertex.fromYAML(vertex_data));
    }
    for (const wall_data of level_data['walls']) {
      level.walls.push(Wall.fromYAML(wall_data));
    }
    for (const lane_data of level_data['lanes']) {
      level.lanes.push(Lane.fromYAML(lane_data));
    }
    for (const floor_data of level_data['floors']) {
      level.floors.push(Floor.fromYAML(floor_data));
    }

    return level;
  }
}

export class Lift extends EditorObject {
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
    building.generate_uuid();
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

  computeBoundingBox(): THREE.Box3 {
    let vec_min = new THREE.Vector3(Infinity, Infinity, Infinity);
    let vec_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const level of this.levels) {
      for (const vertex of level.vertices) {
        if (vertex.x < vec_min.x)
          vec_min.x = vertex.x;
        if (vertex.x > vec_max.x)
          vec_max.x = vertex.x;

        if (vertex.y < vec_min.y)
          vec_min.y = vertex.y;
        if (vertex.y > vec_max.y)
          vec_max.y = vertex.y;
      }
    }
    return new THREE.Box3(vec_min, vec_max);
  }
}
