const { app, BrowserWindow, Menu, shell } = require('electron');
const mainProcess = require('./main');

const template = [
  {
    label: '&File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CommandOrControl+N',
      },
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
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
  template.unshift({ label: name });
}

module.exports = Menu.buildFromTemplate(template);
