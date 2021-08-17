import YAML from 'yaml';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { CameraPose } from './Store';
import { Level } from './Level';
import {
  CoordinateSystem,
  CoordinateSystemFromString,
  CoordinateSystemToString
} from './CoordinateSystem';

export class Site extends EditorObject {
  name: string = '';
  filename: string = '';
  url_base: string = '';
  levels: Level[] = [];
  reference_level_name: string = '';
  uuid: string = '';
  params = [];
  props = [];
  object_type_name = 'Site';
  coordinateSystem: CoordinateSystem = CoordinateSystem.Legacy;
  yaml_doc: YAML.Document = new YAML.Document();
  save: () => void = () => {};

  constructor() {
    super();
    this.addParam<string>('crs', '', 1, true);
    this.addParam<string>('origin_vertex', '', 1, true);
  }

  static fromNewCommand(): Site {
    let site = new Site();
    site.uuid = generate_uuid();
    site.name = 'Unnamed Site';
    site.coordinateSystem = CoordinateSystem.WebMercator;
    return site;
  }

  static fromYAML(yaml_text: string): Site {
    const yaml = YAML.parse(yaml_text);
    let site = new Site();
    site.uuid = generate_uuid();
    site.name = yaml['name'];
    if (yaml['params']) {
      site.paramsFromYAML(yaml['params']);
    }

    if (yaml['coordinate_system']) {
      site.coordinateSystem = CoordinateSystemFromString(yaml['coordinate_system']);
    }
    for (const level_name in yaml['levels']) {
      const level_data = yaml['levels'][level_name];
      site.levels.push(Level.fromYAML(level_name, level_data, site.coordinateSystem));
    }
    if (yaml['reference_level_name']) {
      site.reference_level_name = yaml['reference_level_name'];
    }
    else {
      if (site.levels.length > 0) {
        site.reference_level_name = site.levels[0].name;
      }
    }
    site.yaml_doc = YAML.parseDocument(yaml_text);
    return site;
  }

  toYAMLString(): string {
    let yaml_doc = new YAML.Document(new YAML.YAMLMap());
    let levels_node = new YAML.YAMLMap();
    for (const level of this.levels) {
      levels_node.add({ key: level.name, value: level.toYAML() });
    }
    yaml_doc.add({ key: 'coordinate_system', value: CoordinateSystemToString(this.coordinateSystem) });
    yaml_doc.add({ key: 'crowd_sim', value: this.yaml_doc.get('crowd_sim') });
    yaml_doc.add({ key: 'levels', value: levels_node });

    let lifts_node = new YAML.YAMLMap();
    // todo: add lifts to this map node
    // only use flow style to enforce whitespace similarity for empty maps
    lifts_node.flow = true;

    yaml_doc.add({ key: 'lifts', value: lifts_node });
    yaml_doc.add({ key: 'name', value: this.name });

    yaml_doc.add({ key: 'params', value: this.paramsToYAML() });

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
    if (this.levels.length) {
      const bb = this.computeBoundingBox();
      const cx = (bb.min.x + bb.max.x) / 2;
      const cy = (bb.min.y + bb.max.y) / 2;
      const [t_cx, t_cy] = this.levels[0].transformPoint(cx, cy);
      const target = new THREE.Vector3(t_cx, t_cy, 0);
      const position = new THREE.Vector3(
        target.x + 10,
        target.y - 10,
        target.z + 10);
      return {
        position: position,
        target: target,
        zoom: 20,
      };
    }
    else {
      if (this.coordinateSystem === CoordinateSystem.Legacy) {
        return {
          position: new THREE.Vector3(10, 10, 10),
          target: new THREE.Vector3(0, 0, 0),
          zoom: 20,
        };
      }
      else {
        // center on singapore
        return {
          position: new THREE.Vector3(201830, -127030, 10),
          target: new THREE.Vector3(201830, -127030, 0),
          zoom: 5,
        };
      }
    }
  }
}
