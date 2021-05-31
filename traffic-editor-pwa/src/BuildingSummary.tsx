import React from 'react';
import { useStore, EditorWall, EditorLane, EditorFloor, EditorLevel, EditorVertex, EditorParam } from './EditorStore'
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

export default function BuildingSummary(): JSX.Element {
  const building = useStore(state => state.building);
  const setSelection = useStore(state => state.setSelection);

  if (building.name === '') {
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
 
  const renderFloor = (floor: EditorFloor): JSX.Element => {
    let label = 'floor (';
    label += floor.vertex_indices.map((idx) => idx.toString()).join(', ') + ')';
    return(
      <TreeItem
        nodeId={floor.uuid}
        key={floor.uuid}
        label={label}
        onClick={(event) => {
          setSelection(floor);
        }}
      >
        {floor.params.map((param) => renderParam(param))}
      </TreeItem>
    );
  }

  const renderWall = (wall: EditorWall): JSX.Element => {
    let label = `(${wall.start_idx} => ${wall.end_idx})`;
    return(
      <TreeItem
        nodeId={wall.uuid}
        key={wall.uuid}
        onClick={(event) => {
          setSelection(wall);
        }}
        label={label} />
    );
  }

  const renderLane = (lane: EditorLane): JSX.Element => {
    let label = `(${lane.start_idx} => ${lane.end_idx})`;
    return(
      <TreeItem
        nodeId={lane.uuid}
        key={lane.uuid}
        label={label}
        onClick={(event) => {
          setSelection(lane);
        }}
      />
    );
  }

  const renderParam = (param: EditorParam): JSX.Element => {
    return (
      <TreeItem
        nodeId={param.uuid}
        key={param.uuid}
        label={`${param.name}=${param.value}`} />
    );
  }

  const renderVertex = (vertex: EditorVertex): JSX.Element => {
    let label = "(" + vertex.x + ", " + vertex.y + ")";
    if (vertex.name)
      label = vertex.name + ': ' + label;
    return (
      <TreeItem
        nodeId={vertex.uuid}
        key={vertex.uuid}
        onClick={(event) => {
          setSelection(vertex);
        }}
        label={label}>
        {vertex.params.map((param) => renderParam(param))}
      </TreeItem>
    );
  }

  const renderLevel = (level: EditorLevel): JSX.Element => {
    return (
      <TreeItem nodeId={level.uuid} key={level.uuid} label={level.name}>
        <TreeItem nodeId={level.uuid + '_vertices'} label="vertices">
          {level.vertices.map((vertex) => renderVertex(vertex))}
        </TreeItem>
        <TreeItem nodeId={level.uuid + '_lanes'} label="lanes">
          {level.lanes.map((lane) => renderLane(lane))}
        </TreeItem>
        <TreeItem nodeId={level.uuid + '_walls'} label="walls">
          {level.walls.map((wall) => renderWall(wall))}
        </TreeItem>
        <TreeItem nodeId={level.uuid + '_floors'} label="floors">
          {level.floors.map((floor) => renderFloor(floor))}
        </TreeItem>
      </TreeItem>
    );
  }

  // defaultExpanded={[building.uuid + '_levels']}
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId={building.uuid + '_name'} label={"name: " + building.name} />
      <TreeItem nodeId={building.uuid + '_levels'} label="levels">
        {building.levels.map((level) => renderLevel(level))}
      </TreeItem>
    </TreeView>
  );

  /*
  return (
    <div>building summary goes here</div>
  );
  */
}
