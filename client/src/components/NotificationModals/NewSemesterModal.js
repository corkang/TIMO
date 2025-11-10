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
    width: 350,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 3, 3),
  },

  titleText: {
    margin: '0 0 10px 3px',
    textAlign: 'center',
  },

  bodyText: {
    color: 'secondary',
    textAlign: 'center',
  },

  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function NewSemesterModal({ open, onClose }) {
  const classes = useStyles();

  return (
    <Modal className={classes.root} open={open} onClose={onClose}>
      <Paper className={classes.modal}>
        <Typography className={classes.titleText} variant="h3">
          2025년도 2학기 서비스 안내{' '}
          <span role="img" aria-label="icon">
            🚀
          </span>
        </Typography>
        <Typography className={classes.bodyText} variant="body1">
          재학생 여러분 안녕하세요~!
          <br />
          <span role="img" aria-label="icon">
            🤪
          </span>
          <br />
          <br />
          다가오는 새 학기를 준비하는 여러분을 위해,
          <br />
          수강신청 도우미 TimO가 새롭게 시작됩니다!<br /><br />
          장바구니 경쟁률부터 수강신청 지연제 알림까지<br />
          다양한 기능들이 여러분의 수강신청을 도와드립니다.<br />
          성공적인 수강신청,
          <br /><strong>Timo</strong>가 함께하겠습니다!
          <span role="img" aria-label="icon">
            ☘️
          </span>
          <br />
          <br />
        </Typography>

        <Box className={classes.buttonBox}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            <Typography variant="body2">확인</Typography>
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
