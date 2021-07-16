//import YAML from 'yaml';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { CameraPose } from './Store';
import { Building } from './Building';

export enum CoordinateSystem {
  Legacy,
  WGS84,
  WebMercator
}

export class Site extends EditorObject {
  name: string = '';
  url_base: string = '';
  buildings: Building[] = [];
  uuid: string = '';
  params = [];
  props = [];
  object_type_name = 'Site';
  coordinate_system: CoordinateSystem = CoordinateSystem.Legacy;

  static fromNewCommand(): Site {
    let site = new Site();
    site.uuid = generate_uuid();
    site.name = 'Unnamed Site';
    site.coordinate_system = CoordinateSystem.WebMercator;
    return site;
  }

  toYAMLString(): string {
    if (this.buildings.length) {
      return this.buildings[0].toYAMLString();
    }
    return '';
  }

  computeInitialCameraPose(): CameraPose {
    if (this.buildings.length) {
      return this.buildings[0].computeInitialCameraPose();
    }
    else {
      // todo: branch on coordinate system
      if (this.coordinate_system === CoordinateSystem.Legacy) {
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
