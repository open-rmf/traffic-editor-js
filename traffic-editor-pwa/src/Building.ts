export default class Building
{
  xml: string = '';
  filename: string = '';
  
  async load_file(_filename: string, directoryHandle: FileSystemDirectoryHandle): Promise<boolean>
  {
    this.filename = _filename;
    const fileHandle = await directoryHandle.getFileHandle(_filename);
    const file = await fileHandle.getFile();
    this.xml = await file.text();
    return true;
  }
}
