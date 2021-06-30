import React from 'react'
import { Level } from './Level';
import { SceneDoor } from './SceneDoor';
import { SceneFloor } from './SceneFloor';
import { SceneLane } from './SceneLane';
import { SceneImage } from './SceneImage';
import { SceneMeasurement } from './SceneMeasurement';
import { SceneModel } from './SceneModel';
import { SceneVertex } from './SceneVertex';
import { SceneWall } from './SceneWall';
import { useStore } from './Store';

type SceneLevelProps = {
  level: Level
}

export function SceneLevel(props: SceneLevelProps): JSX.Element {
  const z = props.level.elevation / 2;
  useStore(state => state.selection);  // needed to ensure repaints after de-selection

  return (
    <group>
      {props.level.models.map(model =>
        <SceneModel
          key={model.uuid}
          model={model}
          level={props.level}
          level_uuid={props.level.uuid}
          elevation={z} />)}

      {props.level.vertices.map((vertex) =>
        <SceneVertex
          key={vertex.uuid}
          vertex={vertex}
          level={props.level}
          level_uuid={props.level.uuid}
          elevation={z} />)}

      {props.level.walls.map((wall) =>
        <SceneWall
          key={wall.uuid}
          wall={wall}
          level={props.level}
          vertex_start={props.level.vertices[wall.start_idx]}
          vertex_end={props.level.vertices[wall.end_idx]}
          elevation={z} />)}

      {props.level.doors.map((door) =>
        <SceneDoor
          key={door.uuid}
          door={door}
          level={props.level}
          vertex_start={props.level.vertices[door.start_idx]}
          vertex_end={props.level.vertices[door.end_idx]}
          elevation={z} />)}

      {props.level.floors.map((floor) =>
        <SceneFloor
          key={floor.uuid}
          floor={floor}
          level={props.level}
          vertices={floor.vertex_indices.map((idx) => props.level.vertices[idx])}
          elevation={z} />)}

      {props.level.lanes.map(lane =>
        <SceneLane
          key={lane.uuid}
          lane={lane}
          level={props.level}
          vertex_start={props.level.vertices[lane.start_idx]}
          vertex_end={props.level.vertices[lane.end_idx]}
          elevation={z} />)}

      {props.level.images.filter(image => image.isLegacyDefaultImage).map(image =>
        <SceneImage
          key={image.uuid}
          image={image}
          level={props.level}
          elevation={z} />)}

      {props.level.measurements.map(meas =>
        <SceneMeasurement
          key={meas.uuid}
          measurement={meas}
          level={props.level}
          vertex_start={props.level.vertices[meas.start_idx]}
          vertex_end={props.level.vertices[meas.end_idx]}
          elevation={z} />)}
    </group>
  );
}
