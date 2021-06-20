import create from 'zustand';
import produce from 'immer';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid'
import YAML from 'yaml'

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

export class EditorObject {
  uuid: string = '';
  params: EditorParam[] = [];

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
}

export class EditorVertex extends EditorObject {
  x: number = 0;
  y: number = 0;
  name: string = '';

  static fromYAML(data: any): EditorVertex {
    let vertex = new EditorVertex();
    vertex.uuid = generate_uuid();
    vertex.x = data[0];
    vertex.y = -data[1];
    vertex.name = data[3];
    vertex.paramsFromYAML(data[4]);

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
}

export class EditorWall extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(data: any): EditorWall {
    let wall = new EditorWall();
    wall.uuid = generate_uuid();
    wall.paramsFromYAML(data[2]);
    wall.start_idx = data[0];
    wall.end_idx = data[1];
    return wall;
  }

  toYAML(): YAML.YAMLSeq {
    let node = new YAML.YAMLSeq();
    node.add(this.start_idx);
    node.add(this.end_idx);
    node.add(this.paramsToYAML());
    node.flow = true;
    return node;
  }
}

export class EditorMeasurement extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;
  distance: number = 1;

  static fromYAML(data: any): EditorMeasurement {
    let measurement = new EditorMeasurement();
    measurement.uuid = generate_uuid();
    measurement.start_idx = data[0];
    measurement.end_idx = data[1];
    measurement.distance = data[2]['distance'][1];
    return measurement;
  }

  toYAML(): YAML.YAMLSeq {
    let node = new YAML.YAMLSeq();
    node.add(this.start_idx);
    node.add(this.end_idx);
    let params_yaml = this.paramsToYAML();
    params_yaml.add({ key: 'distance', value: [3, this.distance] });
    node.add(params_yaml);
    node.flow = true;
    return node;
  }
}

export class EditorLane extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(data: any): EditorLane {
    let lane = new EditorLane();
    lane.uuid = generate_uuid();
    lane.paramsFromYAML(data[2]);
    lane.start_idx = data[0];
    lane.end_idx = data[1];
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
}

export class EditorFloor extends EditorObject {
  vertex_indices: number[] = [];

  static fromYAML(data: any): EditorFloor {
    let floor = new EditorFloor();
    floor.uuid = generate_uuid();
    floor.paramsFromYAML(data['parameters']);
    floor.vertex_indices = data['vertices'].map((vertex_idx: number) => vertex_idx);
    return floor;
  }
}

export class EditorImage extends EditorObject {
  filename: string = '';
  offset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  yaw: number = 0;
  scale: number = 1;
  isLegacyDefaultImage: boolean = false;
}

export class EditorConstraint extends EditorObject {
  ids: string[] = [];

  static fromYAML(data: any): EditorConstraint {
    let constraint = new EditorConstraint();
    constraint.uuid = generate_uuid();
    constraint.ids = [ data['ids'][0], data['ids'][1] ];
    return constraint;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    node.add({ key: 'ids', value: this.ids });
    node.flow = true;
    return node;
  }
}

export class EditorFeature extends EditorObject {
  name: string = '';
  x: number = 0;
  y: number = 0;

  static fromYAML(data: any): EditorFeature {
    let feature = new EditorFeature();
    feature.uuid = data['id'];
    feature.name = data['name'];
    feature.x = data['x'];
    feature.y = data['y'];
    return feature;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    node.add({ key: 'id', value: this.uuid });
    node.add({ key: 'name', value: this.name });
    node.add({ key: 'x', value: this.x });
    node.add({ key: 'y', value: this.y });
    node.flow = true;
    return node;
  }
}

export class EditorLevel extends EditorObject {
  name: string = '';
  elevation: number = 0;
  vertices: EditorVertex[] = [];
  walls: EditorWall[] = [];
  measurements: EditorMeasurement[] = [];
  floors: EditorFloor[] = [];
  lanes: EditorLane[] = [];
  images: EditorImage[] = [];
  features: EditorFeature[] = [];
  constraints: EditorConstraint[] = [];

  static fromYAML(_name: string, data: any): EditorLevel {
    let level = new EditorLevel();
    level.uuid = generate_uuid();
    level.name = _name;
    level.elevation = data['elevation'];
    level.constraints = data['constraints'].map((constraint: any) => EditorConstraint.fromYAML(constraint));
    level.features = data['features'].map((feature: any) => EditorFeature.fromYAML(feature));
    level.floors = data['floors'].map((floor: any) => EditorFloor.fromYAML(floor));
    level.lanes = data['lanes'].map((lane: any) => EditorLane.fromYAML(lane));
    level.measurements = data['measurements'].map((measurement: any) => EditorMeasurement.fromYAML(measurement));
    level.vertices = data['vertices'].map((vertex: any) => EditorVertex.fromYAML(vertex));
    level.walls = data['walls'].map((wall: any) => EditorWall.fromYAML(wall));

    if (data['drawing'] && data['drawing']['filename']) {
      let image = new EditorImage();
      image.uuid = generate_uuid();
      image.filename = data['drawing']['filename'];
      image.isLegacyDefaultImage = true;
      level.images.push(image);
    }

    return level;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    if (this.images.length > 0 && this.images[0].isLegacyDefaultImage) {
      node.add({ key: 'drawing', value: { 'filename': this.images[0].filename } });
    }
    node.add({ key: 'constraints', value: this.constraints.map(constraint => constraint.toYAML()) });
    node.add({ key: 'elevation', value: this.elevation });
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML()) });
    node.add({ key: 'flattened_x_offset', value: 0 });
    node.add({ key: 'flattened_y_offset', value: 0 });
    node.add({ key: 'lanes', value: this.lanes.map(lane => lane.toYAML()) });
    node.add({ key: 'measurements', value: this.measurements.map(measurement => measurement.toYAML()) });
    node.add({ key: 'vertices', value: this.vertices.map(vertex => vertex.toYAML()) });
    node.add({ key: 'walls', value: this.walls.map(wall => wall.toYAML()) });
    return node;
  }
}

export class EditorBuilding extends EditorObject {
  name: string = '';
  levels: EditorLevel[] = [];

  static fromYAML(yaml_text: string): EditorBuilding {
    const yaml = YAML.parse(yaml_text);
    let building = new EditorBuilding();
    building.uuid = generate_uuid();
    building.name = yaml['name'];
    for (const level_name in yaml['levels']) {
      const level_data = yaml['levels'][level_name];
      building.levels.push(EditorLevel.fromYAML(level_name, level_data));
    }
    return building;
  }

  toYAMLString(): string {
    let yaml_doc = new YAML.Document(new YAML.YAMLMap());
    let levels_node = new YAML.YAMLMap();
    for (const level of this.levels) {
      levels_node.add({ key: level.name, value: level.toYAML() });
    }
    yaml_doc.add({ key: 'levels', value: levels_node });
    yaml_doc.add({ key: 'lifts', value: {} });
    yaml_doc.add({ key: 'name', value: this.name });
    return yaml_doc.toString({lineWidth: 0, minContentWidth: 0});
  }
}

export enum EditorToolID {
  SELECT,
  MOVE,
}

export interface CameraPose {
  position: THREE.Vector3,
  target: THREE.Vector3
}

export interface EditorStoreState {
  building: EditorBuilding,
  selection: EditorObject | null,
  editorMode: string,
  enableMotionControls: boolean,
  activeTool: EditorToolID,
  cameraInitialPose: CameraPose,
  repaintCount: number,
  set: (fn: (draftState: EditorStoreState) => void) => void
}
/*

  setSelection: (newSelection: EditorObject) => void,
  clearSelection: () => void,
  setEditorMode: (newEditorMode: string) => void,

  setEnableMotionControls: (newEnableMotionControls: boolean) => void,

  setActiveTool: (newActiveTool: EditorToolID) => void,

  //updateVertexPoint: (level_uuid: string, vertex_uuid: string, x: number, y:number) => void,
}
*/

export const useStore = create<EditorStoreState>(set => ({
  building: new EditorBuilding(),
  /*{
    name: '',
    levels: [],
    params: [],
    uuid: '',
  },
  */
  selection: null,
  editorMode: '2d',
  enableMotionControls: true,
  activeTool: EditorToolID.SELECT,
  repaintCount: 0,
  cameraInitialPose: {
    position: new THREE.Vector3(0, 0, 5),
    target: new THREE.Vector3(0, 0, 0),
  },
  set: fn => set(produce(fn)),
}));

type StoreSetter = (fn: (draftState: EditorStoreState) => void) => void;

export function setSelection(setStore: StoreSetter, newSelection: EditorObject) {
  setStore(state => {
    state.selection = newSelection;
  });
}

export function clearSelection(setStore: StoreSetter) {
  setStore(state => {
    state.selection = null;
  });
}

export function setEditorMode(setStore: StoreSetter, newMode: string) {
  setStore(state => {
    state.editorMode = newMode;
  });
}

export function setActiveTool(setStore: StoreSetter, newTool: EditorToolID) {
  setStore(state => {
    state.activeTool = newTool;
  });
}

export function updateVertexPoint(
  setStore: StoreSetter,
  level_uuid: string,
  vertex_uuid: string,
  x: number,
  y: number) {
  setStore(state => {
    state.building.levels.map(level => {
      if (level.uuid === level_uuid) {
        level.vertices.map(vertex => {
          if (vertex.uuid === vertex_uuid) {
            vertex.x = x;
            vertex.y = y;
            return vertex;
          }
          return vertex;
        })
        return level;
      }
      return level;
    });
    state.repaintCount = state.repaintCount + 1;
  });
}

/*
  const setStoreState = useStore(state => state.set);
  const setSelection = useStore(state => state.setSelection);
*/

/*
  setSelection: (newSelection: EditorObject) => set(state => ({ selection: newSelection })),
  clearSelection: () => set(state => ({ selection: null })),

  setEditorMode: (newEditorMode: string) => set(state => ({ editorMode: newEditorMode })),

  setEnableMotionControls: (newEnableMotionControls: boolean) => set(state => ({ enableMotionControls: newEnableMotionControls })),

  setActiveTool: (newActiveTool: EditorToolID) => set(state => ({ activeTool: newActiveTool })),

  //updateVertexPoint: (level_uuid: string, vertex_uuid: string, x: number, y:number) => set(state => {
}))
*/
