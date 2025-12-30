import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { Footer } from '../components';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    height: 50,
    width: '100%',
    marginBottom: 5,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    marginRight: 'auto',
  },

  icon: {
    width: 200,
    margin: '0 auto'
  },

  subtitle1: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 20,
    textAlign: 'center',
    color: '#105250',
  },

  subtitle2: {
    fontFamily: 'Lato',
    fontWeight: 400,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#ABABAB',
  },

  warning: {
    fontWeight: 600,
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },

  loginButton: {
    width: 250,
    fontWeight: 600,
    fontSize: 15,
    backgroundColor: '#E8F3F3',
    color: '#105250',
    marginBottom: 15,
  },

  google: {
    width: 15,
    height: 15,
    marginRight: 10,
    marginBottom: 2,
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <div className={classes.header} position={'relative'} color={'default'}>
          <img className={classes.icon} alt="티모 로고" src="/timo_logo.svg" />
        </div>
        <Typography className={classes.subtitle1}>Timetable Organizer</Typography>
        <Typography className={classes.subtitle2}>for intentional Management</Typography>

        <Button
          className={classes.loginButton}
          variant="text"
          href={process.env.REACT_APP_GOOGLE_SIGNIN_URL}
        >
          <img className={classes.google} alt="Google Icon" src="/google.png" />
          학교 계정으로 시작하기
        </Button>
        
        {/* 카카오톡 브라우저 지원 */}
        {/* <Typography className={classes.warning}>
          {process.env.REACT_APP_HOME_ALERT_MESSAGE}
        </Typography> */}
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </div>
  );
}
