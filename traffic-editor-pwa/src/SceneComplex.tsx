import React from 'react'
import { useStore } from './Store';
import { SceneBuilding } from './SceneBuilding';
import { CoordinateSystem } from './Complex';

type SceneComplexProps = {
}

export function SceneComplex(props: SceneComplexProps): JSX.Element {
  const complex = useStore(state => state.complex);
  useStore(state => state.selection);  // needed to ensure repaints after de-selection
  useStore(state => state.repaintCount);  // needed to ensure repaints after tweaks

  return (
    <group>
      {(complex.coordinate_system === CoordinateSystem.Legacy) && <pointLight position={[10, 10, 10]} />}
      {complex.buildings.map(building => <SceneBuilding building={building} />)}
    </group>
  );
}
