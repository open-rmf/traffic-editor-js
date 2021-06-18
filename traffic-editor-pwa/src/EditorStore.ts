import create from 'zustand';
import produce from 'immer';
import * as THREE from 'three';
import { v4 as generate_uuid } from 'uuid'
import YAML from 'yaml'

export interface EditorParam {
  type_idx: number,
  name: string,
  value: any,
  uuid: string
}

export class EditorObject {
  uuid: string = '';
  params: EditorParam[] = [];

  params_from_yaml(params_yaml: any): void {
    for (const param_name in params_yaml) {
      const param_data = params_yaml[param_name];
      let p: EditorParam = {
        name: param_name,
        type_idx: param_data[0],
        value: param_data[1],
        uuid: generate_uuid(),
      };
      this.params.push(p);
    }
  }
}

export class EditorVertex extends EditorObject {
  x: number = 0;
  y: number = 0;
  name: string = '';

  static from_yaml(data: any): EditorVertex {
    let vertex = new EditorVertex();
    vertex.uuid = generate_uuid();
    vertex.x = data[0];
    vertex.y = -data[1];
    vertex.name = data[3];
    vertex.params_from_yaml(data[4]);

    return vertex;
  }
}

export class EditorWall extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static from_yaml(data: any): EditorWall {
    let wall = new EditorWall();
    wall.uuid = generate_uuid();
    wall.params_from_yaml(data[2]);
    wall.start_idx = data[0];
    wall.end_idx = data[1];
    return wall;
  }
}

export interface EditorMeasurement extends EditorObject {
  start_idx: number,
  end_idx: number,
  distance: number,
}

export class EditorLane extends EditorObject {
  start_idx: number = -1;
  end_idx: number = -1;

  static from_yaml(data: any): EditorLane {
    let lane = new EditorLane();
    lane.uuid = generate_uuid();
    lane.params_from_yaml(data[2]);
    lane.start_idx = data[0];
    lane.end_idx = data[1];
    return lane;
  }
}

export class EditorFloor extends EditorObject {
  vertex_indices: number[] = [];

  static from_yaml(data: any): EditorFloor {
    let floor = new EditorFloor();
    floor.uuid = generate_uuid();
    floor.params_from_yaml(data['parameters']);
    floor.vertex_indices = data['vertices'].map((vertex_idx: number) => vertex_idx);
    return floor;
  }
}

export interface EditorImage extends EditorObject {
  filename: string,
  offset: THREE.Vector3,
  yaw: number,
  scale: number,
  isLegacyDefaultImage: boolean,
}

export class EditorConstraint extends EditorObject {
  ids: string[] = [];

  static from_yaml(data: any): EditorConstraint {
    let constraint = new EditorConstraint();
    constraint.uuid = generate_uuid();
    constraint.ids = [ data['ids'][0], data['ids'][1] ];
    return constraint;
  }
}

export interface EditorFeature extends EditorObject {
  name: string,
  x: number,
  y: number,
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

  static from_yaml(_name: string, data: any): EditorLevel {
    let level = new EditorLevel();
    level.uuid = generate_uuid();
    level.name = _name;
    level.elevation = data['elevation'];
    level.constraints = data['constraints'].map((constraint: any) => EditorConstraint.from_yaml(constraint));
    level.vertices = data['vertices'].map((vertex: any) => EditorVertex.from_yaml(vertex));
    level.lanes = data['lanes'].map((lane: any) => EditorLane.from_yaml(lane));
    level.floors = data['floors'].map((floor: any) => EditorFloor.from_yaml(floor));
    level.walls = data['walls'].map((wall: any) => EditorWall.from_yaml(wall));
    return level;
  }
}

export class EditorBuilding extends EditorObject {
  name: string = '';
  levels: EditorLevel[] = [];

  static from_yaml(yaml_text: string): EditorBuilding {
    const yaml = YAML.parse(yaml_text);
    let building = new EditorBuilding();
    building.uuid = generate_uuid();
    building.name = yaml['name'];
    for (const level_name in yaml['levels']) {
      const level_data = yaml['levels'][level_name];
      building.levels.push(EditorLevel.from_yaml(level_name, level_data));
    }
    return building;
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
