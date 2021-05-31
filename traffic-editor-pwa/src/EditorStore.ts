import create from 'zustand';

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

export interface EditorStoreState {
  building: EditorBuilding,
  selection: EditorObject | null,
  editorMode: string,
  setSelection: (newSelection: EditorObject) => void,
  clearSelection: () => void,
  setEditorMode: (newEditorMode: string) => void,

  enableMotionControls: boolean,
  setEnableMotionControls: (newEnableMotionControls: boolean) => void,

  activeTool: EditorToolID,
  setActiveTool: (newActiveTool: EditorToolID) => void,
}

export const useStore = create<EditorStoreState>(set => ({
  building: {
    name: '',
    levels: [],
    params: [],
    uuid: '',
  },
  selection: null,
  setSelection: (newSelection: EditorObject) => set(state => ({ selection: newSelection })),
  clearSelection: () => set(state => ({ selection: null })),

  editorMode: '2d',
  setEditorMode: (newEditorMode: string) => set(state => ({ editorMode: newEditorMode })),

  enableMotionControls: true,
  setEnableMotionControls: (newEnableMotionControls: boolean) => set(state => ({ enableMotionControls: newEnableMotionControls })),

  activeTool: EditorToolID.SELECT,
  setActiveTool: (newActiveTool: EditorToolID) => set(state => ({ activeTool: newActiveTool })),
}))
