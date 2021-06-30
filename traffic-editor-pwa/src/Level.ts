import YAML from 'yaml';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { Vertex } from './Vertex';
//import { EditorParam } from './EditorParam';
import {
  EditorDoor,
  EditorWall,
  EditorMeasurement,
  EditorFloor,
  EditorImage,
  EditorLane,
  EditorModel,
  EditorFeature,
  EditorConstraint } from './EditorStore';

export class Level extends EditorObject {
  name: string = '';
  elevation: number = 0;
  scale: number = 1.234;
  doors: EditorDoor[] = [];
  vertices: Vertex[] = [];
  walls: EditorWall[] = [];
  measurements: EditorMeasurement[] = [];
  floors: EditorFloor[] = [];
  lanes: EditorLane[] = [];
  models: EditorModel[] = [];
  images: EditorImage[] = [];
  features: EditorFeature[] = [];
  constraints: EditorConstraint[] = [];

  static fromYAML(_name: string, data: any): Level {
    let level = new Level();
    level.uuid = generate_uuid();
    level.name = _name;

    if (data['drawing'] && data['drawing']['filename']) {
      let image = new EditorImage();
      image.uuid = generate_uuid();
      image.filename = data['drawing']['filename'];
      image.isLegacyDefaultImage = true;
      level.images.push(image);
    }

    level.elevation = data['elevation'];
    level.constraints = data['constraints'].map((constraint: any) => EditorConstraint.fromYAML(constraint));
    level.doors = data['doors'].map((door: any) => EditorDoor.fromYAML(door));
    level.features = data['features'].map((feature: any) => EditorFeature.fromYAML(feature));
    level.floors = data['floors'].map((floor: any) => EditorFloor.fromYAML(floor));
    for (const layer_name in data['layers']) {
      level.images.push(EditorImage.fromLayerYAML(layer_name, data['layers'][layer_name]));
    }
    level.lanes = data['lanes'].map((lane: any) => EditorLane.fromYAML(lane));
    level.models = data['models'].map((model: any) => EditorModel.fromYAML(model));
    level.measurements = data['measurements'].map((measurement: any) => EditorMeasurement.fromYAML(measurement));
    level.vertices = data['vertices'].map((vertex: any) => Vertex.fromYAML(vertex));
    level.walls = data['walls'].map((wall: any) => EditorWall.fromYAML(wall));

    level.calculateScale();

    return level;
  }

  toYAML(): YAML.YAMLMap {
    let node = new YAML.YAMLMap();

    node.add({ key: 'constraints', value: this.constraints.map(constraint => constraint.toYAML()) });
    node.add({ key: 'doors', value: this.doors.map(door => door.toYAML()) });

    if (this.images.length > 0 && this.images[0].isLegacyDefaultImage) {
      node.add({ key: 'drawing', value: { 'filename': this.images[0].filename } });
    }

    node.add({ key: 'elevation', value: this.elevation });
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML()) });
    node.add({ key: 'flattened_x_offset', value: 0 });
    node.add({ key: 'flattened_y_offset', value: 0 });
    node.add({ key: 'floors', value: this.floors.map(floor => floor.toYAML()) });
    node.add({ key: 'lanes', value: this.lanes.map(lane => lane.toYAML()) });

    let layers_node = new YAML.YAMLMap();
    for (const image of this.images) {
      if (!image.isLegacyDefaultImage) {
        layers_node.add({ key: image.name, value: image.toLayerYAML() });
      }
    }
    node.add({ key: 'layers', value: layers_node });
    node.add({ key: 'measurements', value: this.measurements.map(measurement => measurement.toYAML()) });
    node.add({ key: 'models', value: this.models.map(model => model.toYAML()) });
    node.add({ key: 'vertices', value: this.vertices.map(vertex => vertex.toYAML()) });
    node.add({ key: 'walls', value: this.walls.map(wall => wall.toYAML()) });
    return node;
  }

  calculateScale(): void {
    let sum = 0.0;
    let count = 0;
    for (const meas of this.measurements) {
      count++;
      const dx = this.vertices[meas.start_idx].x - this.vertices[meas.end_idx].x;
      const dy = this.vertices[meas.start_idx].y - this.vertices[meas.end_idx].y;
      const d_pixels = Math.sqrt(dx*dx + dy*dy);
      sum += meas.distance / d_pixels;
    }

    if (count > 0) {
      this.scale = sum / count;
    }
    else {
      this.scale = 0.05;  // just use something sane...
    }
  }
}
