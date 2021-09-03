import { EditorObject } from './EditorObject';
import { v4 as generate_uuid } from 'uuid';
import YAML from 'yaml';

export class Lane extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;
  graph_idx: number = 0;  // todo: parse this

  static fromYAML(data: any): Lane {
    let lane = new Lane();
    lane.object_type_name = 'Lane';
    lane.uuid = generate_uuid();
    lane.start_idx = data[0];
    lane.end_idx = data[1];
    if (data.length > 2) {
      lane.paramsFromYAML(data[2]);
    }
    return lane;
  }

  toYAML(): YAML.YAMLSeq {
    let node = new YAML.YAMLSeq();
    node.add(this.start_idx);
    node.add(this.end_idx);
    node.add(this.paramsToYAML());
    node.flow = true;
    return node;
  }

  addDefaultParams(): void {
    this.addParam('bidirectional', false, 4, false);
    this.addParam('graph_idx', 0, 2, false);
  }

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: look up vertices somehow
  }
}
