import React from 'react';
import { Building, BuildingDefault } from './Building';

export const BuildingContext = React.createContext<Building>(BuildingDefault);
