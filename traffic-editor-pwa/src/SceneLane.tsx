import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Vertex';
import { Level } from './Level';
import { useStore, EditorLane, setSelection } from './Store';

interface SceneLaneProps {
  vertex_start: Vertex,
  vertex_end: Vertex,
  lane: EditorLane,
  level: Level,
  elevation: number,
}

export function SceneLane(props: SceneLaneProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setStore = useStore(state => state.set);

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const [cx, cy] = props.level.transformPoint((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
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
        setSelection(setStore, props.lane);
      }}
    >
      <boxGeometry args={[len, 1.0, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
//<meshStandardMaterial color={color} transparent={true} opacity={0.7} />
