import React from 'react';
import { Building, BuildingDefault } from './Building';

export const BuildingContext = React.createContext({
  building: BuildingDefault,
  updateBuilding: (nextBuilding: Building) => {}
});
