import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { CoordinateSystem } from './CoordinateSystem';

import { useStore, clearSelection } from './Store';
import { SceneSite } from './SceneSite';
import { SceneMap } from './SceneMap';
import { ShortcutKeys } from './ShortcutKeys';
//import { ToolID } from './ToolID';

type EditorSceneProps = {
};

export function EditorScene(props: EditorSceneProps): JSX.Element {
  const showMap = useStore(state => (state.site.coordinateSystem !== CoordinateSystem.Legacy));
  const setStore = useStore(state => state.set);
  //const clearSelection = useStore(state => state.clearSelection);
  const editorMode = useStore(state => state.editorMode);
  const cameraInitialPose = useStore(state => state.cameraInitialPose);
  //const activeTool = useStore(state => state.activeTool);
  //const disableEditorTools = useStore(state => state.disableEditorTools);

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
          position={[cameraInitialPose.target.x, cameraInitialPose.target.y, cameraInitialPose.target.z + 100]}
          zoom={cameraInitialPose.zoom}
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
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: -1,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.ROTATE
          }}
          enabled={enableMotionControls}
          regress={true}
        />}
      </>
    );
  }

  console.log('EditorScene()');
  return (
    <Canvas
      id="mainCanvas"
      frameloop="demand"
      mode="concurrent"
      linear={true}
      tabIndex={0}
      onPointerMissed={() => {
        clearSelection(setStore);
      }}
    >
      <ShortcutKeys />
      <Controls />
      <axesHelper />
      <ambientLight intensity={1.0}/>
      <SceneSite />
      {showMap && <SceneMap />}
    </Canvas>
  )
}
/*
      <Suspense fallback={null} >
      <pointLight position={[10, 10, 10]} />
      </Suspense>
*/
