import React from 'react';
import { Level, Vertex, Wall, Floor } from './Building';
import { Param } from './Param';
import { BuildingContext } from './BuildingContext';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

export default function BuildingSummary(): JSX.Element {
  const { building } = React.useContext(BuildingContext);

  if (!building.valid()) {
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
 
  const renderParam = (param: Param): JSX.Element => {
    return (
      <TreeItem
        nodeId={param.uuid}
        key={param.uuid}
        label={`${param.name}=${param.value}`} />
    );
  }

  const renderVertex = (vertex: Vertex): JSX.Element => {
    let label = "(" + vertex.x + ", " + vertex.y + ")";
    if (vertex.name)
      label = vertex.name + ': ' + label;
    return (
      <TreeItem
        nodeId={vertex.uuid}
        key={vertex.uuid}
        label={label}>
        {vertex.params.map((param) => renderParam(param))}
      </TreeItem>
    );
  }

  const renderFloor = (floor: Floor): JSX.Element => {
    let label = 'floor (';
    label += floor.vertex_indices.map((idx) => idx.toString()).join(', ') + ')';
    return(
      <TreeItem
        nodeId={floor.uuid}
        key={floor.uuid}
        label={label}
      >
        {floor.params.map((param) => renderParam(param))}
      </TreeItem>
    );
  }

  const renderWall = (wall: Wall): JSX.Element => {
    let label = `(${wall.start_idx} => ${wall.end_idx})`;
    return(
      <TreeItem
        nodeId={wall.uuid}
        key={wall.uuid}
        label={label} />
    );
  }

  const renderLevel = (level: Level): JSX.Element => {
    return (
      <TreeItem nodeId={level.uuid} key={level.uuid} label={level.name}>
        <TreeItem nodeId={level.uuid + '_vertices'} label="vertices">
          {level.vertices.map((vertex) => renderVertex(vertex))}
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
}
