import React from 'react'
import * as THREE from 'three'
import { useStore, EditorVertex, EditorToolID, setSelection, updateVertexPoint } from './EditorStore';

interface SceneVertexProps {
  vertex: EditorVertex,
  elevation: number,
  level_uuid: string,
}

export function SceneVertex(props: SceneVertexProps): JSX.Element {
  const selection = useStore(state => state.selection);
  //const setSelection = useStore(state => state.setSelection);
  const setStore = useStore(state => state.set);
  const isMoveToolActive = useStore(state => state.activeTool === EditorToolID.MOVE);
  const [ dragActive, setDragActive ] = React.useState(false);

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
        setSelection(setStore, props.vertex);
      }}
      onPointerDown={(event) => {
        if (!isMoveToolActive)
          return;
        event.stopPropagation();
        setDragActive(true);
        if (event.target) {
          (event.target as HTMLElement).setPointerCapture(event.pointerId);
        }
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        setDragActive(false);
        if (event.target) {
          (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        }
      }}
      onPointerMove={(event) => {
        if (dragActive) {
          event.stopPropagation();
          //onDrag(event.unprojectedPoint);
          const px = event.unprojectedPoint.x * 50;
          const py = event.unprojectedPoint.y * 50;
          //const pz = event.unprojectedPoint.z;
          updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, px, py);
          //console.log(`onPointerMove uuid=${props.vertex.uuid} point=[${px}, ${py}, ${pz}]`);
        }
      }}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
