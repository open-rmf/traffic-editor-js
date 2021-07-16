import React from 'react'
import * as THREE from 'three'
import { Level } from './Level';
import { useStore, EditorModel, setSelection, updateModelPoint } from './Store';
import { ToolID } from './ToolID';

interface SceneModelProps {
  model: EditorModel,
  elevation: number,
  level: Level,
  level_uuid: string,
}

export function SceneModel(props: SceneModelProps): JSX.Element {
  const selection = useStore(state => state.selection);
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const isMoveToolActive = useStore(state => state.activeTool === ToolID.MOVE);
  const [ dragActive, setDragActive ] = React.useState(false);

  const [x, y] = props.level.transformPoint(props.model.x, props.model.y);

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
            const [px, py] = props.level.inverseTransformPoint(event.unprojectedPoint.x, event.unprojectedPoint.y);
            updateModelPoint(setStore, props.level_uuid, props.model.uuid, px, py);
          }
          else {
            let intersection_point = new THREE.Vector3();
            event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
            const [px, py] = props.level.inverseTransformPoint(intersection_point.x, intersection_point.y);
            updateModelPoint(setStore, props.level_uuid, props.model.uuid, px, py);
          }
        }
      }}
    >
      <boxGeometry args={[0.4, 0.4, 0.4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
