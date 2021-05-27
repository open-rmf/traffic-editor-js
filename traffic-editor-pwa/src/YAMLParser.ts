import {
  useStore,
  EditorBuilding,
  EditorLevel,
  EditorParam,
  EditorVertex } from './EditorStore'
import YAML from 'yaml'
import { v4 as generate_uuid } from 'uuid'

function ParamArrayYAMLParser(params_data: any): EditorParam[] {
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
  return params;
}

function VertexYAMLParser(vertex_data: any): EditorVertex {
  let vertex = {
    x: vertex_data[0],
    y: -vertex_data[1],
    name: vertex_data[3],
    uuid: generate_uuid(),
    params: ParamArrayYAMLParser(vertex_data[4]),
  }
  return vertex;
}

function LevelYAMLParser(level_name: string, level_data: any): EditorLevel {
  let level = {
    name: level_name,
    elevation: level_data['elevation'],
    params: Array<EditorParam>(),
    vertices: Array<EditorVertex>(),
    uuid: generate_uuid()
  }
  for (const vertex_data of level_data['vertices']) {
    level.vertices.push(VertexYAMLParser(vertex_data));
  }
  return level
}

function BuildingYAMLParser(yaml_text: string): EditorBuilding {
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
    building.levels.push(LevelYAMLParser(level_name, level_data));
  }

  return building
}

export function YAMLParser(yaml_text: string): void {
  useStore.setState({
    building: BuildingYAMLParser(yaml_text),
    selection: null
  })
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
