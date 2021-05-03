import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import OpenDialog from './OpenDialog';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar
}));

export default function App(props: React.PropsWithChildren<{}>): JSX.Element {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [openDialogOpen, setOpenDialogOpen] = React.useState(false);

  const classes = useStyles(props);

  const menuClick = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  }

  const menuClose = () => {
    setMenuAnchorEl(null);
  }

  const menuOpen = () => {
    setOpenDialogOpen(true);
    setMenuAnchorEl(null);
  }

  const onOpenDialogClose = () => {
    setOpenDialogOpen(false);
  }

  const onOpenDialogOpen = () => {
    window.alert('open it now');
    setOpenDialogOpen(false);
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <ToolBar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={menuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            keepMounted
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={menuClose}
            getContentAnchorEl={null}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            transformOrigin={{vertical: 'top', horizontal: 'center'}}
          >
            <MenuItem onClick={menuOpen}>Open Building Map</MenuItem>
          </Menu>
          <Typography
            variant="h5"
            color="inherit"
            className={classes.flex}
          >
            Traffic Editor
          </Typography>
        </ToolBar>
      </AppBar>
      <div className={classes.toolbarMargin} />
      <OpenDialog open={openDialogOpen} onOpen={onOpenDialogOpen} onCancel={onOpenDialogClose} />
      <div>
        hello world
      </div>
    </div>
  );
}
