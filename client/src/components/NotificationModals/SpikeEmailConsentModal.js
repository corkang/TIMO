import React from 'react';
import { Modal, Paper, Box, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 3, 3),
    borderRadius: 16,

    [theme.breakpoints.down('sm')]: {
      width: 350,
    },
  },

  titleText: {
    fontWeight: 700,
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },

  bodyText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 1.7,
    marginBottom: 24,
  },

  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },

  cancelButton: {
    flex: 1,
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
    padding: '10px 0',
    backgroundColor: '#EAEAEA',
    color: '#333',
    '&:hover': {
      backgroundColor: '#D1D1D1',
    },
  },

  consentButton: {
    flex: 1,
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
    padding: '10px 0',
    backgroundColor: '#1B8986',
    color: '#FAFAFA',
    '&:hover': {
      backgroundColor: '#156E6B',
    },
  },
}));

export default function SpikeEmailConsentModal({ open, onConsent, onCancel }) {
  const classes = useStyles();

  return (
    <Modal className={classes.root} open={open} onClose={(_, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') onCancel(); }}>
      <Paper className={classes.modal}>
        <Typography className={classes.titleText}>
          {'📬 알림 메일 수신 동의'}
        </Typography>
        <Typography className={classes.bodyText}>
          {'알림 신청한 과목에 빈자리가 생기면'}
          <br />
          {'지연제 시간에 맞추어 오픈 15분 전에 메일로 알려드려요.'}
          <br /><br />
          {'메일 알림을 받으시겠어요?'}
        </Typography>
        <Box className={classes.buttonBox}>
          <Button className={classes.cancelButton} onClick={onCancel}>
            {'취소'}
          </Button>
          <Button className={classes.consentButton} onClick={onConsent}>
            {'동의'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}