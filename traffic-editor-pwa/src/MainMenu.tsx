import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
//import { BuildingContext } from './BuildingContext';
import { Building } from './Building';
import { useStore } from './BuildingStore';
import OpenDialog from './OpenDialog';

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(0.5)
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
  }
}))(ToggleButtonGroup);

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
  mainGrid: {
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



export default function MainMenu(props: React.PropsWithChildren<{}>): JSX.Element {
  const classes = useStyles(props);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  //const { updateBuilding } = React.useContext(BuildingContext);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<string>('2d');
  const replaceBuilding = useStore(state => state.replace);

  const onModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null)
      setEditorMode(newMode);
  };

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
              replaceBuilding(await Building.fromURL('http://localhost:8000/map_file'));
              setMenuAnchorEl(null);
            }}
          >
            Open map from localhost:8000
          </MenuItem>
          <MenuItem
            onClick={async () => {
              replaceBuilding(await Building.fromDemo('office'));
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
      <OpenDialog
        open={isOpenDialogOpen}
        onOpen={() => setIsOpenDialogOpen(false)}
        onCancel={() => setIsOpenDialogOpen(false)}
      />
    </AppBar>
  );
}
