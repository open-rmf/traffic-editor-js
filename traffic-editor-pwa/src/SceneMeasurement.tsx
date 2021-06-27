import React from 'react'
import * as THREE from 'three'
import { useStore, EditorVertex, EditorMeasurement, setSelection } from './EditorStore';

interface SceneMeasurementProps {
  vertex_start: EditorVertex,
  vertex_end: EditorVertex,
  measurement: EditorMeasurement,
  elevation: number,
}

export function SceneMeasurement(props: SceneMeasurementProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setStore = useStore(state => state.set);

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const cx = (v1.x + v2.x) / 2 / 50;
  const cy = (v1.y + v2.y) / 2 / 50;
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) / 50;
  const xyrot = Math.atan2(dy, dx);

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.6, 0.1, 0.6);
    if (selection && selection.uuid === props.measurement.uuid) {
      color.setRGB(0.8, 0.3, 0.01);
    }
    return color;
  }, [selection, props.measurement.uuid]);

  return (
    <mesh
      position={[cx, cy, 0.2 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.measurement.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(setStore, props.measurement);
      }}
    >
      <boxGeometry args={[len, 0.5, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
