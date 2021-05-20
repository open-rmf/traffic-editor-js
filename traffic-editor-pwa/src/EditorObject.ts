import { v4 as uuidv4 } from 'uuid'
import { Param } from './Param';

export class EditorObject {
  uuid: string = '';
  params: Param[] = [];

  generate_uuid() {
    this.uuid = uuidv4();
  }
}
