import create from 'zustand';
import produce from 'immer';
import * as THREE from 'three';
//import * as net from 'net';
import { v4 as generate_uuid } from 'uuid';
import YAML from 'yaml';
//import { EditorParam } from './EditorParam'
import { EditorObject } from './EditorObject';
import { Site } from './Site';
import { CoordinateSystem } from './CoordinateSystem';
import { Feature } from './Feature';
import { Level } from './Level';
import { Lane } from './Lane';
import { Vertex } from './Vertex';
import { ToolID } from './ToolID';
import mqtt from 'mqtt';
import { Sender } from './Parser';

export class EditorWall extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(data: any): EditorWall {
    let wall = new EditorWall();
    wall.object_type_name = 'Wall';
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

  addDefaultParams(): void {
    this.addParam('texture_name', 'default', 1, false);
  }

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
  }
}

export class EditorMeasurement extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;
  distance: number = 1;

  static fromYAML(data: any): EditorMeasurement {
    let measurement = new EditorMeasurement();
    measurement.object_type_name = 'Measurement'
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
  }
}

export class EditorDoor extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static fromYAML(data: any): EditorDoor {
    let door = new EditorDoor();
    door.object_type_name = 'Door';
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
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
  features: Feature[] = [];
  blob: Blob = new Blob([]);

  static fromLayerYAML(layer_name: string, data: any): EditorImage {
    //console.log(data);
    let image = new EditorImage();
    image.object_type_name = 'Image';
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
    image.features = data['features'].map((feature_yaml: any) => Feature.fromYAML(feature_yaml, [1.0, 1.0]));
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
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML([1.0, 1.0])) });
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
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
    model.object_type_name = 'Model';
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

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate somehow
  }
}

export interface CameraPose {
  position: THREE.Vector3,
  target: THREE.Vector3,
  zoom: number,
}

export interface RobotTelemetry {
  name: string,
  x: number,
  y: number,
  z: number,
  heading: number,
}

export interface StoreState {
  site: Site,
  selection: EditorObject | null,
  editorMode: string,
  enableMotionControls: boolean,
  activeTool: ToolID,
  activeMotionTool: ToolID,
  cameraInitialPose: CameraPose,
  cameraPose: CameraPose,
  propertyRepaintCount: number,
  repaintCount: number,
  disableEditorTools: boolean,
  activeUUID: string,
  set: (fn: (draftState: StoreState) => void) => void,
  mqtt_client: mqtt.MqttClient | null,
  mqtt_robot_telemetry: RobotTelemetry[],
  mapType: string,  // todo: enum
}

export const useStore = create<StoreState>(set => ({
  site: new Site(),
  selection: null,
  editorMode: '2d',
  enableMotionControls: true,
  activeTool: ToolID.SELECT,
  activeMotionTool: ToolID.NONE,
  propertyRepaintCount: 0,
  repaintCount: 0,
  disableEditorTools: false,
  activeUUID: '',
  cameraInitialPose: {
    position: new THREE.Vector3(0, 0, 100),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 18,
  },
  cameraPose: {
    position: new THREE.Vector3(0, 0, 100),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 18,
  },
  set: fn => set(produce(fn)),
  mqtt_client: null,
  mqtt_robot_telemetry: [],
  mapType: '',
}));

export type StoreSetter = (fn: (draftState: StoreState) => void) => void;

export function setSelection(selection: EditorObject, zoomTo: boolean = false) {
  useStore.setState({ selection: selection });

  if (zoomTo) {
    const [x, y] = selection.getCenterXY();
    const pose = {
      position: new THREE.Vector3(x, y, 100),
      target: new THREE.Vector3(x, y, 0),
      zoom: 18,
    };
    useStore.setState({ cameraInitialPose: pose });
  }
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

export function setActiveTool(newTool: ToolID) {
  useStore.setState({
    activeTool: newTool,
    activeUUID: ''
  });
}

export function setActiveMotionTool(newTool: ToolID) {
  useStore.setState({ activeMotionTool: newTool });
}

export function setActiveUUID(newUUID: string) {
  useStore.setState({ activeUUID: newUUID });
}

export function repaintPropertyEditor(setStore: StoreSetter) {
  setStore(state => {
    state.propertyRepaintCount += 1;
  });
}

export function disableEditorTools(disable: boolean) {
  let currentState = useStore.getState().disableEditorTools;
  if (currentState === disable)
    return; // nothing to do
  useStore.setState({ disableEditorTools: disable });
}

export function addVertex(x: number, y: number) {
  console.log(`addVertex(${x}, ${y})`);
  //
  //let site = useStore(state => state.site);
  let vertex = new Vertex();
  vertex.uuid = generate_uuid();
  vertex.x = x;
  vertex.y = y;
  vertex.addDefaultParams();

  let site = useStore.getState().site;

  if (site.levels.length === 0) {
    // add a default level
    let level = new Level();
    level.uuid = generate_uuid();
    level.coordinateSystem = site.coordinateSystem;
    level.name = 'default';
    level.scale = site.coordinateSystem === CoordinateSystem.Legacy ? 0.05 : 1;
    vertex.x *= level.scale;
    vertex.y *= level.scale;

    level.vertices = [vertex];

    site.levels = [level];
  }
  else {
    // todo: some way of defining the active level
    let level = site.levels[0];
    vertex.x *= level.scale;
    vertex.y *= level.scale;
    level.vertices = [...level.vertices, vertex];
  }

  useStore.setState({
    site: site,
    repaintCount: useStore.getState().repaintCount + 1,
  });
}

export function updateVertexPoint(
  setStore: StoreSetter,
  level_uuid: string,
  vertex_uuid: string,
  x: number,
  y: number) {
  setStore(state => {
    state.site.levels.map(level => {
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
    state.site.levels.map(level => {
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

export function updateFeaturePoint(
  setStore: StoreSetter,
  feature_level: Level,
  feature_uuid: string,
  x: number,
  y: number) {
  setStore(state => {
    state.site.levels.map(level => {
      if (level === feature_level) {
        level.features.map(feature => {
          if (feature.uuid === feature_uuid) {
            feature.x = x;
            feature.y = y;
          }
          return feature;
        })
      }
      return level;
    });
    state.repaintCount = state.repaintCount + 1;
  });
}

export function addLane(start_uuid: string, end_uuid: string, level_uuid: string) {
  console.log(`addLane(${start_uuid}, ${end_uuid})`);
  let site = useStore.getState().site;
  for (let level of site.levels) {
    if (level.uuid === level_uuid) {
      // look up the vertex indices
      // TODO: something cooler than this
      let start_idx = -1;
      let end_idx = -1;
      for (let i = 0; i < level.vertices.length; i++) {
        if (level.vertices[i].uuid === start_uuid) {
          start_idx = i;
        }
        if (level.vertices[i].uuid === end_uuid) {
          end_idx = i;
        }
      }
      if (start_idx < 0 || end_idx < 0) {
        return;
      }

      let lane = new Lane();
      lane.uuid = generate_uuid();
      lane.start_idx = start_idx;
      lane.end_idx = end_idx;
      lane.addDefaultParams();
      level.lanes = [...level.lanes, lane];
      break;
    }
  }

  useStore.setState({
    site: site,
    repaintCount: useStore.getState().repaintCount + 1,
  });
}

export function addWall(start_uuid: string, end_uuid: string, level_uuid: string) {
  console.log(`addWall(${start_uuid}, ${end_uuid})`);
  let site = useStore.getState().site;
  for (let level of site.levels) {
    if (level.uuid === level_uuid) {
      // look up the vertex indices
      // TODO: something cooler than this
      let start_idx = -1;
      let end_idx = -1;
      for (let i = 0; i < level.vertices.length; i++) {
        if (level.vertices[i].uuid === start_uuid) {
          start_idx = i;
        }
        if (level.vertices[i].uuid === end_uuid) {
          end_idx = i;
        }
      }
      if (start_idx < 0 || end_idx < 0) {
        return;
      }

      let wall = new EditorWall();
      wall.uuid = generate_uuid();
      wall.start_idx = start_idx;
      wall.end_idx = end_idx;
      wall.addDefaultParams();
      level.walls = [...level.walls, wall];
      break;
    }
  }

  useStore.setState({
    site: site,
    repaintCount: useStore.getState().repaintCount + 1,
  });
}

export async function saveStore() {
  const mapType = useStore.getState().mapType;
  if (mapType === 'local_file') {
    //setSnackMessage('Cannot save. Local file save not yet implemented.');
    //setSnackOpen(true);
    useStore.getState().site.save();
  }
  else if (mapType === 'local_rest') {
    try {
      await Sender('http://localhost:8000/map_file');
    } catch (error) {
      //setSnackMessage('Error while saving to local REST server');
      //setSnackOpen(true);
    }
  }
  else if (mapType === 'demo') {
    //setSnackMessage('Cannot save. Demo maps are read-only.');
    //setSnackOpen(true);
  }
  else {
    //setSnackMessage('Cannot save. No map loaded.');
    //setSnackOpen(true);
  }
}
