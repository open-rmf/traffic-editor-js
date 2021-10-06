import React from 'react';
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
import { useStore, setEditorMode, clearSelection, setActiveTool, saveStore } from './Store';
import { ToolID } from './ToolID';
import { Site } from './Site';
import OpenDialog from './OpenDialog';
import NewDialog from './NewDialog';
import MqttDialog from './MqttDialog';
import { Retriever, RetrieveDemo } from './Parser';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import PanToolIcon from '@material-ui/icons/PanTool';
import RouterIcon from '@material-ui/icons/Router';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import TextureIcon from '@material-ui/icons/Texture';

import * as THREE from 'three';

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
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isMqttDialogOpen, setIsMqttDialogOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const setStore = useStore(state => state.set);
  const editorMode = useStore(state => state.editorMode);
  const activeTool = useStore(state => state.activeTool);
  const disableEditorTools = useStore(state => state.disableEditorTools);

  const onModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      if (editorMode === '2d') {
        /*
        const x = store.cameraPose.position.x;
        const y = store.cameraPose.position.y;
        console.log(`previous 2d center point: ${x}, ${y}`);
         */
        setStore(state => {
          state.cameraInitialPose = {
            position: new THREE.Vector3(state.cameraPose.position.x + 2, state.cameraPose.position.y - 2, 10),
            target: new THREE.Vector3(state.cameraPose.position.x, state.cameraPose.position.y, 0),
            zoom: 20,
          };
        });
      }
      setEditorMode(setStore, newMode);
      clearSelection(setStore);
    }
  };

  const onToolChange = (event: React.MouseEvent<HTMLElement>, newTool: ToolID | null) => {
    if (newTool !== null) {
      setActiveTool(newTool);
      clearSelection(setStore);
    }
  }

  React.useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === undefined)
        return;  // somehow this happens sometimes

      let key = event.key.toLowerCase();
      if (key === 's' && event.ctrlKey) {
        event.preventDefault();
        saveStore();
        return false;
      }
    };

    window.addEventListener('keydown', keyDown);
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, []);

  const snackClose = () => {
    setSnackOpen(false);
  }

  React.useEffect(() => {
    setStore(state => {
      state.enableMotionControls = (activeTool === ToolID.SELECT);
    });
  }, [activeTool, setStore]);

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
            onClick={() => {
              setIsNewDialogOpen(true);
              useStore.setState({ mapType: 'local_file' });
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText>
              New site map...
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              const site = Site.fromNewCommand();
              const cameraInitialPose = site.computeInitialCameraPose();
              useStore.setState({
                site: site,
                selection: null,
                cameraInitialPose: cameraInitialPose,
              });
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText>
              New geo-located site
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={async () => {
              try {
                await Retriever('http://localhost:8000/', 'map_file');
                useStore.setState({ mapType: 'local_rest' });
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
              await RetrieveDemo('office');
              useStore.setState({ mapType: 'demo' });
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
              useStore.setState({ mapType: 'local_file' });
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
              saveStore();
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
          <Divider />
          <MenuItem
            onClick={() => {
              setIsMqttDialogOpen(true);
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <RouterIcon />
            </ListItemIcon>
            <ListItemText>
              Connect MQTT...
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
          <ToggleButton value={ToolID.SELECT}>
            <Tooltip title="Select tool [Escape]">
              <PanToolIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ToolID.MOVE} disabled={disableEditorTools}>
            <Tooltip title="Move tool [M]">
              <OpenWithIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ToolID.ADD_VERTEX} disabled={disableEditorTools}>
            <Tooltip title="Add vertex [V]">
              <AddCircleIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ToolID.ADD_LANE} disabled={disableEditorTools}>
            <Tooltip title="Add lane [L]">
              <DirectionsCarIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={ToolID.ADD_WALL} disabled={disableEditorTools}>
            <Tooltip title="Add wall [W]">
              <TextureIcon />
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
          <ToggleButton value="3d">
            3D
          </ToggleButton>
          <ToggleButton value="2d">
            2D
          </ToggleButton>
        </StyledToggleButtonGroup>
      </ToolBar>
      <NewDialog
        open={isNewDialogOpen}
        onNew={() => {}}
        onCancel={() => setIsNewDialogOpen(false)}
        close={() => setIsNewDialogOpen(false)}
      />
      <OpenDialog
        open={isOpenDialogOpen}
        onOpen={() => setIsOpenDialogOpen(false)}
        onCancel={() => setIsOpenDialogOpen(false)}
      />
      <MqttDialog
        open={isMqttDialogOpen}
        close={() => setIsMqttDialogOpen(false)}
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
