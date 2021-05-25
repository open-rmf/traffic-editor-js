import create from 'zustand';
import { Building } from './Building';

export const useStore = create(set => ({
  building: new Building(),
  replace: (nextBuilding: Building) => set(state => ({ building: nextBuilding })),
}))
