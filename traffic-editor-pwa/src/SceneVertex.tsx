import React from 'react'
import * as THREE from 'three'
import { EditorVertex } from './EditorStore';

interface SceneVertexProps {
  vertex: EditorVertex,
  elevation: number,
}

export function SceneVertex(props: SceneVertexProps): JSX.Element {
  //console.log('SceneVertex uuid=' + props.vertex.uuid);

  const x = props.vertex.x / 50.0;
  const y = props.vertex.y / 50.0;
  let color = "rgb(0, 128, 0)";
  /*
  if (building.selection && building.selection.uuid === vertex.uuid) {
    color = "rgb(255, 100, 10)";
  }
  */

  return (
    <mesh
      position={[x, y, 0.25 + props.elevation]}
      scale={1.0}
      rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      key={props.vertex.uuid}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );


  //const vertex = useStore(state => state.building.levels.find((level) => (level.uuid === props.uuid)));

  /*
      onClick={(event) => {
        event.stopPropagation();
        console.log('vertex onClick');
        building.selection = vertex;
        replaceBuilding(building.shallowCopy());
      }}
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
  */
}
