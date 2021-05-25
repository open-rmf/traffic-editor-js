import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
//import React, { useRef, useState } from 'react'
import React from 'react'
import { MapControls, OrbitControls } from '@react-three/drei'
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'

import { Lane, Level, Vertex, Wall } from './Building';
import { BuildingContext } from './BuildingContext';
import { SceneFloor } from './SceneFloor';

type EditorSceneProps = {
  mode: string;
};

export default function EditorScene(props: EditorSceneProps): JSX.Element {
  const { building, updateBuilding } = React.useContext(BuildingContext);

  const renderVertex = (vertex: Vertex, elevation: number): JSX.Element => {
    const x = vertex.x / 50.0;
    const y = vertex.y / 50.0;
    // todo: consider troika-three-text for rendering the labels?
    return (
      <mesh
        position={[x, y, 0.25 + elevation]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        key={vertex.uuid}
        onClick={(event) => {
          building.selection = vertex;
          updateBuilding(building.shallowCopy());
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial color={'green'} />
      </mesh>
    );
  }
  /*
   */

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

  const renderLevel = (level: Level): JSX.Element[] => {
    const z = level.elevation / 2;
    const vertices = level.vertices.map((vertex) => renderVertex(vertex, z));
    const walls = level.walls.map((wall) => renderWall(wall, level.vertices, z));
    const lanes = level.lanes.map((lane) => renderLane(lane, level.vertices, z));
    const floors: JSX.Element[] = level.floors.map((floor) => (
      <SceneFloor key={floor.uuid} floor={floor} vertices={level.vertices} elevation={z} />
    ));
    return [
      ...vertices,
      ...walls,
      ...lanes,
      ...floors
    ];
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

      const bb: THREE.Box3 = building.computeBoundingBox();
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
    <>
      <Controls />
      <axesHelper />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {building.levels.map((level) => renderLevel(level))}
    </>
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

export function SceneWrapper(props: EditorSceneProps): JSX.Element {
  //const { building, updateBuilding } = React.useContext(BuildingContext);

  /*
  const EditorCanvas = (canvasProps: any) => {
    console.log('EditorCanvas');
    if (props.mode === '3d') {
      return (
        <Canvas
          frameloop = "demand"
        >
          {canvasProps ? canvasProps.children : <></>}
        </Canvas>
      );
    }
    else {
      return (
        <Canvas
          frameloop = "demand"
          orthographic
        >
          {canvasProps ? canvasProps.children : <></>}
        </Canvas>
      );
    }
  }
   */

  //<EditorCanvas>
  console.log('SceneWrapper');
  return (
    <BuildingContext.Consumer>
      {context => (
        <Canvas frameloop="demand">
          <BuildingContext.Provider value={context}>
            <EditorScene mode={props.mode} />
          </BuildingContext.Provider>
        </Canvas>
      )}
    </BuildingContext.Consumer>
  )
  //</EditorCanvas>
}
