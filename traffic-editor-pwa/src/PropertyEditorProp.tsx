import React from 'react';
import TextField from '@material-ui/core/TextField';

import { EditorProp } from './EditorProp';
import { useStore } from './Store';

interface PropertyEditorPropProps {
  prop: EditorProp,
}

export default function PropertyEditorProp(props: PropertyEditorPropProps): JSX.Element {
  const selection = useStore(state => state.selection);
  const field = React.useRef<HTMLInputElement>();
  const [value, setValue] = React.useState(props.prop.get_value());
  React.useEffect(() => {
    setValue(props.prop.get_value());
  }, [selection, props.prop]);

  const handleFieldChange = (event: any) => {
    if (props.prop.canModify) {
      setValue(event.target.value);
      props.prop.set_value(event.target.value);
      useStore.setState({
        site: useStore.getState().site,
        repaintCount: useStore.getState().repaintCount + 1,
      });
    }
  }

  if (props.prop.canModify) {
    return (
      <div>
        <TextField
          id={"field"}
          inputRef={field}
          variant="outlined"
          margin="dense"
          value={value}
          onChange={handleFieldChange} />
      </div>
    );
  }
  else
    return <div>{props.prop.get_value()}</div>;
}
