import { v4 as generate_uuid } from 'uuid'

export class EditorProp {
  name: string = '';
  get_value: () => any = () => '';
  set_value: (_: any) => void = (v: any) => { };
  canModify: boolean = false;
  uuid: string = '';

  constructor(_name: string, _getter: () => any, _setter: ((v: any) => void) | undefined = undefined) {
    this.name = _name;
    this.get_value = _getter;
    this.uuid = generate_uuid();
    if (_setter !== undefined) {
      this.set_value = _setter;
      this.canModify = true;
    }
  }
}
