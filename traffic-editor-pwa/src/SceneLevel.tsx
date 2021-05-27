import React from 'react'
//import * as THREE from 'three'
//import { Vertex, Floor, Level } from './Building';
import { EditorLevel } from './EditorStore';
//import { SceneFloor } from './SceneFloor';
import { SceneVertex } from './SceneVertex';

type SceneLevelProps = {
  level: EditorLevel
}

export function SceneLevel(props: SceneLevelProps): JSX.Element {
  //const building = useStore(state => state.building);
  //const replaceBuilding = useStore(state => state.replace);
  // todo: figure out how to use useCallback()
  console.log('Level uuid=' + props.level.uuid);
  //const level = useStore(useCallback(state => state.building.levels.find((level) => (level.uuid === props.uuid)), [props.uuid]));
  /*
  if (!props.level) {
    console.log('could not find level :(');
    return <></>;
  }
  */
  console.log('  has ' + props.level.vertices.length + ' vertices');

  const z = props.level.elevation / 2;
  const vertices =
    props.level.vertices.map((vertex) =>
      <SceneVertex
        key={vertex.uuid}
        vertex={vertex}
        elevation={z} />
    );
  console.log('  created ' + vertices.length + ' meshes');
  return (
    <group>
      {[
        ...vertices,
      ]}
    </group>
  );

  /*
  const walls = []; //props.level.walls.map((wall) => renderWall(wall, props.level.vertices, z));
  const lanes = []; //props.level.lanes.map((lane) => renderLane(lane, props.level.vertices, z));
  const floors =  [];
  */
  /*
    props.level.floors.map((floor) =>
      <SceneFloor
        key={floor.uuid}
        floor={floor}
        vertices={props.level.vertices}
        elevation={z} />
    );
  console.log('found ' + floors.length + ' floors');
  */
  /*
  return <>[
    ...vertices,
    ...walls,
    ...lanes,
    ...floors,
  ]</>;
  */
}
