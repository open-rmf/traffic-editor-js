import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import { MapControls } from '@react-three/drei'
import { Building, Level, Vertex, Wall } from './Building';
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
    // todo: consider troika-three-text for rendering the labels?
    return (
      <mesh
        position={[x, y, 0.25]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial color={'green'} />
      </mesh>
    );
  }

  const renderWall = (wall: Wall, vertices: Vertex[]): JSX.Element => {
    const v1 = vertices[wall.start_idx];
    const v2 = vertices[wall.end_idx];
    const cx = (v1.x + v2.x) / 2 / 50;
    const cy = (v1.y + v2.y) / 2 / 50;
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const len = Math.sqrt(dx*dx + dy*dy) / 50;
    const xyrot = Math.atan2(dy, dx);

    return (
      <mesh
        position={[cx, cy, 1.0]}
        rotation={new THREE.Euler(0, 0, xyrot)}
        scale={1.0}
      >
        <boxGeometry args={[len, 0.1, 2]} />
        <meshStandardMaterial color={'grey'} />
      </mesh>
    );
  }

  const renderLevel = (level: Level): JSX.Element[] => {
    const vertices = level.vertices.map((vertex) => renderVertex(vertex));
    const walls = level.walls.map((wall) => renderWall(wall, level.vertices));
    return [...vertices, ...walls];
  }

  const Controls = (): JSX.Element => {
    const camera = useThree(({ camera }) => camera);
    camera.up = new THREE.Vector3(0, 0, 1);
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
    return <MapControls enableDamping={false} camera={camera} />
  }

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [3, -10, 5] }}
    >
      <Controls />
      <axesHelper />
      <gridHelper
        args={[100, 20]}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        position={new THREE.Vector3(50, -50, 0)}/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {building.levels.map((level) => renderLevel(level))}
    </Canvas>
  )
}
