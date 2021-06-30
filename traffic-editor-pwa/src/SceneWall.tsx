import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Vertex';
import { useStore, EditorWall, setSelection } from './EditorStore';

interface SceneWallProps {
  vertex_start: Vertex,
  vertex_end: Vertex,
  wall: EditorWall,
  elevation: number,
}

export function SceneWall(props: SceneWallProps): JSX.Element {
  const selection = useStore(state => state.selection)
  //const setSelection = useStore(state => state.setSelection)
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
    let color = new THREE.Color(0.1, 0.1, 0.7);
    if (selection && selection.uuid === props.wall.uuid) {
      color.setRGB(1, 0.4, 0.1);
    }
    return color;
  }, [selection, props.wall.uuid]);

  return (
    <mesh
      position={[cx, cy, 1.0 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.wall.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(setStore, props.wall);
      }}
    >
      <boxGeometry args={[len, 0.1, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
