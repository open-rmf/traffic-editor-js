import * as THREE from 'three'
import React from 'react'
import { useStore } from './Store';
import { SceneLevel } from './SceneLevel';
import { CoordinateSystem } from './CoordinateSystem';
import { useFrame } from '@react-three/fiber';

type SceneSiteProps = {
}

export function SceneSite(props: SceneSiteProps): JSX.Element {
  const site = useStore(state => state.site);
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks
  const setStore = useStore(state => state.set);

  useFrame(state => {
    if (state.camera instanceof THREE.OrthographicCamera) {
      const c: THREE.OrthographicCamera = state.camera as THREE.OrthographicCamera;
      //const scale = 1000;
      const center_x = c.matrixWorld.elements[12];
      const center_y = c.matrixWorld.elements[13];
      const center_z = c.matrixWorld.elements[14];
      setStore(state => {
        state.cameraPose = {
          position: state.cameraPose.position.set(center_x, center_y, center_z),
          target: state.cameraPose.target,
          zoom: state.cameraPose.zoom,
        };
      });
    }
  });

  return (
    <group>
      {(site.coordinate_system === CoordinateSystem.Legacy) && <pointLight position={[10, 10, 10]} />}
      {site.levels.map((level) => <SceneLevel key={level.uuid} level={level} />)}
    </group>
  );
}
