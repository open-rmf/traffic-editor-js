import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Vertex';
import { Level } from './Level';
import { useStore, EditorDoor, setSelection } from './Store';

interface SceneDoorProps {
  vertex_start: Vertex,
  vertex_end: Vertex,
  door: EditorDoor,
  level: Level,
  elevation: number,
}

export function SceneDoor(props: SceneDoorProps): JSX.Element {
  const selection = useStore(state => state.selection)

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const [cx, cy] = props.level.transformPoint((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
  const xyrot = Math.atan2(dy, dx);

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.1, 0.4, 0.4);
    if (selection && selection.uuid === props.door.uuid) {
      color.setRGB(1, 0.4, 0.1);
    }
    return color;
  }, [selection, props.door.uuid]);

  return (
    <mesh
      position={[cx, cy, 1.0 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.door.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.door);
      }}
    >
      <boxGeometry args={[len, 0.5, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
