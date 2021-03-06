import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useStore } from './Store';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropertyEditorParam from './PropertyEditorParam';
import PropertyEditorProp from './PropertyEditorProp';

const useStyles = makeStyles((theme: Theme) => ({
  noSelectionDiv: {
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

/*
      <TableHead className={classes.tableHead}>
        <TableRow className={classes.tableHeadRow}>
          <TableCell className={classes.tableHeadCell}>Property Name</TableCell>
          <TableCell className={classes.tableHeadCell}>Property Value</TableCell>
        </TableRow>
      </TableHead>
 */

export default function PropertyEditor(): JSX.Element {
  const classes = useStyles();
  const selection = useStore(state => state.selection);
  useStore(state => state.propertyRepaintCount);  // repaint during tool moves

  if (!selection) {
    return (<div className={classes.noSelectionDiv}></div>);
  }

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableCell className={classes.tableHeadCell}>{selection.object_type_name}</TableCell>
        <TableCell className={classes.tableHeadCell}></TableCell>
      </TableHead>
      <TableBody>
        {selection.props.map(prop =>
          <TableRow>
            <TableCell className={classes.tableCell}>{prop.name}</TableCell>
            <TableCell key={prop.name + '_control'} className={classes.tableCell}>
              <PropertyEditorProp prop={prop} />
            </TableCell>
          </TableRow>
        )}
        {selection.params.map(param =>
          <TableRow>
            <TableCell className={classes.tableCell}>{param.name}</TableCell>
            <TableCell key={param.name + '_control'} className={classes.tableCell}>
              <PropertyEditorParam param={param} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
