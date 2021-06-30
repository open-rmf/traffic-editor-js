import React from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { Vertex } from './Vertex';
import { Level } from './Level';
import {
  useStore,
  EditorToolID,
  repaintPropertyEditor,
  setSelection,
  updateVertexPoint,
} from './Store';

interface SceneVertexProps {
  vertex: Vertex,
  elevation: number,
  level: Level,
  level_uuid: string,
}

export function SceneVertex(props: SceneVertexProps): JSX.Element {
  const selection = useStore(state => state.selection);
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const isMoveToolActive = useStore(state => state.activeTool === EditorToolID.MOVE);
  const [ dragActive, setDragActive ] = React.useState(false);

  const [x, y] = props.level.transformPoint(props.vertex.x, props.vertex.y);

  let color = "rgb(0, 128, 0)";
  if (selection && selection.uuid === props.vertex.uuid) {
    color = "rgb(255, 100, 10)";
  }

  return (
    <group>
      <mesh
        position={[x, y, 0.25 + props.elevation]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        key={props.vertex.uuid}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          setSelection(setStore, props.vertex);
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
          repaintPropertyEditor(setStore);
        }}
        onPointerMove={(event) => {
          if (dragActive) {
            event.stopPropagation();
            if (editorMode === '2d') {
              const [px, py] = props.level.inverseTransformPoint(event.unprojectedPoint.x, event.unprojectedPoint.y);
              updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, px, py);
            }
            else {
              let intersection_point = new THREE.Vector3();
              event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
              const [px, py] = props.level.inverseTransformPoint(intersection_point.x, intersection_point.y);
              updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, px, py);
            }
          }
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text color="blue" position={[x, y, 0.36 + props.elevation]}>
        {props.vertex.name}
      </Text>
    </group>
  );
}
