import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import BuildingSummary from './BuildingSummary';
import { EditorScene } from './EditorScene';
import PropertyEditor from './PropertyEditor';
import MainMenu from './MainMenu';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  workingArea: {
    backgroundColor: "black",
    height: `calc(100vh - 64px)`,
  },
  gridLeftColumn: {
    borderRight: '5px',
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.primary.main,
  },
  propertyGridItem: {
    borderTop: '5px',
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.primary.main,
  }
}));

export default function App(props: React.PropsWithChildren<{}>): JSX.Element {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <MainMenu />
      <div className={classes.toolbarMargin} />
      <Grid container spacing={0}>
        <Grid className={classes.gridLeftColumn} container xs={3} direction="column" spacing={0}>
          <Grid item style={{height: '40vh', overflow: 'auto'}}>
            <BuildingSummary />
          </Grid>
          <Grid item className={classes.propertyGridItem} style={{height: '40vh', overflow: 'auto'}}>
            <PropertyEditor />
          </Grid>
        </Grid>
        <Grid item xs={9} className={classes.workingArea}>
          <EditorScene />
        </Grid>
      </Grid>
    </div>
  );
}
