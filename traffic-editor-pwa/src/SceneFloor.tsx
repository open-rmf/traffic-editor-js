import React from 'react';
import * as THREE from 'three';
import { Vertex } from './Vertex';
import { Level } from './Level';
import { useStore, EditorFloor, setSelection } from './Store';

type SceneFloorProps = {
  floor: EditorFloor;
  level: Level;
  vertices: Vertex[];
  elevation: number;
}

export function SceneFloor(props: SceneFloorProps): JSX.Element {
  const selection = useStore(state => state.selection)

  const shape = React.useMemo(() => {
    const shape = new THREE.Shape();
    let started = false;

    for (const v of props.vertices) {
      const [t_x, t_y] = props.level.transformPoint(v.x, v.y);
      if (!started)
      {
        shape.moveTo(t_x, t_y);
        started = true;
      }
      else
        shape.lineTo(t_x, t_y);
    }
    const [v0_x, v0_y] = props.level.transformPoint(props.vertices[0].x, props.vertices[0].y);
    shape.lineTo(v0_x, v0_y);
    return shape;
  }, [props.vertices, props.level])

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(1, 1, 1);
    if (selection && selection.uuid === props.floor.uuid) {
      color.setRGB(1, 0.4, 0.1);
    }
    return color;
  }, [selection, props.floor.uuid]);

  return (
    <mesh
      key={props.floor.uuid}
      position={[0, 0, -0.1]}
      onClick={(event) => {
        event.stopPropagation()
        console.log('floor onClick')
        setSelection(props.floor)
      }}
    >
      <extrudeGeometry args={[shape, { 'depth': 0.1, 'bevelEnabled': false } ]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );

  /*
      <meshStandardMaterial color={color} transparent={true} opacity={0.5} />
  return (
    <gridHelper
      args={[100, 100]}
      rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      position={new THREE.Vector3(50, -50, elevation)}/>
  );
   */
}
