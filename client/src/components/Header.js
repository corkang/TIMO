import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AppBar, Box, Typography, makeStyles, Button } from '@material-ui/core';

import { Lecture } from '../models';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingTop: 40,
    padding: '0 7%',
    backgroundColor: "#FAFAFA",
    fontFamily: 'Roboto',
    fontWeight: 600,
    boxShadow: 'none',

    [theme.breakpoints.down('sm')]: {
      height: 60,
      padding: '0 10px 0 20px ',
    },
  },

  front: {
    display: 'flex',
    marginRight: 'auto',
  },

  icon: {
    marginRight: 3,
    width: 200,
  },

  title: {
    fontWeight: 800,
    fontSize: '20px',
  },

  information: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 15,
    fontWeight: 600,
    fontSize: 14,
  },

  navbar: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 48,
    alignItems: 'center',
  },

  navItem: {
    position: 'relative',
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: 20,
    color: '#000000',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '8px 0',
    transition: 'all 0.2s ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      backgroundColor: 'transparent',
      transition: 'background-color 0.2s ease',
    },
    '&:hover::after': {
      backgroundColor: '#DDEDED',
    },
  },

  navItemActive: {
    '&::after': {
      backgroundColor: '#1B8986 !important',
    },
  },

  textbutton: {
    width: 95,
    backgroundColor: '#1B8986',
    color: '#FAFAFA',
    borderRadius: 10,
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 16,
    '&:hover': {
      backgroundColor: '#156E6B'
    },
  },
}));

/**
 * Header component displays the top navigation bar with logo, navigation links, and logout button.
 */
export default function Header({ logout, openReportFeedbackModal, isSharePage }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [lastCrawledAt, setLastCrawledAt] = useState();

  const navItems = [
    { label: '시간표', path: '/timetable' },
    { label: '지연제', path: '/issac' },
    { label: '경쟁률', path: '/cart' },
    { label: '수강편람', path: '/courseguide' },
  ];

  useEffect(() => {
    Lecture.getSearchResults('', 1).then(({ data }) => {
      setLastCrawledAt(data?.lectures[0]?.crawledAt?.slice(5, 10));
    });
  }, []);

  const handleNavClick = (path) => {
    history.push(path);
  };

  return (
    <AppBar className={classes.appBar} position={'relative'} >
      <Box className={classes.front} href={'/issac'}>
        <a href='/issac'>
          <img className={classes.icon} alt="티모 로고" src="/timo_logo.svg" />
        </a>
        {/* <Typography className={classes.title}>한동대</Typography> */}
        <Typography className={classes.information}>
          {process.env.REACT_APP_HANDONG_ALERT_MESSAGE ||
            (lastCrawledAt ? `개설과목 업데이트: ${lastCrawledAt}` : '')}
        </Typography>
      </Box>
      {!isSharePage ? (
        <>
          <Box className={classes.navbar}>
            {navItems.map((item) => (
              <Box
                key={item.path}
                className={`${classes.navItem} ${
                  location.pathname === item.path ? classes.navItemActive : ''
                }`}
                onClick={() => handleNavClick(item.path)}
              >
                {item.label}
              </Box>
            ))}
          </Box>
          <Button className={classes.textbutton} onClick={logout}>로그아웃</Button>
        </>
      ) : (
        <Button className={classes.textbutton} href={'/'}>로그인</Button>
      )}
    </AppBar>
  );
}
