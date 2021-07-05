//import YAML from 'yaml';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { CameraPose } from './Store';
import { Building } from './Building';

export enum CoordinateSystem {
  Legacy,
  WGS84
}

export class Complex extends EditorObject {
  name: string = '';
  url_base: string = '';
  buildings: Building[] = [];
  uuid: string = '';
  params = [];
  props = [];
  object_type_name = 'Complex';
  coordinate_system: CoordinateSystem = CoordinateSystem.Legacy;

  static fromNewCommand(): Complex {
    let complex = new Complex();
    complex.uuid = generate_uuid();
    complex.name = 'Unnamed Complex';
    complex.coordinate_system = CoordinateSystem.WGS84;
    return complex;
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
      return {
        position: new THREE.Vector3(10, 10, 10),
        target: new THREE.Vector3(0, 0, 0),
      };
    }
  }
}
