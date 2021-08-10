import YAML from 'yaml'
import { EditorParam } from './EditorParam';
import { EditorProp } from './EditorProp';
import { v4 as generate_uuid } from 'uuid'

export class EditorObject {
  uuid: string = '';
  params: EditorParam[] = [];
  props: EditorProp[] = [];
  object_type_name: string = '';

  paramsFromYAML(params_yaml: any): void {
    for (const param_name in params_yaml) {
      this.params.push(EditorParam.fromYAML(param_name, params_yaml[param_name]));
    }
  }

  paramsToYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    for (const param of this.params) {
      let param_value_node = new YAML.YAMLSeq();
      param_value_node.add(param.type_idx);
      param_value_node.add(param.value);
      param_value_node.flow = true;
      node.add({ key: param.name, value: param_value_node });
    }
    node.flow = true;
    return node;
  }

  static roundNicely(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  getParam<Type>(name: string, defaultValue: Type): Type {
    for (const param of this.params) {
      if (param.name === name) {
        return param.value;
      }
    }
    return defaultValue;
  }

  addParam<Type>(name: string, value: Type, type_idx: number): void {
    let param = new EditorParam();
    param.uuid = generate_uuid();
    param.name = name;
    param.value = value;
    param.type_idx = type_idx;
    this.params = [...this.params, param];
  }
}
