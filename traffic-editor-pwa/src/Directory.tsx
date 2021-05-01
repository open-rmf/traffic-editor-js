import React from 'react';

export default class Directory extends React.Component {
  directoryName: string = '';
  directoryHandle: FileSystemDirectoryHandle | null = null;
  buildingFileNames: string[] = [];

  constructor(props: any) {
    super(props);
    this.openClick = this.openClick.bind(this);
  }

  async openClick() {
    console.log('openClick');
    if (!('showDirectoryPicker' in window)) {
      alert('This browser does not support the File System Access API.');
      return;
    }
    this.directoryHandle = await window.showDirectoryPicker();
    for await (const entry of this.directoryHandle.values()) {
      if (entry.name.endsWith('.building.yaml'))
        this.buildingFileNames.push(entry.name);
    }
    // todo: setState(something)
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <button className="toolbar-button" onClick={this.openClick}>Open Directory</button>
        <ul>
          {this.buildingFileNames.map(function(name) { return <li>{name}</li>; })}
        </ul>
      </div>
    );
  }
}
