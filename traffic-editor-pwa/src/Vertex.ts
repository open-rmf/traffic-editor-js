import { EditorObject } from './EditorObject';
import { EditorProp } from './EditorProp';
import { v4 as generate_uuid } from 'uuid';
import YAML from 'yaml';

export class Vertex extends EditorObject {
  x: number = 0;
  y: number = 0;
  name: string = '';

  static fromYAML(data: any): Vertex {
    let vertex = new Vertex();
    vertex.object_type_name = 'Vertex';
    vertex.uuid = generate_uuid();
    vertex.x = data[0];
    vertex.y = -data[1];
    vertex.name = data[3];
    vertex.paramsFromYAML(data[4]);

    vertex.props.push(new EditorProp('name', () => vertex.name));
    vertex.props.push(new EditorProp('x', () => { return Vertex.roundNicely(vertex.x)} ));
    vertex.props.push(new EditorProp('y', () => { return Vertex.roundNicely(vertex.y)} ));

    return vertex;
  }

  toYAML(): YAML.YAMLSeq {
    let node = new YAML.YAMLSeq();
    node.add(this.x);
    node.add(-this.y);
    node.add(0.0);
    node.add(this.name);
    if (this.params.length)
      node.add(this.paramsToYAML());
    node.flow = true;
    return node;
  }

  static roundNicely(value: number): number {
    return Math.round(value * 1000) / 1000;
  }
}
