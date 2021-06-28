//import YAML from 'yaml'
import { v4 as generate_uuid } from 'uuid'

export class EditorParam {
  type_idx: number = 0;
  name: string = '';
  value: any = 0;
  uuid: string = '';

  static fromYAML(_name: string, data: any): EditorParam {
    let p = new EditorParam();
    p.name = _name;
    p.type_idx = data[0];
    p.value = data[1];
    p.uuid = generate_uuid();
    return p;
  }
}
