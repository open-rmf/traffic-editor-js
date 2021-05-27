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

export interface EditorLevel extends EditorObject {
  name: string,
  elevation: number,
  vertices: EditorVertex[],
}

export interface EditorBuilding extends EditorObject {
  name: string,
  levels: EditorLevel[],
}

export interface EditorStoreState {
  building: EditorBuilding,
  selection: EditorObject | null
}

export const useStore = create<EditorStoreState>(set => ({
  building: {
    name: '',
    levels: [],
    params: [],
    uuid: '',
  },
  selection: null
}))
