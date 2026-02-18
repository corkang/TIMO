import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '30px',
    gap: '6px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  owner: {
    fontWeight: 700,
    color: '#1B8986',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  privacyLink: {
    color: '#999',
    fontSize: '0.8rem',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  divider: {
    color: '#ccc',
    fontSize: '0.75rem',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <div>
        Copyright ⓒ 2025.&nbsp;
        <a className={classes.owner} href="https://github.com/corkang/TIMO">
          Timo
        </a>
        .&nbsp;All Rights Reserved.
      </div>
      <div className={classes.links}>
        <a className={classes.privacyLink} href="/terms">이용약관</a>
        <span className={classes.divider}>|</span>
        <a className={classes.privacyLink} href="/privacy">개인정보 처리방침</a>
      </div>
    </div>
  );
}
