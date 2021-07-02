import { EditorObject } from './EditorObject';
import { EditorProp } from './EditorProp';
import YAML from 'yaml';
//import { v4 as generate_uuid } from 'uuid';

export class Feature extends EditorObject {
  name: string = '';
  x: number = 0;
  y: number = 0;

  static fromYAML(data: any): Feature {
    let feature = new Feature();
    feature.object_type_name = 'Feature';
    feature.uuid = data['id'];
    feature.name = data['name'];
    feature.x = data['x'];
    feature.y = -data['y'];

    feature.props.push(new EditorProp('name', () => feature.name));
    feature.props.push(new EditorProp('x', () => { return EditorObject.roundNicely(feature.x)} ));
    feature.props.push(new EditorProp('y', () => { return EditorObject.roundNicely(feature.y)} ));

    return feature;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    node.add({ key: 'id', value: this.uuid });
    node.add({ key: 'name', value: this.name });
    node.add({ key: 'x', value: this.x });
    node.add({ key: 'y', value: -this.y });
    node.flow = true;
    return node;
  }
}
