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
import { BuildingParseYAML } from './Building';
import { BuildingContext } from './BuildingContext';

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
  const building = React.useContext(BuildingContext);
  const [buildingFileNames, setBuildingFileNames] = React.useState<string[]>([]);
  const [directoryHandle, setDirectoryHandle] = React.useState<FileSystemDirectoryHandle>();
  const [buildingFileBlob, setBuildingFileBlob] = React.useState<File[]>([]);
  ///TODO: Toggle between APIS?
  const onDirectoryClick = async () => {
    setBuildingFileNames([]);
    const handle = await window.showDirectoryPicker();
    await setDirectoryHandle(handle);
    for await (const entry of handle.values()) {
      if (entry.name.endsWith('.building.yaml'))
        setBuildingFileNames(previous => [...previous, entry.name]);
    }
  }

  const loadFile = async(filename: string) => {
    if (directoryHandle) {
      const fileHandle = await directoryHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();
      BuildingParseYAML(building, filename, text);
    }
    props.onOpen();
  }

  const loadBlob = async(file: File, filename: string) => {
    var fileReader = new FileReader();
    fileReader.onload = (e) => {
      if(e.target == null) {
        return;
      }
      if(typeof e.target.result === 'string')
      {
        BuildingParseYAML(building, filename, e.target.result);
        props.onOpen();
      }
    };
    fileReader.readAsText(file);
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
            {buildingFileNames.map((filename, index) =>
              <ListItem button key={filename}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary={filename} onClick={
                  e => {
                    loadBlob(buildingFileBlob[index], filename)
                  }} />
              </ListItem>)
            }
          </List>
        </div>
      );
  }

  const _addDirectory = (node: any) => {
    //@ts-ignore - Bad practice but these are "standard", "non-standard" apis
    if (node) {
      node.directory = true;
      node.webkitdirectory = true;
    }
  }

  const loadFromLegacyApi = (files: FileList|null) => {
    if (files == null)
    {
      return;
    }
    // Firefox's implementation of FileList will crash if we use shorthand
    for(var i = 0; i < files.length; i++)
    {
      const file = files[i];
      if(file.name.endsWith(".building.yaml"))
      {
        setBuildingFileNames(previous => [...previous, file.name]);
        setBuildingFileBlob(previous => [...previous, file]);
      }
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>Open Building Map</DialogTitle>
      <DialogContent className={classes.dialog}>
        Upload folder:
        <input
          type="file"
          id="filepicker"
          name="fileList"
          ref={node => _addDirectory(node)}
          onChange={e => { loadFromLegacyApi(e.target.files); }}
          multiple/>
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
