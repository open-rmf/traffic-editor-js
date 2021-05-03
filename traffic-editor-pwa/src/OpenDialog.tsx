import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  directoryButton: {
    fontSize: theme.typography.h5.fontSize
  },
  filename: {
    fontSize: theme.typography.h5.fontSize,
    textDecoration: 'underline'
  },
  li: {
    fontSize: theme.typography.h3.fontSize,
  }
}));


type OpenDialogProps = {
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
};

export default function OpenDialog(props: OpenDialogProps): JSX.Element {
  const classes = useStyles(props);
  const [buildingFileNames, setBuildingFileNames] = React.useState<string[]>([]);

  const onDirectoryClick = async () => {
    setBuildingFileNames([]);
    const directoryHandle = await window.showDirectoryPicker();
    for await (const entry of directoryHandle.values()) {
      if (entry.name.endsWith('.building.yaml'))
        setBuildingFileNames(previous => [...previous, entry.name]);
    }
  }

  const onFilenameClick = (name: string) => {
    window.alert(name);
  }

  const buildingFileList = () => {
    if (buildingFileNames.length > 0)
      return (
        <div>
          <h3>Available Files</h3>
          <ul>
            {buildingFileNames.map((filename) =>
              <li>
                <span className={classes.filename} onClick={e => onFilenameClick(filename)}>{filename}</span>
              </li>)
            }
          </ul>
        </div>
      );
  }

  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>Open Building Map</DialogTitle>
      <DialogContent>
        <p>
          To open a local building map file, first you need to choose the directory on your computer that has the building map. The button below will pop up a dialog box from Google Chrome allowing you to do this, granting access to a particular directory on your machine to this application. Once you have chosen the directory, the available building map files in it will appear towards the bottom of this box.
        </p>
        <button className={classes.directoryButton} onClick={onDirectoryClick}>Choose Directory...</button>
        {buildingFileList()}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={props.onOpen} color="primary">
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
}
