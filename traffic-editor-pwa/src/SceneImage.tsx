import React from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { useStore, EditorImage, setSelection } from './EditorStore';

type SceneImageProps = {
  image: EditorImage,
  elevation: number,
}

export function SceneImage(props: SceneImageProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const url_base = useStore(state => state.building.url_base);
  const setStore = useStore(state => state.set);
  const [ texture ] = useLoader(TextureLoader, [url_base + props.image.filename]);

  let width_pixels = 128;
  let height_pixels = 128;

  let width_meters = 50.0;
  let height_meters = 50.0;

  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    width_pixels = texture.image.width;
    height_pixels = texture.image.height;
    width_meters = width_pixels / 50;
    height_meters = height_pixels / 50;
  }

  const x = 0; //props.image.x / 50.0;
  const y = 0; //props.image.y / 50.0;
  const scale = 1.0;
  const yaw = 0.0;
  // <meshStandardMaterial color={color} />
  // rotation={new THREE.Euler(Math.PI / 2, yaw, 0)}

  return (
    <mesh
      position={[width_meters / 2, -height_meters / 2, props.elevation + 0.1]}
      scale={scale}
      rotation={new THREE.Euler(0, yaw, 0)}
      key={props.image.uuid}
    >
      <boxGeometry args={[width_meters, height_meters, 0.1, 8]} />
      <meshStandardMaterial map={texture} color={[1.0, 1.0, 1.0]} />
    </mesh>
  );
}
