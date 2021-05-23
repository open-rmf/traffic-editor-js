import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  }
}));

export default function PropertyEditor(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>hello i am property editor</div>
  );
}
