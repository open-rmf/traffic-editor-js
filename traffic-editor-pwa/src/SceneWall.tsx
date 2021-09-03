import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Vertex';
import { Level } from './Level';
import { useStore, EditorWall, setSelection } from './Store';
import { CoordinateSystem } from './CoordinateSystem';

interface SceneWallProps {
  vertex_start: Vertex,
  vertex_end: Vertex,
  wall: EditorWall,
  level: Level,
  elevation: number,
}

export function SceneWall(props: SceneWallProps): JSX.Element {
  const selection = useStore(state => state.selection)

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const [cx, cy] = props.level.transformPoint((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
  const xyrot = Math.atan2(dy, dx);
  const coordinateSystem = useStore(state => state.site.coordinateSystem);
  const width = coordinateSystem === CoordinateSystem.Legacy ? 0.1 : 0.01;
  const height = 20 * width;

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.1, 0.1, 0.9);
    if (selection && selection.uuid === props.wall.uuid) {
      color.setRGB(1, 0.4, 0.1);
    }
    return color;
  }, [selection, props.wall.uuid]);

  return (
    <mesh
      position={[cx, cy, props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.wall.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.wall);
      }}
    >
      <boxGeometry args={[len, width, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
