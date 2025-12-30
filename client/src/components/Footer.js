import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  owner: {
    fontWeight: 700,
    color: '#1B8986',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      Copyright ⓒ 2025.&nbsp;
      <a className={classes.owner} href="https://github.com/corkang/TIMO">
        Timo
      </a>
      .&nbsp;All Rights Reserved.
    </div>
  );
}
