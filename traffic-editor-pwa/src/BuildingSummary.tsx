import React from 'react';
import { Level, Vertex, Wall } from './Building';
import { BuildingContext } from './BuildingContext';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

export default function BuildingSummary(): JSX.Element {
  const { building } = React.useContext(BuildingContext);
  if (!building.filename)
    return (
      <p>No building loaded.</p>
    );

  let node_idx = 10;
  
  const renderVertex = (vertex: Vertex): JSX.Element => {
    node_idx = node_idx + 1;
    let label = "(" + vertex.x + ", " + vertex.y + ")";
    if (vertex.name)
      label += " name: " + vertex.name;
    if (vertex.params.length) {
      for (const param of vertex.params) {
        label += ` ${param.name}=${param.value}`;
      }
    }
    return (
      <TreeItem
        key={node_idx}
        nodeId={String(node_idx)}
        label={label} />
    );
  }

  const renderWall = (wall: Wall): JSX.Element => {
    node_idx = node_idx + 1;
    let label = `(${wall.start_idx} => ${wall.end_idx})`;
    return(
      <TreeItem
        key={node_idx}
        nodeId={String(node_idx)}
        label={label} />
    );
  }

  const renderLevel = (level: Level): JSX.Element => {
    node_idx = node_idx + 3;
    return (
      <TreeItem key={node_idx-3} nodeId={String(node_idx-3)} label={level.name}>
        <TreeItem key={node_idx-2} nodeId={String(node_idx-2)} label="vertices">
          {level.vertices.map((vertex) => renderVertex(vertex))}
        </TreeItem>
        <TreeItem key={node_idx-1} nodeId={String(node_idx-1)} label="walls">
          {level.walls.map((wall) => renderWall(wall))}
        </TreeItem>
      </TreeItem>
    );
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={["2"]}
    >
      <TreeItem nodeId="0" label={"name: " + building.name} />
      <TreeItem nodeId="1" label={"filename: " + building.filename} />
      <TreeItem nodeId="2" label="levels">
        {building.levels.map((level) => renderLevel(level))}
      </TreeItem>
    </TreeView>
  );
}
