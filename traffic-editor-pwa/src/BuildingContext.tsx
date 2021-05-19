import React from 'react';
import { Building } from './Building';

interface BuildingContextProps {
  building: Building;
  updateBuilding: (nextBuilding: Building) => void;
}

export const BuildingContext = React.createContext<BuildingContextProps>({
  building: new Building(),
  updateBuilding: () => {}
});
