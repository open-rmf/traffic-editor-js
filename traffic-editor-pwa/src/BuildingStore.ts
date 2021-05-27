import create from 'zustand';
import { Building } from './Building';


interface BuildingStoreState {
  building: Building,
  replace: (nextBuilding: Building) => void
}

export const useStore = create<BuildingStoreState>(set => ({
  building: new Building(),
  replace: (nextBuilding: Building) => set(state => ({ building: nextBuilding })),
}))
