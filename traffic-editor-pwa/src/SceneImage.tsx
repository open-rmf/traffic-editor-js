import React from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { Level } from './Level';
import { useStore, EditorImage } from './Store';

type SceneImageProps = {
  image: EditorImage,
  elevation: number,
  level: Level,
}

export function SceneImage(props: SceneImageProps): JSX.Element {
  //const selection = useStore(state => state.selection)
  const url_base = useStore(state => state.site.url_base);
  //const setStore = useStore(state => state.set);
  const [ texture ] = useLoader(TextureLoader, [url_base + props.image.filename]);
  //useLoader.preload(TextureLoader, [url_base + props.image.filename]);

  let width_meters = 50.0;
  let height_meters = 50.0;

  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    width_meters = texture.image.width * props.level.scale;
    height_meters = texture.image.height * props.level.scale;
    // console.log(`texture size: ${width_meters}, ${height_meters}`);
  }

  const x = props.image.offset.x;
  const y = props.image.offset.y;
  const scale = 1; // todo...
  const yaw = props.image.yaw;

  return (
    <mesh
      position={[x + width_meters / 2, y - height_meters / 2, props.elevation + 0.1]}
      scale={scale}
      rotation={new THREE.Euler(0, yaw, 0)}
      key={props.image.uuid}
    >
      <boxGeometry args={[width_meters, height_meters, 0.1, 8]} />
      <meshStandardMaterial map={texture} color={[1.0, 1.0, 1.0]} />
    </mesh>
  );
}
