import YAML from 'yaml';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { CameraPose } from './Store';
import { Building } from './Building';

export class Complex extends EditorObject {
  name: string = '';
  url_base: string = '';
  buildings: Building[] = [];
  uuid: string = '';
  params = [];
  props = [];
  object_type_name = 'Complex';

  toYAMLString(): string {
    if (this.buildings.length) {
      return this.buildings[0].toYAMLString();
    }
    return '';
  }
}
