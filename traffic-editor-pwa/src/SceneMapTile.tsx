import React from 'react';
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useStore } from './Store';
import { ToolID } from './ToolID';

type SceneMapTileProps = {
  x: number,
  y: number,
  zoom: number,
}

export function SceneMapTile(props: SceneMapTileProps): JSX.Element {
  const activeTool = useStore(state => state.activeTool);
  const editorMode = useStore(state => state.editorMode);

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
        onPointerDown={event => {
          event.stopPropagation();
          if (activeTool === ToolID.ADD_VERTEX) {
            if (editorMode === '2d') {
              const webm_x = event.unprojectedPoint.x / 1000.0;
              const webm_y = -event.unprojectedPoint.y / 1000.0;
              console.log(`SceneMapTile add vertex at WebM: (${webm_x}, ${webm_y})`);
              /*
              const [px, py] = props.level.inverseTransformPoint(event.unprojectedPoint.x, event.unprojectedPoint.y);
              updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, px, py);
              */
            }
            else {
              /*
              let intersection_point = new THREE.Vector3();
              event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
              const [px, py] = props.level.inverseTransformPoint(intersection_point.x, intersection_point.y);
              updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, px, py);
              */
            }
          }
        }}
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
