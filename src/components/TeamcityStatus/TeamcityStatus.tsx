import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';

const useStyles = makeStyles({
  verticalCenter: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pl3: {
    paddingLeft: '3px'
  },
  success: {
    color: '#388e3c',
  },
  error: {
    color: '#c62828',
  }
});

type PropTypes = {
  status: string;
  statusText: string;
};

export const TeamcityStatus = (props: PropTypes) => {
  const classes = useStyles();
  const isSuccess = props.status === 'SUCCESS';

  return (
    <p className={[isSuccess ? classes.success : classes.error, classes.verticalCenter].join(' ')}>
      {isSuccess ? (<CheckCircle fontSize="small"/>) : (<Cancel fontSize="small"/>)}
      <span className={classes.pl3}>
        {props.statusText}
      </span>
    </p>
  );
};