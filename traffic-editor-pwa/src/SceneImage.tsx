import React from 'react'
import * as THREE from 'three'
import { useStore, EditorImage, setSelection } from './EditorStore';

type SceneImageProps = {
}

export function SceneImage(props: SceneImageProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setStore = useStore(state => state.set);

  return (
    <div>
    </div>
  );
}
