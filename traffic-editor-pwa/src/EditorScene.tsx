import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import React, { useRef } from 'react'
import { MapControls, OrbitControls } from '@react-three/drei'
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'

import { useStore } from './EditorStore';
import { SceneLevel } from './SceneLevel';

type EditorSceneProps = {
};

export function EditorScene(props: EditorSceneProps): JSX.Element {
  const building = useStore(state => state.building);
  const clearSelection = useStore(state => state.clearSelection);
  const editorMode = useStore(state => state.editorMode);

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
    const perspective_camera = useRef<THREE.Camera>(null);
    const orthographic_camera = useRef<THREE.Camera>(null);
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

    // todo: don't create this new every time
    const bb: THREE.Box3 = computeBoundingBox();
    const target = new THREE.Vector3(
      (bb.min.x + bb.max.x) / 2.0 / 50,
      (bb.min.y + bb.max.y) / 2.0 / 50,
      0.0);

    // todo: there is probably a better way to do this than having two cameras
    return (
      <>
        <PerspectiveCamera ref={perspective_camera} position={[20, -20, 5]} fov={100} makeDefault={editorMode === '3d'} />
        <OrthographicCamera ref={orthographic_camera} position={[0, 0, 5]} zoom={20} makeDefault={editorMode === '2d'} />
        {
          editorMode === '3d' ?
            perspective_camera && <MapControls
              enableDamping={false}
              camera={perspective_camera.current!}
              target={[20, -10, 0]}
              mouseButtons={{
                LEFT: -1,
                MIDDLE: THREE.MOUSE.PAN,
                RIGHT: THREE.MOUSE.ROTATE,
              }}
            />
            : orthographic_camera && <OrbitControls
              enableDamping={false}
              target={target}
              camera={orthographic_camera.current!}
              maxPolarAngle={0}
              minAzimuthAngle={0}
              maxAzimuthAngle={0}
              mouseButtons={{
                LEFT: -1,
                MIDDLE: THREE.MOUSE.PAN,
                RIGHT: -1,
              }}
            />
        }
      </>
    );
  }

  return (
    <Canvas
      frameloop="demand"
      onPointerMissed={() => {
        console.log("onPointerMissed");
        clearSelection();
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
