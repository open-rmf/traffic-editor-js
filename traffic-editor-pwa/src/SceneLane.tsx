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
  const coordinateSystem = useStore(state => state.site.coordinateSystem);
  useStore(state => state.repaintCount);
  const graphs = useStore(state => state.site.graphs);

  const v1 = props.vertex_start;
  const v2 = props.vertex_end;
  const [cx, cy] = props.level.transformPoint((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const len = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
  const xyrot = Math.atan2(dy, dx);

  const graph_id = props.lane.graph_idx;
  // try to find this graph
  let laneWidth = coordinateSystem === CoordinateSystem.Legacy ? 0.5 : 0.02;
  for (const graph of graphs) {
    if (graph.id === graph_id) {
      laneWidth = graph.default_lane_width;
    }
  }
  const laneHeight = laneWidth / 10;

  const isBidirectional = props.lane.getParam('bidirectional', false);

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.6, 0.05, 0.05);
    if (selection && selection.uuid === props.lane.uuid) {
      color.setRGB(0.8, 0.3, 0.01);
    }
    return color;
  }, [selection, props.lane.uuid]);

  /*
  const texture = useLoader(
    TextureLoader,
    process.env.PUBLIC_URL + '/textures/lane_direction3.png');

  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(len / laneWidth, 1);
  }
  */

  // todo: figure out how to set needsUpdate on the material
  // to tell THREE to reload the material when we toggle isBidirectional
  // console.log(`SceneLane center (${cx}, ${cy}), len ${len}, xyrot ${xyrot}, ele ${props.elevation}`);

  return (
    <mesh
      position={[cx, cy, laneHeight/2 + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.lane.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.lane);
      }}
    >
      <boxGeometry args={[len, laneWidth, laneHeight]} />
      <meshStandardMaterial color={color} transparent={true} opacity={0.7} />
    </mesh>
  );
}
//<meshStandardMaterial color={color} transparent={true} opacity={0.7} />
//<meshStandardMaterial color={color} map={isBidirectional ? null : texture} />
