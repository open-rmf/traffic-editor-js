import React from 'react'
import { useStore } from './Store';
import { SceneLevel } from './SceneLevel';
import { Building } from './Building';

type SceneBuildingProps = {
  building: Building,
}

export function SceneBuilding(props: SceneBuildingProps): JSX.Element {
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks

  return (
    <group>
      {props.building.levels.map((level) => <SceneLevel key={level.uuid} level={level} />)}
    </group>
  );
}
