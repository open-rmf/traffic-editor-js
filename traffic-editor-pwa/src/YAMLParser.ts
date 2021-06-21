import { useStore, EditorBuilding } from './EditorStore'
import YAML from 'yaml'


export function YAMLParser(yaml_text: string): void {
  const building = EditorBuilding.fromYAML(yaml_text);
  const cameraInitialPose = building.computeInitialCameraPose();

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
