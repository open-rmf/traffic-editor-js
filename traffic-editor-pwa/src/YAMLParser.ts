import { useStore } from './Store'
import { Building } from './Building'
import YAML from 'yaml'


export function YAMLParser(yaml_text: string, url_base: string): Building {
  const building = Building.fromYAML(yaml_text);
  building.url_base = url_base;
  const cameraInitialPose = building.computeInitialCameraPose();

  useStore.setState({
    building: building,
    selection: null,
    cameraInitialPose: cameraInitialPose
  });

  return building;
}

export async function YAMLRetriever(url_base: string, resource_name: string): Promise<void> {
  await fetch(url_base + resource_name)
    .then(response => response.text())
    .then(text => YAMLParser(text, url_base))
}

export async function YAMLRetrieveDemo(name: string): Promise<void> {
  await YAMLRetriever(
    process.env.PUBLIC_URL + `/demos/${name}/`,
    `${name}.building.yaml`);
}

export async function YAMLSender(url: string): Promise<void> {
  Object.getPrototypeOf(YAML.YAMLMap).maxFlowStringSingleLineLength = 10000;
  const { building } = useStore.getState();
  let yaml_text: string = building.toYAMLString();
  let yaml_size = new Blob([yaml_text]).size;  // utf-8 encoding length
  await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-yaml',
      'content-length': yaml_size.toString(),
    },
    body: yaml_text,
  });
}
