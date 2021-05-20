import { EditorObject } from './EditorObject';

export class Param extends EditorObject {
  type_idx: number = 0;
  name: string = '';
  value: any = null;

  static fromYAML(param_name: string, param_data: any): Param {
    let p = new Param();
    p.name = param_name;
    p.type_idx = param_data[0];
    p.value = param_data[1];
    p.generate_uuid();
    return p;
  }
}

// useful helper in a few of our YAML parsing spots
export const ParamArrayFromYAML = (params_data: any | null) => {
  if (!params_data)
    return [];
  let params = [];
  for (const param_name in params_data) {
    const param = Param.fromYAML(param_name, params_data[param_name]);
    params.push(param);
  }
  return params;
}


