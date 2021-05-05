import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';

import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import BuildingContext from './BuildingContext';

const useStyles = makeStyles((theme: Theme) => ({
  directoryButton: {
    fontSize: theme.typography.h5.fontSize
  },
  filename: {
    fontSize: theme.typography.h5.fontSize,
    textDecoration: 'underline'
  },
  dialog: {
    backgroundColor: theme.palette.background.paper,
  },
}));

type OpenDialogProps = {
  open: boolean;
  onOpen: () => void; //filename: string, handle: FileSystemDirectoryHandle | undefined) => void;
  onCancel: () => void;
};

export default function OpenDialog(props: OpenDialogProps): JSX.Element {
  const classes = useStyles(props);
  const building = useContext(BuildingContext);
  const [buildingFileNames, setBuildingFileNames] = React.useState<string[]>([]);
  const [directoryHandle, setDirectoryHandle] = React.useState<FileSystemDirectoryHandle>();

  const onDirectoryClick = async () => {
    setBuildingFileNames([]);
    const handle = await window.showDirectoryPicker();
    await setDirectoryHandle(handle);
    for await (const entry of handle.values()) {
      if (entry.name.endsWith('.building.yaml'))
        setBuildingFileNames(previous => [...previous, entry.name]);
    }
  }

  const loadFile = async(filename) => {
    await building.load_file(filename, directoryHandle);
    props.onOpen();
  }

  const buildingFileList = () => {
    if (buildingFileNames.length > 0)
      return (
        <div>
          <List
            subheader={
              <ListSubheader component="div">
                Available Files
              </ListSubheader>
            }
          >
            {buildingFileNames.map((filename) =>
              <ListItem button>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary={filename} onClick={e => {loadFile(filename)}} />
              </ListItem>)
            }
          </List>
        </div>
      );
  }

  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>Open Building Map</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Button variant="contained" color="primary" onClick={onDirectoryClick}>
          Select Directory...
        </Button>
        {buildingFileList()}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
