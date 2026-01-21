import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import StarRating from './StarRating';
import {
  REVIEW_CRITERIA,
  REVIEW_LABELS,
  SEMESTER_OPTIONS,
} from '../../commons/constants';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      maxWidth: 600,
      width: '100%',
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #ebebeb',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  courseInfo: {
    backgroundColor: '#f5f5f5',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 20,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 500,
    color: '#333',
  },
  professor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: '20px 24px',
    maxHeight: '60vh',
    overflowY: 'auto',
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    marginBottom: 8,
    display: 'block',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioLabel: {
    marginRight: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: 13,
    },
  },
  selectControl: {
    minWidth: 150,
    marginBottom: 20,
  },
  commentField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
    },
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#ababab',
    marginTop: 4,
  },
  charCountError: {
    color: '#f44336',
  },
  actions: {
    padding: '16px 24px',
    borderTop: '1px solid #ebebeb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    color: '#666',
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#1b8986',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#167a77',
    },
    '&:disabled': {
      backgroundColor: '#ccc',
    },
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
}));

const initialFormData = {
  semester: SEMESTER_OPTIONS[0],
  rating: 0,
  grading: '',
  difficulty: '',
  exams: '',
  assignments: '',
  teamProjects: '',
  onlineOfflineRatio: '',
  teachingMethod: '',
  comment: '',
};

export default function ReviewWriteModal({
  open,
  onClose,
  onSubmit,
  course,
  editingReview = null,
}) {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const isEditing = !!editingReview;

  useEffect(() => {
    if (editingReview) {
      setFormData({
        semester: editingReview.semester,
        rating: editingReview.rating,
        grading: editingReview.grading,
        difficulty: editingReview.difficulty,
        exams: editingReview.exams,
        assignments: editingReview.assignments,
        teamProjects: editingReview.teamProjects,
        onlineOfflineRatio: editingReview.onlineOfflineRatio,
        teachingMethod: editingReview.teachingMethod,
        comment: editingReview.comment,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingReview, open]);

  const handleChange = (field) => (event) => {
    const value = event.target ? event.target.value : event;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = '별점을 선택해주세요.';
    }
    if (!formData.grading) {
      newErrors.grading = '성적을 선택해주세요.';
    }
    if (!formData.difficulty) {
      newErrors.difficulty = '난이도를 선택해주세요.';
    }
    if (!formData.exams) {
      newErrors.exams = '시험을 선택해주세요.';
    }
    if (!formData.assignments) {
      newErrors.assignments = '과제를 선택해주세요.';
    }
    if (!formData.teamProjects) {
      newErrors.teamProjects = '팀플을 선택해주세요.';
    }
    if (!formData.onlineOfflineRatio) {
      newErrors.onlineOfflineRatio = '온/오프라인 비율을 선택해주세요.';
    }
    if (!formData.teachingMethod) {
      newErrors.teachingMethod = '강의 방식을 선택해주세요.';
    }
    if (formData.comment.length < 10) {
      newErrors.comment = '코멘트는 10자 이상 작성해주세요.';
    }
    if (formData.comment.length > 500) {
      newErrors.comment = '코멘트는 500자 이하로 작성해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData = {
      ...formData,
      courseName: course.courseName,
      courseCode: course.courseCode || '',
      professor: course.professor,
    };

    onSubmit(submitData);
  };

  const renderRadioGroup = (field, label, options) => (
    <FormControl component="fieldset" className={classes.formSection}>
      <FormLabel component="legend" className={classes.formLabel}>
        {label}
      </FormLabel>
      <RadioGroup
        row
        value={formData[field]}
        onChange={handleChange(field)}
        className={classes.radioGroup}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio size="small" color="primary" />}
            label={REVIEW_LABELS[field][option]}
            className={classes.radioLabel}
          />
        ))}
      </RadioGroup>
      {errors[field] && (
        <Typography className={classes.errorText}>{errors[field]}</Typography>
      )}
    </FormControl>
  );

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog} fullWidth>
      <Box className={classes.dialogTitle}>
        <Typography className={classes.title}>
          {isEditing ? '강의평 수정' : '강의평 작성'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className={classes.content}>
        {course && (
          <Box className={classes.courseInfo}>
            <Typography className={classes.courseName}>{course.courseName}</Typography>
            <Typography className={classes.professor}>{course.professor}</Typography>
          </Box>
        )}

        <FormControl className={classes.selectControl}>
          <FormLabel className={classes.formLabel}>수강 학기</FormLabel>
          <Select
            value={formData.semester}
            onChange={handleChange('semester')}
            variant="outlined"
            size="small"
          >
            {SEMESTER_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}학기
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className={classes.ratingSection}>
          <Typography className={classes.ratingLabel}>전체 평점</Typography>
          <StarRating
            rating={formData.rating}
            size={32}
            editable
            onChange={handleChange('rating')}
          />
          {errors.rating && (
            <Typography className={classes.errorText}>{errors.rating}</Typography>
          )}
        </Box>

        {renderRadioGroup('grading', '성적', REVIEW_CRITERIA.grading)}
        {renderRadioGroup('difficulty', '수업 난이도', REVIEW_CRITERIA.difficulty)}
        {renderRadioGroup('exams', '시험', REVIEW_CRITERIA.exams)}
        {renderRadioGroup('assignments', '과제', REVIEW_CRITERIA.assignments)}
        {renderRadioGroup('teamProjects', '팀플', REVIEW_CRITERIA.teamProjects)}
        {renderRadioGroup(
          'onlineOfflineRatio',
          '온/오프라인 비율',
          REVIEW_CRITERIA.onlineOfflineRatio,
        )}
        {renderRadioGroup('teachingMethod', '강의 방식', REVIEW_CRITERIA.teachingMethod)}

        <FormControl fullWidth className={classes.formSection}>
          <FormLabel className={classes.formLabel}>코멘트</FormLabel>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="강의에 대한 솔직한 후기를 작성해주세요. (10자 이상 500자 이하)"
            value={formData.comment}
            onChange={handleChange('comment')}
            className={classes.commentField}
            error={!!errors.comment}
          />
          <Typography
            className={`${classes.charCount} ${formData.comment.length > 500 ? classes.charCountError : ''
              }`}
          >
            {formData.comment.length}/500
          </Typography>
          {errors.comment && (
            <Typography className={classes.errorText}>{errors.comment}</Typography>
          )}
        </FormControl>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button onClick={onClose} variant="outlined" className={classes.cancelButton}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className={classes.submitButton}
        >
          {isEditing ? '수정하기' : '작성하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
