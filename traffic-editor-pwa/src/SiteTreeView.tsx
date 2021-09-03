import React from 'react';
import {
  EditorConstraint,
  EditorDoor,
  EditorFloor,
  EditorImage,
  EditorMeasurement,
  EditorModel,
  EditorWall,
  setSelection,
  useStore,
} from './Store';
import { EditorParam } from './EditorParam';
import { Graph } from './Graph';
import { Lane } from './Lane';
import { Level } from './Level';
import { Vertex } from './Vertex';
import { Feature } from './Feature';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function FeatureTreeItem(props: { feature: Feature }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.feature.uuid}
      key={props.feature.uuid}
      label={`${props.feature.x}, ${props.feature.y}`}
      onClick={(event) => {
        setSelection(props.feature);
      }}
    >
    </TreeItem>
  );
}

function GraphTreeItem(props: { graph: Graph }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.graph.uuid}
      key={props.graph.uuid}
      label={`${props.graph.id}: ${props.graph.name}`}
      onClick={(event) => {
        setSelection(props.graph);
      }}
    >
    </TreeItem>
  );
}

function ModelTreeItem(props: { model: EditorModel }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.model.uuid}
      key={props.model.uuid}
      label={`${props.model.instance_name}`}
      onClick={(event) => {
        setSelection(props.model);
      }}
    >
    </TreeItem>
  );
}

function ConstraintTreeItem(props: { constraint: EditorConstraint }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.constraint.uuid}
      key={props.constraint.uuid}
      label={`${props.constraint.ids[0].substring(1, 9)} - ${props.constraint.ids[1].substring(1, 9)}`}
      onClick={(event) => {
        setSelection(props.constraint);
      }}
    >
      {props.constraint.params.map((param) => <ParamTreeItem param={param} />)}
    </TreeItem>
  );
}

function DoorTreeItem(props: { door: EditorDoor }): JSX.Element {
  const label = `(${props.door.start_idx} => ${props.door.end_idx})`;
  return(
    <TreeItem
      nodeId={props.door.uuid}
      key={props.door.uuid}
      onClick={(event) => {
        setSelection(props.door);
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
  return (
    <TreeItem
      nodeId={props.image.uuid}
      key={props.image.uuid}
      label={props.image.filename}
      onClick={(event) => {
        setSelection(props.image);
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
  const label = 'floor (' + props.floor.vertex_indices.map((idx) => idx.toString()).join(', ') + ')';
  return(
    <TreeItem
      nodeId={props.floor.uuid}
      key={props.floor.uuid}
      label={label}
      onClick={(event) => {
        setSelection(props.floor);
      }}
    >
      {props.floor.params.map((param) => <ParamTreeItem param={param} />)}
    </TreeItem>
  );
}

function WallTreeItem(props: { wall: EditorWall }): JSX.Element {
  const label = `(${props.wall.start_idx} => ${props.wall.end_idx})`;
  return(
    <TreeItem
      nodeId={props.wall.uuid}
      key={props.wall.uuid}
      onClick={(event) => {
        setSelection(props.wall);
      }}
      label={label} />
  );
}

function MeasurementTreeItem(props: { measurement: EditorMeasurement }): JSX.Element {
  const label = `(${props.measurement.start_idx}-${props.measurement.end_idx}) = ${props.measurement.distance}`;
  return(
    <TreeItem
      nodeId={props.measurement.uuid}
      key={props.measurement.uuid}
      onClick={(event) => {
        setSelection(props.measurement);
      }}
      label={label} />
  );
}

function LaneTreeItem(props: { lane: Lane }): JSX.Element {
  const label = `(${props.lane.start_idx} => ${props.lane.end_idx})`;
  return(
    <TreeItem
      nodeId={props.lane.uuid}
      key={props.lane.uuid}
      label={label}
      onClick={(event) => {
        setSelection(props.lane, true);
      }}
    />
  );
}

function VertexTreeItem(props: { vertex: Vertex }): JSX.Element {
  let label = "(" + props.vertex.x + ", " + props.vertex.y + ")";
  if (props.vertex.name)
    label = props.vertex.name;
  return (
    <TreeItem
      nodeId={props.vertex.uuid}
      key={props.vertex.uuid}
      onClick={(event) => {
        setSelection(props.vertex, true);
      }}
      label={label}>
    </TreeItem>
  );
}

function LevelTreeItem(props: { level: Level }): JSX.Element {
  return (
    <TreeItem
      nodeId={props.level.uuid}
      key={props.level.uuid}
      label={props.level.name}
      onClick={(event) => {
        setSelection(props.level);
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

export function SiteTreeView(): JSX.Element {
  const site = useStore(state => state.site);

  if (site.name === '') {
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
      <TreeItem
        nodeId={site.uuid + '_name'}
        key={site.uuid + '_name'}
        label={"site name: " + site.name}
        onClick={(event) => {
          setSelection(site);
        }}>
      </TreeItem>

      <TreeItem nodeId={site.uuid + '_filename'} label={"filename: " + site.filename} />
      <TreeItem
        nodeId={site.uuid + '_ref'}
        label={"reference level: " + site.reference_level_name }
      />
      <TreeItem nodeId={site.uuid + '_graphs'} label="graphs">
        {site.graphs.map(graph => <GraphTreeItem graph={graph} /> )}
      </TreeItem>
      <TreeItem nodeId={site.uuid + '_levels'} label="levels">
        {site.levels.map(level => <LevelTreeItem level={level} /> )}
      </TreeItem>
    </TreeView>
  );
}
