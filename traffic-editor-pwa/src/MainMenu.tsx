import React, { useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import ToolBar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { useStore, EditorToolID, setEditorMode, clearSelection, setActiveTool } from './Store';
import OpenDialog from './OpenDialog';
import { YAMLRetriever, YAMLRetrieveDemo, YAMLSender } from './YAMLParser';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import PanToolIcon from '@material-ui/icons/PanTool';

import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(0.5),
    marginRight: 5
  },
  grouped: {
    //marginRight: theme.spacing(0.5),
    //marginLeft: theme.spacing(0.5),
    //margin: theme.spacing(0.5),
    color: theme.palette.primary.contrastText,
    //background: theme.palette.primary.dark,
    "&.Mui-selected:hover, &:hover": {
      background: theme.palette.primary.dark,
    },
    "&.Mui-selected": {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText
    },
    /*
    '&:not(:first-child)': {
      borderRadius: '5px',
    },
    '&:first-child': {
      borderRadius: '5px',
    },
    */
  },
}))(ToggleButtonGroup);

const useStyles = makeStyles((theme: Theme) => ({
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appTitle: {
    marginRight: 20
  },
  filler: {
    flex: 1
  }
}));


export default function MainMenu(props: React.PropsWithChildren<{}>): JSX.Element {
  const classes = useStyles(props);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [mapType, setMapType] = React.useState('');
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const activeTool = useStore(state => state.activeTool);
  //const setEditorMode = useStore(state => state.setEditorMode);
  //const setActiveTool = useStore(state => state.setActiveTool);
  //const clearSelection = useStore(state => state.clearSelection);

  const onModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      setEditorMode(setStore, newMode);
      clearSelection(setStore);
    }
  };

  const onToolChange = (event: React.MouseEvent<HTMLElement>, newTool: EditorToolID | null) => {
    if (newTool !== null) {
      setActiveTool(setStore, newTool);
      clearSelection(setStore);
    }
  }

  const save = useCallback(
    async () => {
      if (mapType === 'local_file') {
        setSnackMessage('Cannot save. Local file save not yet implemented.');
        setSnackOpen(true);
      }
      else if (mapType === 'local_rest') {
        try {
          await YAMLSender('http://localhost:8000/map_file');
        } catch (error) {
          setSnackMessage('Error while saving to local REST server');
          setSnackOpen(true);
        }
      }
      else if (mapType === 'demo') {
        setSnackMessage('Cannot save. Demo maps are read-only.');
        setSnackOpen(true);
      }
      else {
        setSnackMessage('Cannot save. No map loaded.');
        setSnackOpen(true);
      }
    },
    [mapType]
  );

  const snackClose = () => {
    setSnackOpen(false);
  }

  React.useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      let key = event.key.toLowerCase();
      if (key === 'm') {
        setActiveTool(setStore, EditorToolID.MOVE);
        clearSelection(setStore);
      } else if (key === 'escape') {
        setActiveTool(setStore, EditorToolID.SELECT);
        clearSelection(setStore);
      } else if (key === 's' && event.ctrlKey) {
        event.preventDefault();
        save();
        return false;
      }
    };

    window.addEventListener('keydown', keyDown);
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, [setStore, save]);

  return (
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
          transitionDuration={0.0}
        >
          <MenuItem
            onClick={async () => {
              try {
                await YAMLRetriever('http://localhost:8000/', 'map_file');
                setMapType('local_rest');
              } catch (error) {
                setSnackMessage('could not open file from localhost:8000');
                setSnackOpen(true);
              }
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText>
              Open map from localhost:8000
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await YAMLRetrieveDemo('office');
              setMapType('demo');
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText>
              Open demo map
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsOpenDialogOpen(true);
              setMapType('local_file');
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>
            <ListItemText>
              Open map from local file...
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              save();
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText>
              Save
            </ListItemText>
          </MenuItem>
        </Menu>
        <Typography variant="h6" color="inherit" className={classes.appTitle}>
          Traffic Editor
        </Typography>
        <div className={classes.filler} />
        <StyledToggleButtonGroup
          value={activeTool}
          size="small"
          exclusive
          onChange={onToolChange}
          aria-label="tool"
        >
          <ToggleButton value={EditorToolID.SELECT}>
            <Tooltip title="Select tool [Escape]">
              <PanToolIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={EditorToolID.MOVE}>
            <Tooltip title="Move tool [m]">
              <OpenWithIcon />
            </Tooltip>
          </ToggleButton>
        </StyledToggleButtonGroup>
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
      <OpenDialog
        open={isOpenDialogOpen}
        onOpen={() => setIsOpenDialogOpen(false)}
        onCancel={() => setIsOpenDialogOpen(false)}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={snackOpen}
        onClose={snackClose}
        autoHideDuration={2000}
        transitionDuration={0}
        TransitionProps={{
          appear: false,
        }}
        action={
          <React.Fragment>
            <IconButton onClick={snackClose}>
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={snackClose}>
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </AppBar>
  );
}
