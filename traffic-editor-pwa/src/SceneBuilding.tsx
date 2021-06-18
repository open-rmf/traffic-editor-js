import React from 'react'
import { useStore } from './EditorStore';
import { SceneLevel } from './SceneLevel';

type SceneBuildingProps = {
}

export function SceneBuilding(props: SceneBuildingProps): JSX.Element {
  const building = useStore(state => state.building);
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks

  return (
    <group>
      {building.levels.map((level) => <SceneLevel key={level.uuid} level={level} />)}
    </group>
  );
}
