import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import { EditorParam } from './EditorParam';
import { useStore } from './Store';

interface PropertyEditorParamProps {
  param: EditorParam,
}

export default function PropertyEditorParam(props: PropertyEditorParamProps): JSX.Element {
  const [checked, setChecked] = React.useState(props.param.value);
  useStore(state => state.selection);
  const string_field = React.useRef<HTMLInputElement>();

  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
    props.param.value = event.target.checked;
    useStore.setState({
      site: useStore.getState().site,
      repaintCount: useStore.getState().repaintCount + 1,
    });
  }

  const handleStringFieldChange = (event: any) => {
    props.param.value = event.target.value;
    useStore.setState({
      site: useStore.getState().site,
      repaintCount: useStore.getState().repaintCount + 1,
    });
  }

  // todo: deal with 2=integer, 3=float

  if (props.param.type_idx === 4) {
    // boolean
    return (
      <Checkbox
        color="primary"
        checked={checked}
        onChange={handleCheckboxChange}
      />
    );
  }
  else if (props.param.type_idx === 1) {
    // string
    return (
      <div>
        <TextField
          id="string_field"
          inputRef={string_field}
          variant="outlined"
          margin="dense"
          defaultValue={props.param.value}
          onChange={handleStringFieldChange} />
      </div>
    );
  }
  else
    return <div>{props.param.value.toString()}</div>;
}
