import { app, BrowserWindow, dialog, Menu } from 'electron';
const path = require('path');
const fs = require('fs');
import { Building } from './building';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))
}

const fileNew = exports.fileNew = () => {
  console.log('fileNew');
}

const fileOpen = exports.fileOpen = () => {
  console.log('fileOpen');
  const files = dialog.showOpenDialogSync({
    title: 'Open building map',
    filters: [
      { 
        name: 'Building maps (.building.yaml)',
        extensions: ['building.yaml']
      }
    ],
    properties: ['openFile']
  });
  if (!files)
    return;
  const filename = files[0];
  console.log(filename);
  const content = fs.readFileSync(filename).toString();
  console.log(content);
}

const menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: '&File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CommandOrControl+N',
        click() { fileNew(); }
      },
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click(item:any, focusedWindow:any) { fileOpen(); }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        role: 'close',
      },
    ]
  },
  {
    label: '&Zoom',
    submenu: [
      {
        label: 'Reset',
        accelerator: 'CommandOrControl+R',
      },
    ]
  },
  {
    label: '&Help',
    role: 'help',
    submenu: [
      {
        label: 'About',
        click() { /* something */ }
      },
    ]
  }
];

// deal with Mac
if (process.platform === 'darwin') {
  const name = 'Traffic Editor';
  // todo: make the Mac application menu better someday
  menuTemplate.unshift({ label: name, submenu: [] });
}

app.whenReady().then(() => {
  console.log('hello world');
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

