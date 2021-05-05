import React from 'react';
import Building from './Building';

/*
export interface Building {
  yaml: string = '';
  filename: string = '';
}
*/

export default BuildingContext = React.createContext<Building>(new Building());
