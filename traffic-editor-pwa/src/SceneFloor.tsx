import React from 'react'
import * as THREE from 'three'
import { useStore, EditorVertex, EditorFloor, setSelection } from './EditorStore';

type SceneFloorProps = {
  floor: EditorFloor;
  vertices: EditorVertex[];
  elevation: number;
}

export function SceneFloor(props: SceneFloorProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setStore = useStore(state => state.set);
  //const setSelection = useStore(state => state.setSelection)

  const shape = React.useMemo(() => {
    const shape = new THREE.Shape();
    let started = false;

    for (const v of props.vertices) {
      if (!started)
      {
        shape.moveTo(v.x / 50, v.y / 50)
        started = true
      }
      else
        shape.lineTo(v.x / 50, v.y / 50)
    }
    const v0 = props.vertices[0]
    shape.lineTo(v0.x / 50, v0.y / 50)
    return shape
  }, [props.vertices])

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
      onClick={(event) => {
        event.stopPropagation()
        console.log('floor onClick')
        setSelection(setStore, props.floor)
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
