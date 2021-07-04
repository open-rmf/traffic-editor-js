import React from 'react'
import { useStore } from './Store';
import { SceneBuilding } from './SceneBuilding';

type SceneComplexProps = {
}

export function SceneComplex(props: SceneComplexProps): JSX.Element {
  const complex = useStore(state => state.complex);
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks

  return (
    <group>
      {complex.buildings.map(building => <SceneBuilding building={building} />)}
    </group>
  );
}
