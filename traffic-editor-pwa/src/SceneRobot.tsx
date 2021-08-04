import React from 'react'
import * as THREE from 'three'
import { RobotTelemetry } from './Store';
import { Text } from '@react-three/drei'

interface SceneRobotProps {
  telemetry: RobotTelemetry
}

export function SceneRobot(props: SceneRobotProps): JSX.Element {
  const color = new THREE.Color(0, 0.8, 0.8);
  const color_pointer = new THREE.Color(0, 0.5, 0.5);
  const color_text = new THREE.Color(0, 0.5, 0.5);
  const radius = 0.008;
  const height = 0.015;
  const heading = props.telemetry.heading;
  const x = props.telemetry.x;
  const y = props.telemetry.y;
  const z = props.telemetry.z; // todo: deal with multiple levels
  const pointer_x = x + radius/2 * Math.cos(heading);
  const pointer_y = y + radius/2 * Math.sin(heading);
  return (
    <group>
      <mesh
        position={[x, y, z + height / 2]}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        scale={1.0}
        key={props.telemetry.name}
      >
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        position={[pointer_x, pointer_y, z + height * 1.1]}
        rotation={new THREE.Euler(0, 0, heading)}
        scale={1.0}
        key={props.telemetry.name + '_pointer'}
      >
        <planeGeometry args={[radius, radius/4]} />
        <meshStandardMaterial color={color_pointer} />
      </mesh>
      <Text fontSize={radius/3} color={color_text} position={[x, y + radius/2, z + height + 0.001]}>
        {props.telemetry.name}
      </Text>
    </group>
  );
}
