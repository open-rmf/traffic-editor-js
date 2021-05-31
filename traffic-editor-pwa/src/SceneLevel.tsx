import React from 'react'
import { EditorLevel } from './EditorStore';
import { SceneVertex } from './SceneVertex';
import { SceneWall } from './SceneWall';
import { SceneFloor } from './SceneFloor';
import { SceneLane } from './SceneLane';
import { useStore } from './EditorStore';

type SceneLevelProps = {
  level: EditorLevel
}

export function SceneLevel(props: SceneLevelProps): JSX.Element {
  const z = props.level.elevation / 2;
  useStore(state => state.selection);  // needed to ensure repaints after de-selection

  const vertices =
    props.level.vertices.map((vertex) =>
      <SceneVertex
        key={vertex.uuid}
        vertex={vertex}
        level_uuid={props.level.uuid}
        elevation={z} />
    );

  const walls =
    props.level.walls.map((wall) =>
      <SceneWall
        key={wall.uuid}
        wall={wall}
        vertex_start={props.level.vertices[wall.start_idx]}
        vertex_end={props.level.vertices[wall.end_idx]}
        elevation={z} />
    );

  const floors =
    props.level.floors.map((floor) =>
      <SceneFloor
        key={floor.uuid}
        floor={floor}
        vertices={floor.vertex_indices.map((idx) => props.level.vertices[idx])}
        elevation={z} />
    );

  const lanes =
    props.level.lanes.map((lane) =>
      <SceneLane
        key={lane.uuid}
        lane={lane}
        vertex_start={props.level.vertices[lane.start_idx]}
        vertex_end={props.level.vertices[lane.end_idx]}
        elevation={z} />
    );

  return (
    <group>
      {[
        ...vertices,
        ...walls,
        ...floors,
        ...lanes,
      ]}
    </group>
  );
}
