import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Building';
import { useStore } from './BuildingStore';

type SceneVertexProps = {
  uuid: string;
}

/*
export function SceneVertex(props: SceneVertexProps): JSX.Element {
  console.log('SceneVertex uuid=' + props.uuid);
  const vertex = useStore(state => state.building.levels.find((level) => (level.uuid === props.uuid)));

  const building = useStore(state => state.building);
  const replaceBuilding = useStore(state => state.replace);
  const shape = React.useMemo(() => {
    console.log('creating shape');
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
    <mesh
      key={props.floor.uuid}
      onClick={(event) => {
        event.stopPropagation();
        console.log('floor onClick');
        building.selection = props.floor;
        replaceBuilding(building.shallowCopy());
      }}
    >
      <extrudeGeometry args={[shape, { 'depth': 0.1, 'bevelEnabled': false } ]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );

}
*/
