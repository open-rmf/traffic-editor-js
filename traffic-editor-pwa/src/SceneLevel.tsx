import React from 'react'
import * as THREE from 'three'
import { Vertex, Floor, Level } from './Building';
import { useStore } from './BuildingStore';
import { SceneFloor } from './SceneFloor';

type SceneLevelProps = {
  uuid: string;
}

export function SceneLevel(props: SceneLevelProps): JSX.Element {
  //const building = useStore(state => state.building);
  //const replaceBuilding = useStore(state => state.replace);
  // todo: figure out how to use useCallback()
  console.log('Level uuid=' + props.uuid);
  const level = useStore(useCallback(state => state.building.levels.find((level) => (level.uuid === props.uuid)), [props.uuid]));
  if (!level) {
    console.log('could not find level :(');
    return <></>;
  }

  const z = level.elevation / 2;
  const vertices = []; //props.level.vertices.map((vertex) => renderVertex(vertex, z));
  const walls = []; //props.level.walls.map((wall) => renderWall(wall, props.level.vertices, z));
  const lanes = []; //props.level.lanes.map((lane) => renderLane(lane, props.level.vertices, z));
  const floors = 
    level.floors.map((floor) =>
      <SceneFloor
        key={floor.uuid}
        floor={floor}
        vertices={level.vertices}
        elevation={z} />
    );
  console.log('found ' + floors.length + ' floors');
  return <>[
    ...vertices,
    ...walls,
    ...lanes,
    ...floors,
  ]</>;
}
