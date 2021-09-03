import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { EditorProp } from './EditorProp';

export class Graph extends EditorObject {
  name: string = '';
  id: number = 0;
  default_lane_width: number = 0.5;

  constructor() {
    super();
    this.props.push(new EditorProp('name', () => this.name));
    this.props.push(new EditorProp('default lane width', () => this.default_lane_width));
  }

  static fromYAML(id: number, data: any): Graph {
    let graph = new Graph();
    graph.uuid = generate_uuid();
    graph.id = id;
    graph.name = data['name'];
    graph.default_lane_width = data['default_lane_width'];
    return graph
  }

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
  }
}
