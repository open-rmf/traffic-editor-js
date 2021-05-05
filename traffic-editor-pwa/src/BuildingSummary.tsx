import React from 'react';
import { Building } from './Building';
import { BuildingContext } from './BuildingContext';

export default function BuildingSummary(): JSX.Element {
  const building = React.useContext<Building>(BuildingContext);
  return (
    <div>
      <h3>{building.filename}</h3>
      {building.yaml}
    </div>
  );
}
