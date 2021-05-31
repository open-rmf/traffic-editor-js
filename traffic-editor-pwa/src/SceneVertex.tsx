import React from 'react'
import * as THREE from 'three'
import { useStore, EditorVertex } from './EditorStore';

interface SceneVertexProps {
  vertex: EditorVertex,
  elevation: number,
}

export function SceneVertex(props: SceneVertexProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setSelection = useStore(state => state.setSelection)

  const x = props.vertex.x / 50.0;
  const y = props.vertex.y / 50.0;

  let color = "rgb(0, 128, 0)";
  if (selection && selection.uuid === props.vertex.uuid) {
    color = "rgb(255, 100, 10)";
  }

  return (
    <mesh
      position={[x, y, 0.25 + props.elevation]}
      scale={1.0}
      rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      key={props.vertex.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.vertex);
      }}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
