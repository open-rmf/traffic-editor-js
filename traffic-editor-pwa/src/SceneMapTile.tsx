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

  /*
  // let left_x_grid_idx = Math.floor(1 / 360 * Math.pow(2, zoom_level) * (left_x + 180));
  const x_degrees = (props.x * 360 / Math.pow(2, props.zoom)) - 180;

  const PHI_MAX = 85.05112877980659;  // web mercator... 2*atan(e^pi) - pi/2
  const y_degrees = (Math.pow(2, props.zoom) - 1 - props.y) * 4 * PHI_MAX / Math.pow(2, props.zoom) - PHI_MAX;  // / Math.pow(2, props.zoom));
  */

  // compute the world distance of a side of this tile
  const scale = 1000;
  const side_len = 1.000 * 256 * scale / Math.pow(2, props.zoom);

  // compute the world x and y coords of the center of this tile
  const wx = props.x * 256 * scale / Math.pow(2, props.zoom) + side_len / 2;
  const wy = -1 * (props.y * 256 * scale / Math.pow(2, props.zoom) + side_len / 2);

  const url = `http://localhost:8800/tiles/${props.zoom}/${props.x}/${props.y}.png`;
  const [ texture ] = useLoader(TextureLoader, [url]);
  if (texture) {
    //texture.magFilter = THREE.NearestFilter;
    //texture.minFilter = THREE.NearestFilter;
    //texture.encoding = THREE.LinearEncoding; // not sure why this is needed...
    //texture.encoding = THREE.sRGBEncoding; // not sure why this is needed...
  }

  return (
    <group>
      <mesh
        position={[wx, wy, 0]}
        scale={1}
        rotation={new THREE.Euler(0, 0, 0)}
        key={toString()}
      >
        <boxGeometry args={[side_len, side_len, 10, 8]} />
        <meshStandardMaterial map={texture} color={[1.0, 1.0, 1.0]} />
      </mesh>
      <Text fontSize={10 * scale / Math.pow(2, props.zoom)} color="blue" position={[wx, wy, 10.2]}>
        {toString()}
      </Text>
    </group>
  );
}
