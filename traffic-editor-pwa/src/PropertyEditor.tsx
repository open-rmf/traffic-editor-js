import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { BuildingContext } from './BuildingContext';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme: Theme) => ({
  noBuildingDiv: {
  },
  table: {
    padding: '0px',
    margin: '0px'
  },
  tableHead: {
  },
  tableHeadRow: {
    borderBottomStyle: 'solid',
    borderBottom: '1px',
    borderBottomColor: theme.palette.primary.main,
  },
  tableHeadCell: {
    fontWeight: 'bold',
    padding: '0px',
    paddingLeft: '5px',
  },
  tableCell: {
    padding: '0px',
    paddingLeft: '5px',
  }
}));

export default function PropertyEditor(): JSX.Element {
  const classes = useStyles();
  const { building } = React.useContext(BuildingContext);

  console.log('PropertyEditor()');

  if (!building.valid()) {
    return (
      <div className={classes.noBuildingDiv}>
      </div>
    );
  }

  if (!building.selection) {
    return (
      <div className={classes.noBuildingDiv}>
      </div>
    );
  }

  let rows = building.selection.params.map((param) => (
    <TableRow>
      <TableCell className={classes.tableCell}>{param.name}</TableCell>
      <TableCell className={classes.tableCell}>{param.value.toString()}</TableCell>
    </TableRow>
  ));

  // todo: add any other class-specific stuff

  return (
    <Table className={classes.table}>
      <TableHead className={classes.tableHead}>
        <TableRow className={classes.tableHeadRow}>
          <TableCell className={classes.tableHeadCell}>Property Name</TableCell>
          <TableCell className={classes.tableHeadCell}>Property Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
}
