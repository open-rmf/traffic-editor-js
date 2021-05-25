import React from 'react'
import * as THREE from 'three'
import { Vertex, Floor } from './Building';

type SceneFloorProps = {
  floor: Floor;
  vertices: Vertex[];
  elevation: number;
}

export function SceneFloor(props: SceneFloorProps): JSX.Element {
  const shape = React.useMemo(() => {
    const shape = new THREE.Shape();
    let started = false;
    for (const vertex_idx of props.floor.vertex_indices) {
      const v = props.vertices[vertex_idx];
      if (!started)
      {
        shape.moveTo(v.x / 50, v.y / 50);
        started = true;
      }
      else
        shape.lineTo(v.x / 50, v.y / 50);
    }
    const v0 = props.vertices[props.floor.vertex_indices[0]];
    shape.lineTo(v0.x / 50, v0.y / 50);
    return shape;
  }, [props.floor, props.vertices]);

  return (
    <mesh key={props.floor.uuid}>
      <extrudeGeometry args={[shape, { 'depth': 0.1, 'bevelEnabled': false } ]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );

  /*
  return (
    <gridHelper
      args={[100, 100]}
      rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      position={new THREE.Vector3(50, -50, elevation)}/>
  );
   */
}



