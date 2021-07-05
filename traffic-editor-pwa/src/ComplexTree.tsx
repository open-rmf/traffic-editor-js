import React from 'react';
import {
  EditorConstraint,
  EditorDoor,
  EditorFloor,
  EditorImage,
  EditorLane,
  EditorMeasurement,
  EditorModel,
  EditorWall,
  setSelection,
  useStore,
} from './Store';
import { EditorParam } from './EditorParam';
import { Building } from './Building';
import { Level } from './Level';
import { Vertex } from './Vertex';
import { Feature } from './Feature';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function FeatureTreeItem(props: { feature: Feature }): JSX.Element {
  const setStore = useStore(state => state.set);
  return (
    <TreeItem
      nodeId={props.feature.uuid}
      key={props.feature.uuid}
      label={`${props.feature.x}, ${props.feature.y}`}
      onClick={(event) => {
        setSelection(setStore, props.feature);
      }}
    >
    </TreeItem>
  );
}

function ModelTreeItem(props: { model: EditorModel }): JSX.Element {
  const setStore = useStore(state => state.set);
  return (
    <TreeItem
      nodeId={props.model.uuid}
      key={props.model.uuid}
      label={`${props.model.instance_name}`}
      onClick={(event) => {
        setSelection(setStore, props.model);
      }}
    >
    </TreeItem>
  );
}


function ConstraintTreeItem(props: { constraint: EditorConstraint }): JSX.Element {
  const setStore = useStore(state => state.set);
  return (
    <TreeItem
      nodeId={props.constraint.uuid}
      key={props.constraint.uuid}
      label={`${props.constraint.ids[0].substring(1, 9)} - ${props.constraint.ids[1].substring(1, 9)}`}
      onClick={(event) => {
        setSelection(setStore, props.constraint);
      }}
    >
      {props.constraint.params.map((param) => <ParamTreeItem param={param} />)}
    </TreeItem>
  );
}

function DoorTreeItem(props: { door: EditorDoor }): JSX.Element {
  const setStore = useStore(state => state.set);
  const label = `(${props.door.start_idx} => ${props.door.end_idx})`;
  return(
    <TreeItem
      nodeId={props.door.uuid}
      key={props.door.uuid}
      onClick={(event) => {
        setSelection(setStore, props.door);
      }}
      label={label} />
  );
}

function ParamTreeItem(props: { param: EditorParam }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.param.uuid}
      key={props.param.uuid}
      label={`${props.param.name} = ${props.param.value}`}
    />
  );
}

function ImageTreeItem(props: { image: EditorImage }): JSX.Element {
  const setStore = useStore(state => state.set);
  return (
    <TreeItem
      nodeId={props.image.uuid}
      key={props.image.uuid}
      label={props.image.filename}
      onClick={(event) => {
        setSelection(setStore, props.image);
      }}
    >
      {props.image.params.map((param) => <ParamTreeItem param={param} />)}
      <TreeItem
        nodeId={`${props.image.uuid}_features`}
        key={`${props.image.uuid}_features`}
        label="features"
      >
        {props.image.features.map((feature) => <FeatureTreeItem feature={feature} />)}
      </TreeItem>
    </TreeItem>
  );
}

function FloorTreeItem(props: { floor: EditorFloor }): JSX.Element {
  const setStore = useStore(state => state.set);
  const label = 'floor (' + props.floor.vertex_indices.map((idx) => idx.toString()).join(', ') + ')';
  return(
    <TreeItem
      nodeId={props.floor.uuid}
      key={props.floor.uuid}
      label={label}
      onClick={(event) => {
        setSelection(setStore, props.floor);
      }}
    >
      {props.floor.params.map((param) => <ParamTreeItem param={param} />)}
    </TreeItem>
  );
}

function WallTreeItem(props: { wall: EditorWall }): JSX.Element {
  const setStore = useStore(state => state.set);
  const label = `(${props.wall.start_idx} => ${props.wall.end_idx})`;
  return(
    <TreeItem
      nodeId={props.wall.uuid}
      key={props.wall.uuid}
      onClick={(event) => {
        setSelection(setStore, props.wall);
      }}
      label={label} />
  );
}

function MeasurementTreeItem(props: { measurement: EditorMeasurement }): JSX.Element {
  const setStore = useStore(state => state.set);
  const label = `(${props.measurement.start_idx}-${props.measurement.end_idx}) = ${props.measurement.distance}`;
  return(
    <TreeItem
      nodeId={props.measurement.uuid}
      key={props.measurement.uuid}
      onClick={(event) => {
        setSelection(setStore, props.measurement);
      }}
      label={label} />
  );
}

function LaneTreeItem(props: { lane: EditorLane }): JSX.Element {
  const setStore = useStore(state => state.set);
  const label = `(${props.lane.start_idx} => ${props.lane.end_idx})`;
  return(
    <TreeItem
      nodeId={props.lane.uuid}
      key={props.lane.uuid}
      label={label}
      onClick={(event) => {
        setSelection(setStore, props.lane);
      }}
    />
  );
}

function VertexTreeItem(props: { vertex: Vertex }): JSX.Element {
  const setStore = useStore(state => state.set);
  let label = "(" + props.vertex.x + ", " + props.vertex.y + ")";
  if (props.vertex.name)
    label = props.vertex.name + ': ' + label;
  return (
    <TreeItem
      nodeId={props.vertex.uuid}
      key={props.vertex.uuid}
      onClick={(event) => {
        setSelection(setStore, props.vertex);
      }}
      label={label}>
      {props.vertex.params.map((param) => <ParamTreeItem param={param} />)}
    </TreeItem>
  );
}

function LevelTreeItem(props: { level: Level }): JSX.Element {
  const setStore = useStore(state => state.set);
  return (
    <TreeItem
      nodeId={props.level.uuid}
      key={props.level.uuid}
      label={props.level.name}
      onClick={(event) => {
        setSelection(setStore, props.level);
      }}>

      <TreeItem nodeId={props.level.uuid + '_constraints'} label="constraints">
        {props.level.constraints.map(constraint => <ConstraintTreeItem constraint={constraint} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_doors'} label="doors">
        {props.level.doors.map(door => <DoorTreeItem door={door} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_features'} label="features">
        {props.level.features.map(feature => <FeatureTreeItem feature={feature} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_floors'} label="floors">
        {props.level.floors.map(floor => <FloorTreeItem floor={floor} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_images'} label="images">
        {props.level.images.map(image => <ImageTreeItem image={image} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_lanes'} label="lanes">
        {props.level.lanes.map(lane => <LaneTreeItem lane={lane} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_measurements'} label="measurements">
        {props.level.measurements.map(measurement => <MeasurementTreeItem measurement={measurement} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_models'} label="models">
        {props.level.models.map(model => <ModelTreeItem model={model} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_vertices'} label="vertices">
        {props.level.vertices.map(vertex => <VertexTreeItem vertex={vertex} /> )}
      </TreeItem>
      <TreeItem nodeId={props.level.uuid + '_walls'} label="walls">
        {props.level.walls.map(wall => <WallTreeItem wall={wall} /> )}
      </TreeItem>
    </TreeItem>
  );
}

function BuildingTreeItem(props: { building: Building }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.building.uuid}
      key={props.building.uuid}
      label={props.building.name}
    >
      <TreeItem
        nodeId={props.building.uuid + '_ref'}
        label={"reference level: " + props.building.reference_level_name }
      />
      <TreeItem nodeId={props.building.uuid + '_levels'} label="levels">
        {props.building.levels.map(level => <LevelTreeItem level={level} /> )}
      </TreeItem>
    </TreeItem>
  );
}

export function ComplexTree(): JSX.Element {
  const complex = useStore(state => state.complex);

  if (complex.name === '') {
    return (
      <div style={{margin: '1em'}}>
        <p>
          No map loaded.
        </p>
        <p>
          To load a map, click the menu icon in the upper-left.
        </p>
      </div>
    );
  }
 
  // defaultExpanded={[building.uuid + '_levels']}
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId={complex.uuid + '_name'} label={"complex name: " + complex.name} />
      <TreeItem nodeId={complex.uuid + '_buildings'} label="buildings">
        {complex.buildings.map(building => <BuildingTreeItem building={building} /> )}
      </TreeItem>
    </TreeView>
  );
}
