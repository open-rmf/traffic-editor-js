import React from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { Vertex } from './Vertex';
import { Level } from './Level';
import {
  useStore,
  repaintPropertyEditor,
  setSelection,
  setActiveUUID,
  setActiveMotionTool,
  updateVertexPoint,
  addLane,
} from './Store';
import { ToolID } from './ToolID';
import { CoordinateSystem } from './CoordinateSystem';

interface SceneVertexProps {
  vertex: Vertex,
  elevation: number,
  level: Level,
  level_uuid: string,
}

export function SceneVertex(props: SceneVertexProps): JSX.Element {
  //console.log('SceneVertex()');
  const selection = useStore(state => state.selection);
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const activeTool = useStore(state => state.activeTool);
  const activeUUID = useStore(state => state.activeUUID);
  const activeMotionTool = useStore(state => state.activeMotionTool);
  const coordinateSystem = useStore(state => state.site.coordinate_system);
  const captureTools = [ToolID.MOVE, ToolID.ADD_LANE];

  const [activeMotionLinePoint, setActiveMotionLinePoint] = React.useState<[number, number]>([0, 0]);
  const [showActiveMotionGeometry, setShowActiveMotionGeometry] = React.useState(false);
  const updateActiveMotionGeometry = React.useCallback(self => {
    self.setFromPoints(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(activeMotionLinePoint[0], activeMotionLinePoint[1], 0)
      ]);
  }, [activeMotionLinePoint]);

  // todo: inflate vertex diameter when far away?
  const vertexDiameter = coordinateSystem === CoordinateSystem.Legacy ? 0.1 : 0.01;

  const [x, y] = props.level.transformPoint(props.vertex.x, props.vertex.y);

  let color = "rgb(0, 128, 0)";
  if (selection && selection.uuid === props.vertex.uuid) {
    color = "rgb(255, 100, 10)";
  }

  //const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)]);
  return (
    <group>
      <mesh
        position={[x, y, vertexDiameter/2 + props.elevation]}
        scale={1.0}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        key={props.vertex.uuid}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          //console.log(`vertex onPointerDown uuid=${props.vertex.uuid}`);
          if (activeTool === ToolID.SELECT) {
            setSelection(setStore, props.vertex);
            return;
          }
          else if (captureTools.includes(activeTool)) {
            event.stopPropagation();
            setActiveMotionTool(activeTool);
            setActiveUUID(props.vertex.uuid);
            if (event.target) {
              (event.target as HTMLElement).setPointerCapture(event.pointerId);
            }
          }
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          if (event.target) {
            (event.target as HTMLElement).releasePointerCapture(event.pointerId);
          }
          setShowActiveMotionGeometry(false);
          repaintPropertyEditor(setStore);

          //console.log(`vertex onPointerUp uuid=${props.vertex.uuid} activeMotionTool=${activeMotionTool}`);
          if (activeMotionTool === ToolID.ADD_LANE) {
            // calculate if we released the pointer on an existing vertex
            // if so, add a new lane between those vertices
            //console.log(`activeUUID: ${activeUUID} props.vertex.uuid: ${props.vertex.uuid}`);
            if (activeUUID !== props.vertex.uuid) {
              addLane(activeUUID, props.vertex.uuid, props.level.uuid);
            }
          }
          setActiveMotionTool(ToolID.NONE);
        }}
        onPointerMove={(event) => {
          if (activeMotionTool === ToolID.NONE)
            return;

          event.stopPropagation();

          let [mouse_x, mouse_y] = [0, 0];
          if (editorMode === '2d') {
            [mouse_x, mouse_y] = props.level.inverseTransformPoint(event.unprojectedPoint.x, event.unprojectedPoint.y);
          }
          else if (editorMode === '3d') {
            let intersection_point = new THREE.Vector3();
            event.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), props.elevation), intersection_point);
            [mouse_x, mouse_y] = props.level.inverseTransformPoint(intersection_point.x, intersection_point.y);
          }
          else {
            return;
          }

          if (activeMotionTool === ToolID.MOVE) {
            updateVertexPoint(setStore, props.level_uuid, props.vertex.uuid, mouse_x, mouse_y);
          }
          else if (activeMotionTool === ToolID.ADD_LANE) {
            setShowActiveMotionGeometry(true);
            setActiveMotionLinePoint([mouse_x - x, mouse_y - y]);
          }
        }}
      >
        <cylinderGeometry args={[vertexDiameter, vertexDiameter, vertexDiameter, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text color="blue" position={[x, y, 1.5 * vertexDiameter + props.elevation]}>
        {props.vertex.name}
      </Text>
      {showActiveMotionGeometry && <lineSegments position={[x, y, props.elevation + 0.3]}>
        <bufferGeometry attach="geometry" onUpdate={updateActiveMotionGeometry} />
        <lineBasicMaterial attach="material" color={'#000000'} linewidth={20} linecap={'round'} />
      </lineSegments>}
    </group>
  );
}
