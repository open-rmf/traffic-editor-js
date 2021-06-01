import create from 'zustand';
import produce from 'immer';
import * as THREE from 'three';

export interface EditorParam {
  type_idx: number,
  name: string,
  value: any,
  uuid: string
}

export interface EditorObject {
  uuid: string,
  params: EditorParam[],
}

export interface EditorVertex extends EditorObject {
  x: number,
  y: number,
  name: string,
}

export interface EditorWall extends EditorObject {
  start_idx: number,
  end_idx: number,
}

export interface EditorLane extends EditorObject {
  start_idx: number,
  end_idx: number,
}

export interface EditorFloor extends EditorObject {
  vertex_indices: number[],
}

export interface EditorLevel extends EditorObject {
  name: string,
  elevation: number,
  vertices: EditorVertex[],
  walls: EditorWall[],
  floors: EditorFloor[],
  lanes: EditorLane[],
}

export interface EditorBuilding extends EditorObject {
  name: string,
  levels: EditorLevel[],
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
  building: {
    name: '',
    levels: [],
    params: [],
    uuid: '',
  },
  selection: null,
  editorMode: '2d',
  enableMotionControls: true,
  activeTool: EditorToolID.SELECT,
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
    })
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
