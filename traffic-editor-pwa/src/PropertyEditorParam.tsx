import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { EditorParam } from './EditorParam';
import { useStore } from './Store';

interface PropertyEditorParamProps {
  param: EditorParam,
}

export default function PropertyEditorParam(props: PropertyEditorParamProps): JSX.Element {
  const [checked, setChecked] = React.useState(props.param.value);
  const selection = useStore(state => state.selection);

  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
    props.param.value = event.target.checked;
    useStore.setState({
      site: useStore.getState().site,
      repaintCount: useStore.getState().repaintCount + 1,
    });
  }

  if (props.param.type_idx === 4) {
    return (
      <div>
        <Checkbox
          color="primary"
          checked={checked}
          onChange={handleCheckboxChange}
        />
      </div>
    );
  }
  else
    return <div>{props.param.value.toString()}</div>;
}
