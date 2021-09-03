import React from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { Feature } from './Feature';
import { Level } from './Level';
import {
  useStore,
  repaintPropertyEditor,
  setSelection,
  updateFeaturePoint,
} from './Store';
import { ToolID } from './ToolID';

interface SceneFeatureProps {
  feature: Feature,
  elevation: number,
  level: Level,
}

export function SceneFeature(props: SceneFeatureProps): JSX.Element {
  const selection = useStore(state => state.selection);
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const isMoveToolActive = useStore(state => state.activeTool === ToolID.MOVE);
  const [ dragActive, setDragActive ] = React.useState(false);

  const [x, y] = props.level.transformPoint(props.feature.x, props.feature.y);

  let color = "rgb(200, 200, 0)";
  if (selection && selection.uuid === props.feature.uuid) {
    color = "rgb(255, 100, 10)";
  }

  return (
    <group>
      <mesh
        position={[x, y, 0.25 + props.elevation]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        key={props.feature.uuid}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          setSelection(props.feature);
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
              updateFeaturePoint(setStore, props.level, props.feature.uuid, px, py);
            }
            else {
              let intersection_point = new THREE.Vector3();
              event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
              const [px, py] = props.level.inverseTransformPoint(intersection_point.x, intersection_point.y);
              updateFeaturePoint(setStore, props.level, props.feature.uuid, px, py);
            }
          }
        }}
      >
        <cylinderGeometry args={[0.05, 0.15, 0.4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text color="blue" position={[x, y, 0.36 + props.elevation]}>
        {props.feature.name}
      </Text>
    </group>
  );
}
