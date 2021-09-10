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
  const length = Math.sqrt(dx*dx + dy*dy) * props.level.scale;
  const xyrot = Math.atan2(dy, dx);

  const graph_id = props.lane.graph_idx;
  // try to find this graph
  let width = coordinateSystem === CoordinateSystem.Legacy ? 0.5 : 0.02;
  for (const graph of graphs) {
    if (graph.id === graph_id) {
      width = graph.default_lane_width;
    }
  }
  const height = width / 20;

  const isBidirectional = props.lane.getParam('bidirectional', false);

  const texture_scale = 0.2;
  const uvRef = React.useRef();

  const uvs = React.useMemo(() => {
    return new Float32Array([
      0, 1,
      length * texture_scale, 1,
      0, 0,
      length * texture_scale, 0])
  }, [length]);

  const color: THREE.Color = React.useMemo(() => {
    let color = new THREE.Color(0.6, 0.05, 0.05);
    if (selection && selection.uuid === props.lane.uuid) {
      color.setRGB(0.8, 0.3, 0.01);
    }
    return color;
  }, [selection, props.lane.uuid]);

  const texture = useLoader(
    TextureLoader,
    process.env.PUBLIC_URL + '/textures/lane_direction3.png');

  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }

  // todo: figure out how to set needsUpdate on the material
  // to tell THREE to reload the material when we toggle isBidirectional
  // console.log(`SceneLane center (${cx}, ${cy}), len ${len}, xyrot ${xyrot}, ele ${props.elevation}`);

  const geometry = React.useRef();

  const update = React.useCallback(({parent}) => {
    parent.attributes.uv.needsUpdate = true;
  }, []);

  return (
    <mesh
      position={[cx, cy, height + props.elevation]}
      rotation={new THREE.Euler(0, 0, xyrot)}
      scale={1.0}
      key={props.lane.uuid}
      onClick={(event) => {
        event.stopPropagation();
        setSelection(props.lane);
      }}
    >
      <meshStandardMaterial color={color} transparent={true} map={isBidirectional ? null : texture} opacity={0.7} />
      <planeBufferGeometry args={[length, width, 1, 1]} ref={geometry}>
        <bufferAttribute
          attachObject={['attributes', 'uv']}
          count={4}
          itemSize={2}
          array={uvs}
          ref={uvRef}
          onUpdate={update} />
      </planeBufferGeometry>
    </mesh>
  );
}
