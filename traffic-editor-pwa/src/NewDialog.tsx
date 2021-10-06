import React, { useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import YAML from 'yaml';

import { Site } from './Site';
import { useStore } from './Store';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

type NewDialogProps = {
  open: boolean;
  onNew: () => void;
  onCancel: () => void;
  close: () => void;
};

export default function NewDialog(props: NewDialogProps): JSX.Element {
  const classes = useStyles(props);
  // const [buildingFileNames, setBuildingFileNames] = React.useState<string[]>([]);
  const [directoryHandle, setDirectoryHandle] = React.useState<FileSystemDirectoryHandle>();
  const site_name = useRef<HTMLInputElement>();

  const onDirectoryClick = async () => {
    //setBuildingFileNames([]);
    const handle = await window.showDirectoryPicker({ writable: true});
    //handle.requestPermission({ writable: true });
    setDirectoryHandle(handle);
    /*
    for await (const entry of handle.values()) {
      if (entry.name.endsWith('.building.yaml'))
        setBuildingFileNames(previous => [...previous, entry.name]);
    }
    */
  }

  const createNewMap = () => {
    if (directoryHandle) {
      const site = Site.fromNewCommand();
      if (site_name.current) {
        site.name = site_name.current?.value;
        site.filename = site_name.current?.value + '.building.yaml';
        site.save = async () => {
          const fileHandle = await directoryHandle.getFileHandle(site.filename, {create: true});
          const writable = await fileHandle.createWritable();
          Object.getPrototypeOf(YAML.YAMLMap).maxFlowStringSingleLineLength = 10000;
          await writable.write(site.toYAMLString());
          await writable.close();
        }
      }
      const cameraInitialPose = site.computeInitialCameraPose();
      useStore.setState({
        site: site,
        selection: null,
        cameraInitialPose: cameraInitialPose,
      });
      props.close();
    }
  }

  /*
  const loadFile = async(filename: string) => {
    if (directoryHandle) {
      const fileHandle = await directoryHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();
      Parser(text, '');
    }
    props.onOpen();
  }
  */

  /*
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
              <ListItem button key={filename}>
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
  */

  const isFileSystemAccessible = (typeof window['showDirectoryPicker'] === "function");

  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>New Site Map</DialogTitle>
      <DialogContent className={classes.dialog}>
        {isFileSystemAccessible ?
          <>
            <div>
              <Button variant="contained" color="primary" onClick={onDirectoryClick}>
                Select Directory...
              </Button>
            </div>
            <div>
              <TextField id="site-name" inputRef={site_name} variant="outlined" label="Site Name" />
            </div>
          </>
          :
          <div>
            Unfortunately, this browser does not support the File System Access API.
          </div>
        }
      </DialogContent>
      <DialogActions>
        <>
          {isFileSystemAccessible ?
            <Button onClick={createNewMap} color="primary">
              OK
            </Button>
            : <></>
          }
          <Button onClick={props.onCancel} color="primary">
            Cancel
          </Button>
        </>
      </DialogActions>
    </Dialog>
  );
}
