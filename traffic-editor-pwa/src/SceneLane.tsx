import React from 'react'
import * as THREE from 'three'
import { useStore, EditorVertex, EditorLane } from './EditorStore';

interface SceneLaneProps {
  vertex_start: EditorVertex,
  vertex_end: EditorVertex,
  lane: EditorLane,
  elevation: number,
}

export function SceneLane(props: SceneLaneProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setSelection = useStore(state => state.setSelection)

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const cx = (v1.x + v2.x) / 2 / 50;
  const cy = (v1.y + v2.y) / 2 / 50;
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) / 50;
  const xyrot = Math.atan2(dy, dx);

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.4, 0.05, 0.05);
    if (selection && selection.uuid === props.lane.uuid) {
      color.setRGB(0.8, 0.3, 0.01);
    }
    return color;
  }, [selection, props.lane.uuid]);

  return (
    <mesh
      position={[cx, cy, 0.2 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.lane.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.lane);
      }}
    >
      <boxGeometry args={[len, 1.0, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
