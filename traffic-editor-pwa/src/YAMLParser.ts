import {
  CameraPose,
  EditorBuilding,
  EditorFeature,
  EditorFloor,
  EditorImage,
  EditorLane,
  EditorLevel,
  EditorMeasurement,
  EditorParam,
  EditorVertex,
  EditorWall,
  useStore,
} from './EditorStore'
import YAML from 'yaml'
import { v4 as generate_uuid } from 'uuid'
import * as THREE from 'three'

/*
function FeatureFactory(data: any): EditorFeature {
  return {
    uuid: data['id'],
    params: [],
    name: data['name'],
    x: data['x'],
    y: data['y'],
  };
}

function MeasurementFactory(data: any): EditorMeasurement {
  return {
    uuid: generate_uuid(),
    params: [],
    start_idx: data[0],
    end_idx: data[1],
    distance: data[2]['distance'][1],
  };
}

function LevelFactory(level_name: string, level_data: any): EditorLevel {
  let images = new Array<EditorImage>();
  if (level_data['drawing'] && level_data['drawing']['filename']) {
    let image: EditorImage = {
      filename: level_data['drawing']['filename'],
      offset: new THREE.Vector3(0, 0, 0),
      yaw: 0,
      scale: 1,
      isLegacyDefaultImage: true,
      uuid: generate_uuid(),
      params: Array<EditorParam>(),
    };
    images.push(image);
  }

  return {
    uuid: generate_uuid(),
    name: level_name,
    elevation: level_data['elevation'],
    params: Array<EditorParam>(),
    images: images,
    constraints: level_data['constraints'].map((constraint: any) => ConstraintFactory(constraint)),
    features: level_data['features'].map((feature: any) => FeatureFactory(feature)),
    vertices: level_data['vertices'].map((vertex: any) => VertexFactory(vertex)),
    walls: level_data['walls'].map((wall: any) => WallFactory(wall)),
    measurements: level_data['measurements'].map((measurement: any) => MeasurementFactory(measurement)),
    floors: level_data['floors'].map((floor: any) => FloorFactory(floor)),
    lanes: level_data['lanes'].map((lane: any) => EditorLane.from_yaml(lane)),
  };
}
*/

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
  const building = EditorBuilding.from_yaml(yaml_text); //BuildingFactory(yaml_text);
  const cameraInitialPose = computeInitialCameraPose(building);

  useStore.setState({
    building: building,
    selection: null,
    cameraInitialPose: cameraInitialPose
  });
}

export async function YAMLRetriever(url: string): Promise<void> {
  await fetch(url)
    .then(response => response.text())
    .then(text => YAMLParser(text));
}

export async function YAMLRetrieveDemo(name: string): Promise<void> {
  await YAMLRetriever(
    process.env.PUBLIC_URL + `/demos/${name}/${name}.building.yaml`);
}

function ParamArrayYAML(params: EditorParam[]): YAML.Node {
  let node = new YAML.YAMLMap();
  for (const param of params) {
    let param_value_node = new YAML.YAMLSeq();
    param_value_node.add(param.type_idx);
    param_value_node.add(param.value);
    param_value_node.flow = true;
    node.add({ key: param.name, value: param_value_node });
  }
  node.flow = true;
  return node;
}

function VertexYAML(vertex: EditorVertex): YAML.Node {
  let node = new YAML.YAMLSeq();
  node.add(vertex.x);
  node.add(-vertex.y);
  node.add(0.0);
  node.add(vertex.name);
  if (vertex.params.length)
    node.add(ParamArrayYAML(vertex.params));
  node.flow = true;
  return node;
}

function WallYAML(wall: EditorWall): YAML.Node {
  let node = new YAML.YAMLSeq();
  node.add(wall.start_idx);
  node.add(wall.end_idx);
  node.add(ParamArrayYAML(wall.params));
  node.flow = true;
  return node;
}

function FeatureYAML(feature: EditorFeature): YAML.Node {
  let node = new YAML.YAMLMap();
  node.add({ key: 'id', value: feature.uuid });
  node.add({ key: 'name', value: feature.name });
  node.add({ key: 'x', value: feature.x });
  node.add({ key: 'y', value: feature.y });
  node.flow = true;
  return node;
}

function MeasurementYAML(measurement: EditorMeasurement): YAML.Node {
  let node = new YAML.YAMLSeq();
  node.add(measurement.start_idx);
  node.add(measurement.end_idx);
  const dummy_dist_param: EditorParam = {
    name: 'distance',
    uuid: 'dummy',
    type_idx: 3,
    value: measurement.distance,
  };
  node.add(ParamArrayYAML(measurement.params.concat(dummy_dist_param)));
  node.flow = true;
  return node;
}

function LevelYAML(level: EditorLevel): YAML.Node {
  let node = new YAML.YAMLMap();
  let vertices_node = new YAML.YAMLSeq();
  for (const vertex of level.vertices) {
    vertices_node.add(VertexYAML(vertex));
  }
  if (level.images.length > 0 && level.images[0].isLegacyDefaultImage) {
    node.add({ key: 'drawing', value: { 'filename': level.images[0].filename } });
  }
  node.add({ key: 'elevation', value: level.elevation });
  node.add({ key: 'features', value: level.features.map((feature) => FeatureYAML(feature)) });
  node.add({ key: 'measurements', value: level.measurements.map((measurement) => MeasurementYAML(measurement)) });
  node.add({ key: 'vertices', value: vertices_node });
  node.add({ key: 'walls', value: level.walls.map((wall) => WallYAML(wall)) });
  return node;
}

function BuildingYAMLString(building: EditorBuilding): string {
  let yaml_doc = new YAML.Document(new YAML.YAMLMap());
  let levels_node = new YAML.YAMLMap();
  for (const level of building.levels) {
    levels_node.add({ key: level.name, value: LevelYAML(level) });
  }
  yaml_doc.add({ key: 'levels', value: levels_node });
  yaml_doc.add({ key: 'lifts', value: {} });
  yaml_doc.add({ key: 'name', value: building.name });
  return yaml_doc.toString({lineWidth: 0, minContentWidth: 0});
}

export async function YAMLSender(url: string): Promise<void> {
  Object.getPrototypeOf(YAML.YAMLMap).maxFlowStringSingleLineLength = 10000;
  console.log('saving: ' + url);
  const { building } = useStore.getState();
  let yaml_text: string = BuildingYAMLString(building);
  let yaml_size = new Blob([yaml_text]).size;  // utf-8 encoding length
  console.log('  content-length: ' + yaml_size.toString());
  await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-yaml',
      'content-length': yaml_size.toString(),
    },
    body: yaml_text,
  });
}
