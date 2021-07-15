import React from 'react';
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';

type SceneMapTileProps = {
  x: number,
  y: number,
  zoom: number,
}

export function SceneMapTile(props: SceneMapTileProps): JSX.Element {
  const key = `${props.zoom}_${props.x}_${props.y}`;

  // compute the world distance of a side of this tile
  const scale = 1000;
  const side_len = 1.000 * 256 * scale / Math.pow(2, props.zoom);

  // compute the world x and y coords of the center of this tile
  const wx = props.x * 256 * scale / Math.pow(2, props.zoom) + side_len / 2;
  const wy = -1 * (props.y * 256 * scale / Math.pow(2, props.zoom) + side_len / 2);

  const url = `https://tiles.demo.open-rmf.org/tiles/${props.zoom}/${props.x}/${props.y}.png`;
  const [texture, setTexture] = React.useState<THREE.Texture>();
  React.useEffect(() => { new TextureLoader().load(url, setTexture)}, [url]);
  if (texture && props.zoom === 18) {
    texture.magFilter = THREE.NearestFilter;
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
        key={key}
      >
        <boxGeometry args={[side_len, side_len, 0.1, 8]} />
        <meshStandardMaterial key={texture ? 'texture' : 'notexture'} map={texture} color={[1, 1, 1]} />
      </mesh>
      <Text fontSize={10 * scale / Math.pow(2, props.zoom)} color="blue" position={[wx, wy, 10.2]}>
        {key}
      </Text>
    </group>
  );
}
