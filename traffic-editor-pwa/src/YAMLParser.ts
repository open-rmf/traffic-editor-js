import { useStore } from './Store';
import { Building } from './Building';
import { Complex } from './Complex';
import YAML from 'yaml';
import { v4 as generate_uuid } from 'uuid';


export function YAMLParser(yaml_text: string, url_base: string): Building {
  const building = Building.fromYAML(yaml_text);
  building.url_base = url_base;
  const cameraInitialPose = building.computeInitialCameraPose();

  const complex = new Complex();
  complex.buildings = [building];
  complex.uuid = generate_uuid();
  complex.url_base = url_base;
  complex.name = building.name;

  useStore.setState({
    complex: complex,
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
  const { complex } = useStore.getState();
  let yaml_text: string = complex.toYAMLString();
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
