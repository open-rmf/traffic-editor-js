import YAML from 'yaml'
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid'
import { EditorObject } from './EditorObject'
import { EditorLevel, CameraPose } from './EditorStore'

export class EditorBuilding extends EditorObject {
  name: string = '';
  url_base: string = '';
  levels: EditorLevel[] = [];
  yaml_doc: YAML.Document = new YAML.Document();;

  static fromYAML(yaml_text: string): EditorBuilding {
    const yaml = YAML.parse(yaml_text);
    let building = new EditorBuilding();
    building.uuid = generate_uuid();
    building.name = yaml['name'];
    for (const level_name in yaml['levels']) {
      const level_data = yaml['levels'][level_name];
      building.levels.push(EditorLevel.fromYAML(level_name, level_data));
    }
    building.yaml_doc = YAML.parseDocument(yaml_text);
    return building;
  }

  toYAMLString(): string {
    let yaml_doc = new YAML.Document(new YAML.YAMLMap());
    let levels_node = new YAML.YAMLMap();
    for (const level of this.levels) {
      levels_node.add({ key: level.name, value: level.toYAML() });
    }
    yaml_doc.add({ key: 'crowd_sim', value: this.yaml_doc.get('crowd_sim') });
    yaml_doc.add({ key: 'levels', value: levels_node });

    let lifts_node = new YAML.YAMLMap();
    // todo: add lifts to this map node
    // only use flow style to enforce whitespace similarity for empty maps
    lifts_node.flow = true;

    yaml_doc.add({ key: 'lifts', value: lifts_node });
    yaml_doc.add({ key: 'name', value: this.name });
    return yaml_doc.toString({lineWidth: 0, minContentWidth: 2});
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

  computeInitialCameraPose(): CameraPose {
    const bb: THREE.Box3 = this.computeBoundingBox();
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

  /*
  async loadImages(url_base: string): Promise<boolean> {
    for (const level of this.levels) {
      await level.loadImages(url_base);
    }
    return true;
  }
  */
}


