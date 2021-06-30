import { v4 as generate_uuid } from 'uuid'

export class EditorProp {
  name: string = '';
  get_value: () => any = () => '';
  set_value: (_: any) => void = (v: any) => { };
  uuid: string = '';

  constructor(_name: string, _getter: () => any) {
    this.name = _name;
    this.get_value = _getter;
    this.uuid = generate_uuid();
  }
}
