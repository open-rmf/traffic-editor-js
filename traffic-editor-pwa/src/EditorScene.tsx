import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import { MapControls } from '@react-three/drei'
import { Building, Level, Vertex } from './Building';
import { BuildingContext } from './BuildingContext';

function Box(props: JSX.IntrinsicElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.0 : 0.5}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function EditorScene(): JSX.Element {
  const building = React.useContext<Building>(BuildingContext);

  const renderVertex = (vertex: Vertex): JSX.Element => {
    const x = vertex.x / 50.0;
    const y = vertex.y / 50.0;
    return (
      <Box position={[x, 0, y]} />
    );
  }

  const renderLevel = (level: Level): JSX.Element[] => {
    return level.vertices.map((vertex) => renderVertex(vertex));
  }

  const camera = useThree((state) => state.camera);

  return (
    <Canvas frameloop="demand">
      <axesHelper />
      <gridHelper args={[100, 20]}/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <MapControls enableDamping={false} />
      {building.levels.map((level) => renderLevel(level))}
    </Canvas>
  )
}

/*
<Box position={[-1.2, 0, 0]} />
<Box position={[1.2, 0, 0]} />
 */
