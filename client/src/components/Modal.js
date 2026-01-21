import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, Paper, Box, Typography, InputBase, Button, makeStyles,
  Checkbox, FormControlLabel
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    outline: 0,
    minHeight: 130,
    width: 500,
    backgroundColor: (props) => props.isFeedback ? '#E8F3F3' : theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('sm')]: {
      width: 350,
      padding: theme.spacing(2, 3, 3),
    },
  },

  titleText: {
    marginTop: '16px',
    marginBottom: '10px',
    color: (props) => props.isFeedback ? '#1B8986' : (props.titleColor || 'inherit'),
    textAlign: (props) => props.isFeedback ? 'left' : 'center',
    fontWeight: 700,
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: (props) => props.isFeedback ? 'flex-start' : 'center',
    gap: '8px',
  },

  feedbackIcon: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  },

  captionText: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
    whiteSpace: 'pre-line',
  },

  contentText: {
    textAlign: 'center',
    marginBottom: 20,
    whiteSpace: 'pre-line',
    fontSize: '15px',
    color: '#333',
  },

  inputBox: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: (props) => props.isFeedback ? '#FAFAFA' : 'white',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    border: (props) => props.isFeedback ? '1px solid #EBEBEB' : '1px solid #dfe1e5',
  },

  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    color: 'rgba(0,0,0,.87)',
    outline: 'none',
    display: 'flex',
    fontSize: '14px',
    '&::placeholder': {
      fontSize: '12px',
    },
  },

  typeButtonGroup: {
    display: 'flex',
    justifyContent: 'start',
    gap: '10px',
    marginBottom: '15px',
  },

  typeButton: {
    padding: '3px 12px',
    borderRadius: '4px',
    border: '1px solid #EBEBEB',
    backgroundColor: '#FAFAFA',
    color: '#333',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F0F0F0',
    },
  },

  typeButtonSelected: {
    backgroundColor: '#FAFAFA',
    color: '#1A8986',
    border: '1px solid #1A8986',
    fontWeight: 600,
  },

  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px',
    padding: '0 5px',
  },

  checkboxLabel: {
    marginLeft: '5px',
    '& .MuiTypography-body1': {
      fontSize: '14px',
      color: '#666',
    },
  },

  footerCaption: {
    marginTop: '15px',
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    lineHeight: 1.4,
  },

  buttonBox: {
    display: 'flex',
    justifyContent: (props) => props.isFeedback ? 'flex-end' : 'center',
    gap: '10px',
    marginTop: '20px',
  },

  cancelBtn: {
    backgroundColor: '#E0E0E0',
    color: '#333',
    '&:hover': {
      backgroundColor: '#D5D5D5',
    },
  },

  btn: {
    backgroundColor: '#1A8986',
    color: '#FAFAFA',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      backgroundColor: '#156E6B',
    },
  },

  submitIcon: {
    width: '14px',
    height: '14px',
    objectFit: 'contain',
    marginRight: '3px',

  }
}));

export default function MyModal({ open, isInputRequired, onSubmit, text = {}, onClose, modalType = 'DEFAULT' }) {
  const isFeedback = modalType === 'FEEDBACK';
  const classes = useStyles({ titleColor: text.titleColor, isFeedback });

  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  // Feedback specific state
  const [feedbackType, setFeedbackType] = useState('피드백');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    setInputValue('');
    setFeedbackType('피드백');
    setIsAnonymous(false);
  }, [open]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (isFeedback) {
      // Format: [Type, Anonymous] Content or [Type] Content
      const typeTag = isAnonymous ? `[${feedbackType}, 익명]` : `[${feedbackType}]`;
      const finalContent = `${typeTag} ${inputValue}`;
      onSubmit(finalContent);
    } else {
      onSubmit(inputValue);
    }
  };

  const renderFeedbackContent = () => (
    <>
      <Typography className={classes.captionText}>
        {text.caption}
      </Typography>

      <Box className={classes.typeButtonGroup}>
        {['피드백', '버그제보', '기타'].map((type) => (
          <Button
            key={type}
            className={`${classes.typeButton} ${feedbackType === type ? classes.typeButtonSelected : ''}`}
            onClick={() => setFeedbackType(type)}
            disableElevation
            disableRipple
          >
            {type === '버그제보' ? '버그 제보' : type}
          </Button>
        ))}
      </Box>

      <Box className={classes.inputBox} style={{ alignItems: 'flex-start', minHeight: '100px' }}>
        <InputBase
          ref={inputRef}
          multiline
          rows={4}
          className={classes.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={text.placeholder}
        />
      </Box>

      <Box className={classes.checkboxContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              size="small"
              style={{ color: '#1A8986' }}
            />
          }
          label="익명으로 제출하기"
          className={classes.checkboxLabel}
          style={{ width: '100%', margin: 0 }}
        />
      </Box>

      <Typography className={classes.footerCaption}>
        모든 의견은 운영진이 직접 확인하며, 서비스 개선에 소중하게 활용됩니다.{'\n'}
        개인 정보는 수집하지 않으니 자유롭게 의견을 남겨주세요.
      </Typography>
    </>
  );

  const renderDefaultContent = () => (
    <>
      {text.content && (
        <Typography className={classes.contentText}>
          {text.content}
        </Typography>
      )}
      {isInputRequired && (
        <form
          className={classes.inputBox}
          onSubmit={handleSubmit}
        >
          <InputBase
            ref={inputRef}
            autoFocus
            className={classes.input}
            value={inputValue}
            autoComplete="off"
            name="modalInput"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={text.placeholder}
          />
        </form>
      )}
    </>
  );

  return (
    <Modal className={classes.root} open={open} onClose={onClose}>
      <Paper className={classes.modal}>
        <Typography className={classes.titleText} variant="h6">
          {isFeedback && <img src="/feedbacktitleicon.svg" alt="icon" className={classes.feedbackIcon} />}
          {text.title}
        </Typography>

        {isFeedback ? renderFeedbackContent() : renderDefaultContent()}

        <Box className={classes.buttonBox}>
          {isFeedback && (
            <Button
              className={classes.cancelBtn}
              variant="contained"
              onClick={onClose}
              disableElevation
            >
              <Typography variant="body2" style={{ fontWeight: 700 }}>취소</Typography>
            </Button>
          )}
          <Button
            className={classes.btn}
            variant="contained"
            disabled={(isInputRequired || isFeedback) && inputValue.trim().length === 0}
            onClick={() => handleSubmit()}
            disableElevation
          >
            {isFeedback && <img src="/feedbackSubmitIcon.svg" alt="submit" className={classes.submitIcon} />}
            <Typography variant="body2" style={{ fontWeight: 700 }}>{text.button}</Typography>
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
