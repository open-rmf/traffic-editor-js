import {
  CameraPose,
  EditorBuilding,
  useStore,
} from './EditorStore'
import YAML from 'yaml'
import * as THREE from 'three'

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
  const building = EditorBuilding.fromYAML(yaml_text);
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

export async function YAMLSender(url: string): Promise<void> {
  Object.getPrototypeOf(YAML.YAMLMap).maxFlowStringSingleLineLength = 10000;
  console.log('saving: ' + url);
  const { building } = useStore.getState();
  let yaml_text: string = building.toYAMLString();
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
