import React from 'react'
import * as THREE from 'three'
import { Vertex } from './Vertex';
import { Level } from './Level';
import { Lane } from './Lane';
import { useStore, setSelection } from './Store';
import { CoordinateSystem } from './CoordinateSystem';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';

interface SceneLaneProps {
  vertex_start: Vertex,
  vertex_end: Vertex,
  lane: Lane,
  level: Level,
  elevation: number,
}

export function SceneLane(props: SceneLaneProps): JSX.Element {
  const selection = useStore(state => state.selection)
  const setStore = useStore(state => state.set);
  const coordinateSystem = useStore(state => state.site.coordinate_system);

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const [cx, cy] = props.level.transformPoint((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
  const xyrot = Math.atan2(dy, dx);

  const laneWidth = coordinateSystem === CoordinateSystem.Legacy ? 0.5 : 0.02;
  const laneHeight = laneWidth / 10;

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.6, 0.05, 0.05);
    if (selection && selection.uuid === props.lane.uuid) {
      color.setRGB(0.8, 0.3, 0.01);
    }
    return color;
  }, [selection, props.lane.uuid]);

  const texture = useLoader(
    TextureLoader, 
    process.env.PUBLIC_URL + '/textures/lane_direction.png');

  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    //width_meters = texture.image.width * props.level.scale;
    //height_meters = texture.image.height * props.level.scale;
    // console.log(`texture size: ${width_meters}, ${height_meters}`);
    //texture.wrapS = THREE.RepeatMapping;
    //texture.wrapT = THREE.RepeatMapping;
  }


  return (
    <mesh
      position={[cx, cy, laneHeight/2 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.lane.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(setStore, props.lane);
      }}
    >
      <boxGeometry args={[len, laneWidth, laneHeight]} />
      <meshStandardMaterial color={color} map={texture} />
    </mesh>
  );
}
//<meshStandardMaterial color={color} transparent={true} opacity={0.7} />
