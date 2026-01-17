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
    width: 177,
    [theme.breakpoints.down('sm')]: {
      width: 100,
    },
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
    [theme.breakpoints.down('sm')]: {
      display: 'none', // 모바일에서 숨김
    },
  },

  navbar: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 48,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      left: 'auto',
      transform: 'none',
      gap: 16,
      marginRight: 8,
    },
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
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      padding: '4px 0',
      '&::after': {
        height: 2,
      },
    },
  },

  navItemActive: {
    '&::after': {
      backgroundColor: '#1B8986 !important',
    },
  },

  textbutton: {
    width: 95,
    height: 40, // Enforce height
    backgroundColor: '#1B8986',
    color: '#FAFAFA',
    borderRadius: 20,
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 16,
    '&:hover': {
      backgroundColor: '#156E6B'
    },
    [theme.breakpoints.down('sm')]: {
      width: 65,
      height: 32, // Enforce height for mobile
      fontSize: 12,
      minWidth: 'unset',
      padding: '0', // Remove padding to respect height
    },
  },

  feedbackButton: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 20,
    backgroundColor: '#DDEDED',
    padding: 0,
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#C5E5E5',
    },
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32,
      minWidth: 32,
      borderRadius: 16, // Adjust radius for smaller size? Or keep 20? User said 20. I'll keep 20 or scaled. If size is 32, radius 20 is still full round.
      marginRight: 8,
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
    { label: '강의평', path: '/review' },
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
        {/* <Typography className={classes.information}>
          {process.env.REACT_APP_HANDONG_ALERT_MESSAGE ||
            (lastCrawledAt ? `개설과목 업데이트: ${lastCrawledAt}` : '')}
        </Typography> */}
      </Box>
      {!isSharePage ? (
        <>
          <Box className={classes.navbar}>
            {navItems.map((item) => (
              <Box
                key={item.path}
                className={`${classes.navItem} ${location.pathname === item.path ? classes.navItemActive : ''
                  }`}
                onClick={() => handleNavClick(item.path)}
              >
                {item.label}
              </Box>
            ))}
          </Box>
          <Button className={classes.feedbackButton} onClick={openReportFeedbackModal}>
            <img src="/feedbacklogo.svg" alt="feedback" style={{ width: '20px', height: '20px' }} />
          </Button>
          <Button className={classes.textbutton} onClick={logout}>로그아웃</Button>
        </>
      ) : (
        <Button className={classes.textbutton} href={'/'}>로그인</Button>
      )}
    </AppBar>
  );
}
