import React from 'react';
import { Building, Level, Vertex } from './Building';
import { BuildingContext } from './BuildingContext';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

export default function BuildingSummary(): JSX.Element {
  const building = React.useContext<Building>(BuildingContext);
  if (!building.filename)
    return (
      <p>No building loaded.</p>
    );

  let node_idx = 10;
  
  const renderVertex = (vertex: Vertex): JSX.Element => {
    node_idx = node_idx + 1;
    const label = "(" + vertex.x + ", " + vertex.y + ") name: " + vertex.name;
    return (
      <TreeItem
        key={node_idx}
        nodeId={String(node_idx)}
        label={label} />
    );
  }

  const renderLevel = (level: Level): JSX.Element => {
    node_idx = node_idx + 2;
    return (
      <TreeItem key={3} nodeId={String(3)} label={level.name}>
        <TreeItem key="vertices" nodeId={"vertices"} label="vertices">
          {level.vertices.map((vertex) => renderVertex(vertex))}
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
