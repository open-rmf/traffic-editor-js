import YAML from 'yaml';
import { v4 as generate_uuid } from 'uuid';
import { EditorObject } from './EditorObject';
import { EditorProp } from './EditorProp';
import { Lane } from './Lane';
import { Vertex } from './Vertex';
import { Feature } from './Feature';
import {
  CoordinateSystem,
  CoordinateSystemToString,
  CoordinateSystemScale
} from './CoordinateSystem';

//import { EditorParam } from './EditorParam';
import {
  EditorDoor,
  EditorWall,
  EditorMeasurement,
  EditorFloor,
  EditorImage,
  EditorModel,
  EditorConstraint
} from './Store';

export class Level extends EditorObject {
  name: string = '';
  elevation: number = 0;
  scale: number = 1.234;
  doors: EditorDoor[] = [];
  vertices: Vertex[] = [];
  walls: EditorWall[] = [];
  measurements: EditorMeasurement[] = [];
  floors: EditorFloor[] = [];
  lanes: Lane[] = [];
  models: EditorModel[] = [];
  images: EditorImage[] = [];
  features: Feature[] = [];
  constraints: EditorConstraint[] = [];
  coordinateSystem: CoordinateSystem = CoordinateSystem.Legacy;

  constructor() {
    super();
    this.props.push(new EditorProp('name', () => this.name));
    this.props.push(new EditorProp('elevation', () => this.elevation));
    this.props.push(new EditorProp('scale', () => this.scale));
    this.props.push(new EditorProp('coordinates', () => CoordinateSystemToString(this.coordinateSystem)));
  }

  static fromYAML(_name: string, data: any, _coordinateSystem: CoordinateSystem): Level {
    let level = new Level();
    level.object_type_name = 'Level';
    level.uuid = generate_uuid();
    level.name = _name;
    level.coordinateSystem = _coordinateSystem;

    const coord_scale = CoordinateSystemScale(level.coordinateSystem);

    if (data['drawing'] && data['drawing']['filename']) {
      let image = new EditorImage();
      image.uuid = generate_uuid();
      image.filename = data['drawing']['filename'];
      image.isLegacyDefaultImage = true;
      level.images.push(image);
    }

    if (data['elevation']) {
      level.elevation = data['elevation'];
    }

    if (data['constraints']) {
      level.constraints = data['constraints'].map((constraint: any) => EditorConstraint.fromYAML(constraint));
    }

    if (data['doors']) {
      level.doors = data['doors'].map((door: any) => EditorDoor.fromYAML(door));
    }

    if (data['features']) {
      level.features = data['features'].map((feature: any) => Feature.fromYAML(feature, coord_scale));
    }

    if (data['floors']) {
      level.floors = data['floors'].map((floor: any) => EditorFloor.fromYAML(floor));
    }

    for (const layer_name in data['layers']) {
      level.images.push(EditorImage.fromLayerYAML(layer_name, data['layers'][layer_name]));
    }

    if (data['lanes']) {
      level.lanes = data['lanes'].map((lane: any) => Lane.fromYAML(lane));
    }

    if (data['models']) {
      level.models = data['models'].map((model: any) => EditorModel.fromYAML(model));
    }

    if (data['measurements']) {
      level.measurements = data['measurements'].map((measurement: any) => EditorMeasurement.fromYAML(measurement));
    }

    if (data['vertices']) {
      level.vertices = data['vertices'].map((vertex: any) => Vertex.fromYAML(vertex, coord_scale));
    }

    if (data['walls']) {
      level.walls = data['walls'].map((wall: any) => EditorWall.fromYAML(wall));
    }

    // if we're in the web_mercator system, we need to scale everything
    // up by 1000 so that we can use OrbitControls out-of-the-box

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

    const coord_scale = CoordinateSystemScale(this.coordinateSystem);
    console.log(`Level.toYAML() coord_scale = ${coord_scale}`);

    node.add({ key: 'elevation', value: this.elevation });
    node.add({ key: 'features', value: this.features.map(feature => feature.toYAML(coord_scale)) });
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

    node.add({ key: 'vertices', value: this.vertices.map(vertex => vertex.toYAML(coord_scale)) });

    node.add({ key: 'walls', value: this.walls.map(wall => wall.toYAML()) });
    return node;
  }

  calculateScale(): void {
    // if the coordinate system is defined as "Legacy", that means it's
    // scaled relative to pixels of some "reference" image.
    if (this.coordinateSystem === CoordinateSystem.Legacy) {
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
    else {
      // other coordinate systems don't need this arbitrary pixel-scaling.
      this.scale = 1.0;
    }
  }

  transformPoint(x: number, y: number): [number, number] {
    return [
      x * this.scale,
      y * this.scale,
    ];
  }

  inverseTransformPoint(x: number, y: number): [number, number] {
    return [
      x / this.scale,
      y / this.scale,
    ];
  }

  getCenterXY(): [number, number] {
    return [0, 0];  // todo: calculate center point
  }
}
