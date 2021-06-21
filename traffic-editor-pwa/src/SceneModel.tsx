import React from 'react'
import * as THREE from 'three'
import { useStore, EditorModel, EditorToolID, setSelection, updateModelPoint } from './EditorStore';

interface SceneModelProps {
  model: EditorModel,
  elevation: number,
  level_uuid: string,
}

export function SceneModel(props: SceneModelProps): JSX.Element {
  const selection = useStore(state => state.selection);
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const isMoveToolActive = useStore(state => state.activeTool === EditorToolID.MOVE);
  const [ dragActive, setDragActive ] = React.useState(false);

  const x = props.model.x / 50.0;
  const y = props.model.y / 50.0;

  let color = "rgb(128, 128, 128)";
  if (selection && selection.uuid === props.model.uuid) {
    color = "rgb(255, 100, 10)";
  }

  return (
    <mesh
      position={[x, y, 0.25 + props.elevation]}
      scale={1.0}
      rotation={new THREE.Euler(Math.PI / 2, props.model.yaw, 0)}
      key={props.model.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(setStore, props.model);
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
          if (editorMode === '2d') {
            const px = event.unprojectedPoint.x * 50;
            const py = event.unprojectedPoint.y * 50;
            updateModelPoint(setStore, props.level_uuid, props.model.uuid, px, py);
          }
          else {
            let intersection_point = new THREE.Vector3();
            event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
            updateModelPoint(setStore, props.level_uuid, props.model.uuid, intersection_point.x * 50, intersection_point.y * 50);
          }
        }
      }}
    >
      <boxGeometry args={[0.4, 0.4, 0.4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
