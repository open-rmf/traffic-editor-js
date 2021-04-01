import React from 'react';

export default class Directory extends React.Component {
  render() {
    return (
      <div>
        <p>hello world</p>
      </div>
    );
  }
}

/*
function openClick() {
  console.log('openClick');
  if (!('showDirectoryPicker' in window)) {
    alert('This browser does not support the File System Access API');
    return;
  }
  window.showDirectoryPicker();
  // next call getDirectoryHandle()
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button className="toolbar-button" onClick={openClick}>open directory</button>
      </header>
    </div>
  );
}
*/

