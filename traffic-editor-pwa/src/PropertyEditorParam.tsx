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
  const [stringValue, setStringValue] = React.useState(props.param.value);
  const selection = useStore(state => state.selection);
  const string_field = React.useRef<HTMLInputElement>();
  //console.log(`PropertyEditorParam(${props.param.name})`);

  React.useEffect(() => {
    setChecked(props.param.value);
    setStringValue(props.param.value);
  }, [selection, props.param]);

  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
    props.param.value = event.target.checked;
    useStore.setState({
      site: useStore.getState().site,
      repaintCount: useStore.getState().repaintCount + 1,
    });
  }

  const handleStringFieldChange = (event: any) => {
    setStringValue(event.target.value);
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
        id={props.param.name + '_checkbox'}
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
          id={props.param.name + '_string_field'}
          inputRef={string_field}
          variant="outlined"
          margin="dense"
          value={stringValue}
          onChange={handleStringFieldChange} />
      </div>
    );
  }
  else
    return <div>{props.param.value.toString()}</div>;
}
