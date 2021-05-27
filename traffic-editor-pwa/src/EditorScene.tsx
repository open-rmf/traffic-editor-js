import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
//import React, { useRef, useState } from 'react'
import React from 'react'
import { MapControls, OrbitControls } from '@react-three/drei'
//import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'

//import { Lane, Level, Vertex, Wall } from './Building';
//import { BuildingContext } from './BuildingContext';
import { useStore } from './EditorStore';
import { SceneLevel } from './SceneLevel';

type EditorSceneProps = {
  mode: string;
};

export function EditorScene(props: EditorSceneProps): JSX.Element {
  //const { building, updateBuilding } = React.useContext(BuildingContext);
  //const building = useStore(state => state.building);
  //const replaceBuilding = useStore(state => state.replace);
  const building = useStore(state => state.building)
  //const selection = useStore(state => state.selection)

  /*
  const renderVertex = (vertex: Vertex, elevation: number): JSX.Element => {
    const x = vertex.x / 50.0;
    const y = vertex.y / 50.0;
    // todo: consider troika-three-text for rendering the labels?
    let color = "rgb(0, 128, 0)";
    if (building.selection && building.selection.uuid === vertex.uuid) {
      color = "rgb(255, 100, 10)";
    }
    return (
      <mesh
        position={[x, y, 0.25 + elevation]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        key={vertex.uuid}
        onClick={(event) => {
          event.stopPropagation();
          console.log('vertex onClick');
          building.selection = vertex;
          replaceBuilding(building.shallowCopy());
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  const renderWall = (wall: Wall, vertices: Vertex[], elevation: number): JSX.Element => {
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
        position={[cx, cy, 1.0 + elevation]}
        rotation={new THREE.Euler(0, 0, xyrot)}
        scale={1.0}
        key={wall.uuid}
      >
        <boxGeometry args={[len, 0.1, 2]} />
        <meshStandardMaterial color={'#8080d0'} />
      </mesh>
    );
  }

  const renderLane = (lane: Lane, vertices: Vertex[], elevation: number): JSX.Element => {
    const v1 = vertices[lane.start_idx];
    const v2 = vertices[lane.end_idx];
    const cx = (v1.x + v2.x) / 2 / 50;
    const cy = (v1.y + v2.y) / 2 / 50;
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const len = Math.sqrt(dx*dx + dy*dy) / 50;
    const xyrot = Math.atan2(dy, dx);

    return (
      <mesh
        position={[cx, cy, 0.2 + elevation]}
        rotation={new THREE.Euler(0, 0, xyrot)}
        scale={1.0}
        key={lane.uuid}
      >
        <boxGeometry args={[len, 1.0, 0.1]} />
        <meshStandardMaterial color={'#c04040'} />
      </mesh>
    );
  }
  */
  function computeBoundingBox(): THREE.Box3 {
    let vec_min = new THREE.Vector3(Infinity, Infinity, Infinity);
    let vec_max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const level of building.levels) {
      for (const vertex of level.vertices) {
        if (vertex.x < vec_min.x)
          vec_min.x = vertex.x;
        if (vertex.x > vec_max.x)
          vec_max.x = vertex.x;

        if (vertex.y < vec_min.y)
          vec_min.y = vertex.y;
        if (vertex.y > vec_max.y)
          vec_max.y = vertex.y;
      }
    }
    return new THREE.Box3(vec_min, vec_max);
  }

  const Controls = (): JSX.Element => {
    const camera = useThree(({ camera }) => camera);
    camera.up = new THREE.Vector3(0, 0, 1);
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
    if (props.mode === '3d') {
      camera.position.x = 20;
      camera.position.y = -20;
      camera.position.z = 5;
      camera.updateProjectionMatrix();

      return (
        <MapControls
          enableDamping={false}
          camera={camera}
          target={[20, -10, 0]}
        />
      );
    }
    else {
      camera.zoom = 20;
      camera.position.z = 5;
      camera.updateProjectionMatrix();

      const bb: THREE.Box3 = computeBoundingBox();
      // todo: don't create this new every time
      const target = new THREE.Vector3(
        (bb.min.x + bb.max.x) / 2.0 / 50,
        (bb.min.y + bb.max.y) / 2.0 / 50,
        0.0);
      console.log(`view target = [${target.x}, ${target.y}, 0]`);

      return (
        <OrbitControls
          enableDamping={false}
          target={target}
          camera={camera}
          maxPolarAngle={0}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
      );
    }
  }

  console.log('EditorScene');
  return (
    <Canvas
      frameloop="demand"
      onPointerMissed={() => {
        console.log("onPointerMissed");
      }}
    >
      <Controls />
      <axesHelper />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {building.levels.map((level) => <SceneLevel key={level.uuid} level={level} />)}
    </Canvas>
  )
}

/*
function EditorCamera(props: any) {
  const ref = React.useRef();
  const set = useThree(state => state.set);

  React.useEffect(() => {
    if (ref.current) {
      set({ camera: ref.current! });
    }
  }, [props, set]);

  return <perspectiveCamera ref={ref} {...props} />
  if (props.mode == '3d') {
  }
  else {
    return <OrthographicCamera
  }
}
*/
