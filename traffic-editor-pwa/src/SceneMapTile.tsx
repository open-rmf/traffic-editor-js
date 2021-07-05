import React from 'react';
import { Text } from '@react-three/drei'
import * as THREE from 'three'
//import { useStore } from './Store';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';

type SceneMapTileProps = {
  x: number,
  y: number,
  zoom: number,
}

export function SceneMapTile(props: SceneMapTileProps): JSX.Element {
  const toString = () => `${props.zoom}_${props.x}_${props.y}`;

  // let left_x_grid_idx = Math.floor(1 / 360 * Math.pow(2, zoom_level) * (left_x + 180));
  const x_degrees = (props.x * 360 / Math.pow(2, props.zoom)) - 180;

  const PHI_MAX = 85.05112877980659;  // web mercator... 2*atan(e^pi) - pi/2
  const y_degrees = (Math.pow(2, props.zoom) - 1 - props.y) * 4 * PHI_MAX / Math.pow(2, props.zoom) - PHI_MAX;  // / Math.pow(2, props.zoom));

  const shrink = 0.99;
  const box_side_x_len = shrink * 360 / Math.pow(2, props.zoom);
  const box_side_y_len = shrink * PHI_MAX * 4 / Math.pow(2, props.zoom);

  const url = `http://localhost:8800/tiles/${props.zoom}/${props.x}/${props.y}.png`;
  const [ texture ] = useLoader(TextureLoader, [url]);

  return (
    <group>
      <mesh
        position={[x_degrees + box_side_x_len / 2, y_degrees - box_side_y_len / 2, 0]}
        scale={1}
        rotation={new THREE.Euler(0, 0, 0)}
        key={toString()}
      >
        <boxGeometry args={[box_side_x_len, box_side_y_len, 0.1, 8]} />
        <meshStandardMaterial map={texture} color={[0.5, 0.5, 0.5]} />
      </mesh>
      <Text fontSize={10 / props.zoom} color="blue" position={[x_degrees + box_side_x_len / 2, y_degrees - box_side_y_len / 2, 0.2]}>
        {toString()}
      </Text>
    </group>
  );
}
/*
 */
