//import yaml from 'js-yaml';

export interface Building {
  filename: string;
  yaml: string;
}

export const BuildingDefault: Building = {
  filename: '',
  yaml: '',
}

export const BuildingParseYAML = (building: Building, filename: string, yaml: string) => {
  building.yaml = yaml;
  building.filename = filename;
}
