import {
  useStore,
  EditorBuilding,
  EditorLevel,
  EditorParam,
  EditorWall,
  EditorFloor,
  EditorLane,
  EditorVertex,
  CameraPose } from './EditorStore'
import YAML from 'yaml'
import { v4 as generate_uuid } from 'uuid'
import * as THREE from 'three'

function ParamArrayFactory(params_data: any): EditorParam[] {
  if (!params_data)
    return []
  let params = Array<EditorParam>();
  for (const param_name in params_data) {
    const param_data = params_data[param_name];
    let p: EditorParam = {
      name: param_name,
      type_idx: param_data[0],
      value: param_data[1],
      uuid: generate_uuid(),
    }
    params.push(p)
  }
  return params
}

function VertexFactory(vertex_data: any): EditorVertex {
  return {
    x: vertex_data[0],
    y: -vertex_data[1],
    name: vertex_data[3],
    uuid: generate_uuid(),
    params: ParamArrayFactory(vertex_data[4]),
  }
}

function WallFactory(wall_data: any): EditorWall {
  return {
    start_idx: wall_data[0],
    end_idx: wall_data[1],
    params: ParamArrayFactory(wall_data[2]),
    uuid: generate_uuid(),
  }
}

function FloorFactory(floor_data: any): EditorFloor {
  return {
    uuid: generate_uuid(),
    params: ParamArrayFactory(floor_data['parameters']),
    vertex_indices: floor_data['vertices'].map((vertex_idx: number) => vertex_idx),
  }
}

function LaneFactory(lane_data: any): EditorLane {
  return {
    uuid: generate_uuid(),
    start_idx: lane_data[0],
    end_idx: lane_data[1],
    params: ParamArrayFactory(lane_data[2]),
  }
}

function LevelFactory(level_name: string, level_data: any): EditorLevel {
  return {
    uuid: generate_uuid(),
    name: level_name,
    elevation: level_data['elevation'],
    params: Array<EditorParam>(),
    vertices: level_data['vertices'].map((vertex: any) => VertexFactory(vertex)),
    walls: level_data['walls'].map((wall: any) => WallFactory(wall)),
    floors: level_data['floors'].map((floor: any) => FloorFactory(floor)),
    lanes: level_data['lanes'].map((lane: any) => LaneFactory(lane)),
  }
}

function BuildingFactory(yaml_text: string): EditorBuilding {
  const yaml = YAML.parse(yaml_text)
  const name = yaml['name']  // todo: make up a name if it's not here
  let building = {
    name: name,
    levels: Array<EditorLevel>(), //[],
    params: [],
    uuid: generate_uuid()
  }
  for (const level_name in yaml['levels']) {
    const level_data = yaml['levels'][level_name]
    building.levels.push(LevelFactory(level_name, level_data));
  }

  return building
}

function computeBoundingBox(building: EditorBuilding): THREE.Box3 {
  let vec_min = new THREE.Vector3(Infinity, Infinity, Infinity);
  let vec_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const level of building.levels) {
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

export function computeInitialCameraPose(building: EditorBuilding): CameraPose {
  const bb: THREE.Box3 = computeBoundingBox(building);
  const target = new THREE.Vector3(
    (bb.min.x + bb.max.x) / 2.0 / 50,
    (bb.min.y + bb.max.y) / 2.0 / 50,
    0.0);
  const position = new THREE.Vector3(
    target.x + 10,
    target.y - 10,
    target.z + 10);
  return {
    position: position,
    target: target
  };
}

export function YAMLParser(yaml_text: string): void {
  const building = BuildingFactory(yaml_text);
  const cameraInitialPose = computeInitialCameraPose(building);

  useStore.setState({
    building: building,
    selection: null,
    cameraInitialPose: cameraInitialPose
  });
}

export async function YAMLRetriever(uri: string): Promise<void> {
  await fetch(uri)
    .then(response => response.text())
    .then(text => YAMLParser(text));
}

export async function YAMLRetrieveDemo(name: string): Promise<void> {
  await YAMLRetriever(
    process.env.PUBLIC_URL + `/demos/${name}/${name}.building.yaml`);
}
