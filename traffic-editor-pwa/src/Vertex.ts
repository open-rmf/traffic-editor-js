import { EditorObject } from './EditorObject';
import { EditorProp } from './EditorProp';
import { v4 as generate_uuid } from 'uuid';
import YAML from 'yaml';

export class Vertex extends EditorObject {
  x: number = 0;
  y: number = 0;
  name: string = '';

  constructor() {
    super();
    this.props.push(
      new EditorProp(
        'name',
        () => this.name,
        (s: string) => { this.name = s; }));
    this.props.push(new EditorProp('x', () => { return EditorObject.roundNicely(this.x)} ));
    this.props.push(new EditorProp('y', () => { return EditorObject.roundNicely(this.y)} ));

    this.props.push(new EditorProp('lat', () => {
      const R = 6378137;
      const meters_north = R * Math.PI * (128 + this.y / 1000) / 128;
      //let lat = meters_north / R * 180 / Math.PI;
      const lat = 180 / Math.PI * (2 * Math.atan(Math.exp(meters_north / R)) - Math.PI / 2);
      return lat;
    }));

    this.props.push(new EditorProp('lon', () => {
      return ((this.x / 1000) - 128) / 128 * 180;
    }));

    // add a few "optional" params that we only save if non-empty:
    this.addParam<string>('spawn_robot_type', '', 1, true);
    this.addParam<string>('spawn_robot_name', '', 1, true);
  }

  static fromYAML(data: any, coord_scale: [number, number]): Vertex {
    let vertex = new Vertex();
    vertex.object_type_name = 'Vertex';
    vertex.uuid = generate_uuid();
    vertex.x = data[0] * coord_scale[0];
    vertex.y = data[1] * coord_scale[1];
    vertex.name = data[3];
    if (data.length > 4) {
      vertex.paramsFromYAML(data[4]);
    }

    return vertex;
  }

  toYAML(coord_scale: [number, number]): YAML.YAMLSeq {
    let node = new YAML.YAMLSeq();
    node.add(this.x / coord_scale[0]);
    node.add(this.y / coord_scale[1]);
    node.add(0.0);
    node.add(this.name);
    if (this.params.length) {
      node.add(this.paramsToYAML());
    }
    node.flow = true;
    return node;
  }

  addDefaultParams(): void {
    this.addParam('is_charger', false, 4, false);
    this.addParam('is_parking_spot', false, 4, false);
    this.addParam('is_holding_point', false, 4, false);
  }

  getCenterXY(): [number, number] {
    return [this.x, this.y];
  }
}
