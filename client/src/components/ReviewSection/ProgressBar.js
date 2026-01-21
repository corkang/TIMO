import React from 'react';
import { makeStyles, LinearProgress, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
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
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  subLabel: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Noto Sans KR, sans-serif',
    fontWeight: 500,
  },
}));

export default function ProgressBar({ label, value = 0, leftLabel, rightLabel, ...props }) {
  const classes = useStyles();

  return (
    <Box className={classes.container} {...props}>
      <Box className={classes.headerRow}>
        <Typography className={classes.title}>{label}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        classes={{
          root: classes.progressRoot,
          bar: classes.progressBar,
        }}
      />
      <Box className={classes.labelsRow}>
        <Typography className={classes.subLabel}>{leftLabel}</Typography>
        <Typography className={classes.subLabel}>{rightLabel}</Typography>
      </Box>
    </Box>
  );
}
