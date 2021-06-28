import create from 'zustand';
import produce from 'immer';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid'
import YAML from 'yaml'
//import { EditorParam } from './EditorParam'
import { EditorObject } from './EditorObject'
import { EditorBuilding } from './EditorBuilding'

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

export class EditorDoor extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(data: any): EditorDoor {
    let door = new EditorDoor();
    door.uuid = generate_uuid();
    door.paramsFromYAML(data[2]);
    door.start_idx = data[0];
    door.end_idx = data[1];
    return door;
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

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    node.add({ key: 'parameters', value: this.paramsToYAML() });

    let vertices_node = new YAML.YAMLSeq();
    for (const vertex_index of this.vertex_indices) {
      vertices_node.add(vertex_index);
    }
    vertices_node.flow = true;
    node.add({ key: 'vertices', value: vertices_node });
    return node;
  }
}

export class EditorImage extends EditorObject {
  name: string = '';
  filename: string = '';
  offset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  yaw: number = 0;
  scale: number = 1;
  isLegacyDefaultImage: boolean = false;
  color: number[] = [1, 1, 1, 1];
  visible: boolean = true;
  features: EditorFeature[] = [];
  blob: Blob = new Blob([]);

  static fromLayerYAML(layer_name: string, data: any): EditorImage {
    //console.log(data);
    let image = new EditorImage();
    image.uuid = generate_uuid();
    image.name = layer_name;
    image.filename = data['filename'];
    image.color = data['color'];
    image.offset.x = data['transform']['translation_x'];
    image.offset.y = data['transform']['translation_y'];
    image.scale = data['transform']['scale'];
    image.yaw = data['transform']['yaw'];
    image.isLegacyDefaultImage = false;
    image.visible = data['visible'];
    image.features = data['features'].map((feature_yaml: any) => EditorFeature.fromYAML(feature_yaml));
    return image;
  }

  toLayerYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    let color_node = new YAML.YAMLSeq();
    color_node.add(this.color[0]);
    color_node.add(this.color[1]);
    color_node.add(this.color[2]);
    color_node.add(this.color[3]);
    color_node.flow = true;
    node.add({ key: 'color', value: color_node });
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML()) });
    node.add({ key: 'filename', value: this.filename });
    let transform_node = new YAML.YAMLMap();
    transform_node.add({ key: 'scale', value: this.scale });
    transform_node.add({ key: 'translation_x', value: this.offset.x });
    transform_node.add({ key: 'translation_y', value: this.offset.y });
    transform_node.add({ key: 'yaw', value: this.yaw });
    node.add({ key: 'transform', value: transform_node });
    node.add({ key: 'visible', value: this.visible });
    return node;
  }

  loadBlob(_blob: Blob): void {
    this.blob = _blob;
    console.log(`image ${this.filename} retrieved ${this.blob.size} bytes`);
  }
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

export class EditorModel extends EditorObject {
  model_name: string = '';
  instance_name: string = '';
  is_static: boolean = true;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  yaw: number = 0;

  static fromYAML(data: any): EditorModel {
    let model = new EditorModel();
    model.uuid = generate_uuid();
    model.model_name = data['model_name'];
    model.instance_name = data['name'];
    model.is_static = data['static'];
    model.x = data['x'];
    model.y = -data['y'];
    model.yaw = data['yaw'];
    model.z = data['z'];
    return model;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();
    node.add({ key: 'model_name', value: this.model_name });
    node.add({ key: 'name', value: this.instance_name });
    node.add({ key: 'static', value: this.is_static });
    node.add({ key: 'x', value: this.x });
    node.add({ key: 'y', value: -this.y });
    node.add({ key: 'yaw', value: this.yaw });
    node.add({ key: 'z', value: this.z });
    node.flow = true;
    return node;
  }
}

export class EditorLevel extends EditorObject {
  name: string = '';
  elevation: number = 0;
  doors: EditorDoor[] = [];
  vertices: EditorVertex[] = [];
  walls: EditorWall[] = [];
  measurements: EditorMeasurement[] = [];
  floors: EditorFloor[] = [];
  lanes: EditorLane[] = [];
  models: EditorModel[] = [];
  images: EditorImage[] = [];
  features: EditorFeature[] = [];
  constraints: EditorConstraint[] = [];

  static fromYAML(_name: string, data: any): EditorLevel {
    let level = new EditorLevel();
    level.uuid = generate_uuid();
    level.name = _name;

    if (data['drawing'] && data['drawing']['filename']) {
      let image = new EditorImage();
      image.uuid = generate_uuid();
      image.filename = data['drawing']['filename'];
      image.isLegacyDefaultImage = true;
      level.images.push(image);
    }

    level.elevation = data['elevation'];
    level.constraints = data['constraints'].map((constraint: any) => EditorConstraint.fromYAML(constraint));
    level.doors = data['doors'].map((door: any) => EditorDoor.fromYAML(door));
    level.features = data['features'].map((feature: any) => EditorFeature.fromYAML(feature));
    level.floors = data['floors'].map((floor: any) => EditorFloor.fromYAML(floor));
    for (const layer_name in data['layers']) {
      level.images.push(EditorImage.fromLayerYAML(layer_name, data['layers'][layer_name]));
    }
    level.lanes = data['lanes'].map((lane: any) => EditorLane.fromYAML(lane));
    level.models = data['models'].map((model: any) => EditorModel.fromYAML(model));
    level.measurements = data['measurements'].map((measurement: any) => EditorMeasurement.fromYAML(measurement));
    level.vertices = data['vertices'].map((vertex: any) => EditorVertex.fromYAML(vertex));
    level.walls = data['walls'].map((wall: any) => EditorWall.fromYAML(wall));

    return level;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();

    node.add({ key: 'constraints', value: this.constraints.map(constraint => constraint.toYAML()) });
    node.add({ key: 'doors', value: this.doors.map(door => door.toYAML()) });

    if (this.images.length > 0 && this.images[0].isLegacyDefaultImage) {
      node.add({ key: 'drawing', value: { 'filename': this.images[0].filename } });
    }

    node.add({ key: 'elevation', value: this.elevation });
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML()) });
    node.add({ key: 'flattened_x_offset', value: 0 });
    node.add({ key: 'flattened_y_offset', value: 0 });
    node.add({ key: 'floors', value: this.floors.map(floor => floor.toYAML()) });
    node.add({ key: 'lanes', value: this.lanes.map(lane => lane.toYAML()) });

    let layers_node = new YAML.YAMLMap();
    for (const image of this.images) {
      if (!image.isLegacyDefaultImage) {
        layers_node.add({ key: image.name, value: image.toLayerYAML() });
      }
    }
    node.add({ key: 'layers', value: layers_node });
    node.add({ key: 'measurements', value: this.measurements.map(measurement => measurement.toYAML()) });
    node.add({ key: 'models', value: this.models.map(model => model.toYAML()) });
    node.add({ key: 'vertices', value: this.vertices.map(vertex => vertex.toYAML()) });
    node.add({ key: 'walls', value: this.walls.map(wall => wall.toYAML()) });
    return node;
  }

  /*
  async loadImages(url_base: string): Promise<boolean> {
    console.log('loading images for level ' + this.name);
    for (const image of this.images) {
      console.log(`loading image ${image.filename} from url_base ${url_base}`);
      await fetch(url_base + image.filename)
        .then(response => response.blob())
        .then(blob => image.loadBlob(blob));
    }
    return true;
  }
  */
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
          }
          return vertex;
        })
      }
      return level;
    });
    state.repaintCount = state.repaintCount + 1;
  });
}

export function updateModelPoint(
  setStore: StoreSetter,
  level_uuid: string,
  model_uuid: string,
  x: number,
  y: number) {
  setStore(state => {
    state.building.levels.map(level => {
      if (level.uuid === level_uuid) {
        level.models.map(model => {
          if (model.uuid === model_uuid) {
            model.x = x;
            model.y = y;
          }
          return model;
        })
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
