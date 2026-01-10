import React from 'react';
import { makeStyles, LinearProgress, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  value: {
    fontSize: 13,
    color: '#1b8986',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 500,
  },
  progressRoot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    borderRadius: 4,
    backgroundColor: '#1b8986',
  },
}));

export default function ProgressBar({ label, value = 0 }) {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.labelRow}>
        <Typography className={classes.label}>{label}</Typography>
        <Typography className={classes.value}>{Math.round(value)}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        classes={{
          root: classes.progressRoot,
          bar: classes.progressBar,
        }}
      />
    </Box>
  );
}
