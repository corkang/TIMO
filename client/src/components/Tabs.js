import React from 'react';
import { Tabs, Tab, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#DDEDED',
    borderRadius: 16,
    minHeight: 43,
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },
  tab: {
    color: '#146765',
    minHeight: 43,
    borderRadius: 12,
    margin: '4px',
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      backgroundColor: '#1A8986',
      color: '#FAFAFA',
    },
    '&:hover': {
      backgroundColor: 'rgba(26, 137, 134, 0.1)',
    },
  },
}));

/**
 * MyTabs displays styled tab navigation for switching between timetables.
 */
export default function MyTabs({ value, onChange, tabs }) {
  const classes = useStyles();

  return (
    <Tabs
      className={classes.root}
      value={value}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((title, index) => (
        <Tab className={classes.tab} label={title} key={index} />
      ))}
    </Tabs>
  );
}
