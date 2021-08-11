import React from 'react'
import { useThree } from '@react-three/fiber';
import { useStore, clearSelection, setActiveTool } from './Store';
import { ToolID } from './ToolID';

type ShortcutKeysProps = {
}

export function ShortcutKeys(props: ShortcutKeysProps): JSX.Element {
  const canvas = useThree(state => state.gl.domElement);
  const setStore = useStore(state => state.set);

  React.useEffect(() => {
    canvas.tabIndex = 42;  // hack...
    const keyDown = (event: KeyboardEvent) => {

      if (event.key === undefined)
        return;  // somehow this happens sometimes

      let key = event.key.toLowerCase();
      if (key === 'm') {
        setActiveTool(ToolID.MOVE);
        clearSelection(setStore);
      } else if (key === 'escape') {
        setActiveTool(ToolID.SELECT);
        clearSelection(setStore);
      } else if (key === 'v') {
        setActiveTool(ToolID.ADD_VERTEX);
        clearSelection(setStore);
      } else if (key === 'l') {
        setActiveTool(ToolID.ADD_LANE);
        clearSelection(setStore);
      }
    }

    canvas.addEventListener('keydown', keyDown);
    return () => {
      canvas.removeEventListener('keydown', keyDown);
    };
  }, [canvas, setStore]);

  return (
    <>
    </>
  );
}
