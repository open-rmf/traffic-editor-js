import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Directory from './Directory';
import './App.css';

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles(props);

  const menuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  }

  const menuClose = () => {
    setAnchorEl(null);
  }

  const menuOpen = () => {
    window.alert('hello');
    setAnchorEl(null);
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
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={menuClose}
          >
            <MenuItem onClick={menuOpen}>Open</MenuItem>
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
      <Directory>
      </Directory>
      <div>
        hello world
      </div>
    </div>
  );
}
