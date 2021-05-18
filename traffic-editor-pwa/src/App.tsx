import React from 'react';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import OpenDialog from './OpenDialog';
import BuildingSummary from './BuildingSummary';
import { BuildingContext } from './BuildingContext';
import { BuildingDefault, BuildingLoadFromServer, BuildingLoadDemo } from './Building';
import EditorScene from './EditorScene';

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
}));

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0.5)
  },
  grouped: {
    color: theme.palette.primary.contrastText,
    //background: theme.palette.primary.dark,
    "&.Mui-selected:hover, &:hover": {
      background: theme.palette.primary.light,
    },
    "&.Mui-selected": {
      background: theme.palette.primary.light,
      color: theme.palette.primary.contrastText
    },
    '&:not(:first-child)': {
      borderRadius: '5px',
    },
    '&:first-child': {
      borderRadius: '5px',
    },
  }
}))(ToggleButtonGroup);

export default function App(props: React.PropsWithChildren<{}>): JSX.Element {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = React.useState(false);
  const [building, updateBuilding] = React.useState(BuildingDefault);
  const [editorMode, setEditorMode] = React.useState<string | null>('3d');

  const onModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null)
      setEditorMode(newMode);
  };

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <BuildingContext.Provider value={{ building, updateBuilding }}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={(e: any) => { setMenuAnchorEl(e.currentTarget); }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={() => setMenuAnchorEl(null)}
              getContentAnchorEl={null}
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              transformOrigin={{vertical: 'top', horizontal: 'center'}}
            >
              <MenuItem
                onClick={async () => {
                  updateBuilding(await BuildingLoadFromServer());
                  setMenuAnchorEl(null);
                }}
              >
                Open map from localhost:8000
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  updateBuilding(await BuildingLoadDemo('office'));
                  setMenuAnchorEl(null);
                }}
              >
                Open demo map
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsOpenDialogOpen(true);
                  setMenuAnchorEl(null);
                }}
              >
                Open map from local file...
              </MenuItem>
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              Traffic Editor
            </Typography>
            <StyledToggleButtonGroup
              value={editorMode}
              size="small"
              exclusive
              onChange={onModeChange}
              aria-label="editor mode"
            >
              <ToggleButton value="3d">3D</ToggleButton>
              <ToggleButton value="2d">2D</ToggleButton>
            </StyledToggleButtonGroup>
          </ToolBar>
        </AppBar>
        <div className={classes.toolbarMargin} />
        <OpenDialog
          open={isOpenDialogOpen}
          onOpen={() => setIsOpenDialogOpen(false)}
          onCancel={() => setIsOpenDialogOpen(false)}
        />
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <BuildingSummary />
          </Grid>
          <Grid item xs={9} className={classes.workingArea}>
            <EditorScene />
          </Grid>
        </Grid>
      </BuildingContext.Provider>
    </div>
  );
}
