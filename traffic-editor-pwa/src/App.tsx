import React from 'react';
import './App.css';

function openClick() {
  console.log('openClick');
  if (!('showDirectoryPicker' in window))
    return;
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
