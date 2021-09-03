import * as THREE from 'three'
import React from 'react'
import { useStore } from './Store';
import { SceneLevel } from './SceneLevel';
import { CoordinateSystem } from './CoordinateSystem';
import { useFrame, useThree } from '@react-three/fiber';
import { SceneRobot } from './SceneRobot';

type SceneSiteProps = {
}

export function SceneSite(props: SceneSiteProps): JSX.Element {
  const site = useStore(state => state.site);
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks
  const setStore = useStore(state => state.set);
  const robots = useStore(state => state.mqtt_robot_telemetry);
  const scene = useThree(state => state.scene);
  scene.background = new THREE.Color('white');

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
      {(site.coordinateSystem === CoordinateSystem.Legacy) && <pointLight position={[10, 10, 10]} />}
      {site.levels.map((level) => <SceneLevel key={level.uuid} level={level} />)}
      {robots.map((robot) => <SceneRobot telemetry={robot} />)}
    </group>
  );
}
