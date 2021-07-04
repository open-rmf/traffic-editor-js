import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import React, { useRef, Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'

import { useStore, clearSelection } from './Store';
import { SceneComplex } from './SceneComplex';

type EditorSceneProps = {
};

export function EditorScene(props: EditorSceneProps): JSX.Element {
  const setStore = useStore(state => state.set);
  //const clearSelection = useStore(state => state.clearSelection);
  const editorMode = useStore(state => state.editorMode);
  const cameraInitialPose = useStore(state => state.cameraInitialPose);

  const Controls = (): JSX.Element => {
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
    const perspective_camera = useRef<THREE.Camera>(null);
    const orthographic_camera = useRef<THREE.Camera>(null);
    const enableMotionControls = useStore(state => state.enableMotionControls);

    // todo: there is probably a better way to do this than having two cameras
    return (
      <>
        <PerspectiveCamera
          ref={perspective_camera}
          position={cameraInitialPose.position}
          fov={60}
          makeDefault={editorMode === '3d'}
        />
        <OrthographicCamera
          ref={orthographic_camera}
          position={[cameraInitialPose.target.x, cameraInitialPose.target.y, cameraInitialPose.target.z + 5]}
          zoom={20}
          makeDefault={editorMode === '2d'}
        />
        {perspective_camera && orthographic_camera && <OrbitControls
          enableDamping={false}
          screenSpacePanning={editorMode === '3d' ? false : true}
          target={cameraInitialPose.target}
          camera={editorMode === '3d' ? perspective_camera.current! : orthographic_camera.current!}
          maxPolarAngle={editorMode === '3d' ? Infinity : 0}
          minAzimuthAngle={editorMode === '3d' ? -Infinity : 0}
          maxAzimuthAngle={editorMode === '3d' ? Infinity : 0}
          mouseButtons={{
            LEFT: -1,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.ROTATE
          }}
          enabled={enableMotionControls}
        />}
      </>
    );
  }

  console.log('EditorScene()');
  return (
    <Canvas
      frameloop="demand"
      onPointerMissed={() => {
        clearSelection(setStore);
      }}
    >
      <Controls />
      <axesHelper />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null} >
        <SceneComplex />
      </Suspense>
    </Canvas>
  )
}
