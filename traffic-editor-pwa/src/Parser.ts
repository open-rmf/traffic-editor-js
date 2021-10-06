import { useStore } from './Store';
import { Site } from './Site';
import YAML from 'yaml';


export async function Parser(blob: Blob, url_base: string): Promise<Site> {
  let site = null;
  const beginning: string = await blob.slice(0, 15).text();
  if (beginning === 'SQLite format 3') {
    console.log('parsing GPKG');
    site = Site.fromGPKG(blob);
  }
  else {
    console.log('parsing YAML');
    const text = await blob.text();
    site = Site.fromYAML(text);
  }
  site.url_base = url_base;
  const cameraInitialPose = site.computeInitialCameraPose();

  useStore.setState({
    site: site,
    selection: null,
    cameraInitialPose: cameraInitialPose
  });

  return site;
}

export async function Retriever(url_base: string, resource_name: string): Promise<void> {
  await fetch(url_base + resource_name)
    .then(response => response.blob())
    .then(blob => Parser(blob, url_base))
}

export async function RetrieveDemo(name: string): Promise<void> {
  await Retriever(
    process.env.PUBLIC_URL + `/demos/${name}/`,
    `${name}.building.yaml`);
}

export async function Sender(url: string): Promise<void> {
  Object.getPrototypeOf(YAML.YAMLMap).maxFlowStringSingleLineLength = 10000;
  const { site } = useStore.getState();
  let yaml_text: string = site.toYAMLString();
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
