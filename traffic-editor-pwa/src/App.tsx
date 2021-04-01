import React from 'react';
import './App.css';

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

export default App;
