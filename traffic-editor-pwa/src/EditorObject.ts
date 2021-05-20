import { v4 as uuidv4 } from 'uuid'

export class EditorObject {
  uuid: string = '';

  generate_uuid() {
    this.uuid = uuidv4();
  }
}
