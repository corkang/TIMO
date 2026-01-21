import React, { useState, useEffect } from 'react';
import {
    makeStyles,
    Box,
    Typography,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    Button,
    IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StarRating from './StarRating';
import {
    REVIEW_CRITERIA,
    REVIEW_LABELS,
    SEMESTER_OPTIONS,
} from '../../commons/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: '20px',
        flex: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ddd',
            borderRadius: '4px',
            '&:hover': {
                backgroundColor: '#ccc',
            },
        },
    },
    courseInfo: {
        backgroundColor: '#E8F3F3',
        padding: '16px',
        borderRadius: 8,
        marginBottom: 24,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    professor: {
        fontSize: 14,
        color: '#666',
    },
    formSection: {
        marginBottom: 24,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        display: 'block',
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    radioLabel: {
        marginRight: 16,
        '& .MuiTypography-root': {
            fontSize: 14,
        },
    },
    buttonGroup: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
    },
    selectButton: {
        border: '1px solid #ddd',
        padding: '6px 10px',
        borderRadius: 4,
        fontSize: 13,
        color: '#666',
        backgroundColor: '#fff',
        cursor: 'pointer',
        '&.selected': {
            borderColor: '#1b8986',
            backgroundColor: '#E8F3F3',
            color: '#1b8986',
            fontWeight: 'bold',
        },
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    commentField: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            '& fieldset': {
                borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
                borderColor: '#B8DAD9',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#1b8986',
            },
        },
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    charCountError: {
        color: '#f44336',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#C4C4C4',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Noto Sans KR, sans-serif',
        margin: '20px 0',
        '&:hover': {
            backgroundColor: '#B0B0B0',
        },
        '&.active': {
            backgroundColor: '#1b8986',
            '&:hover': {
                backgroundColor: '#156E6B',
            },
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
    quiz: '',
    assignments: '',
    teamProjects: '',
    onlineOfflineRatio: '',
    teachingMethod: '',
    comment: '',
};

export default function ReviewWriteView({
    course,
    onSubmit,
    onCancel,
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
                quiz: editingReview.quiz,
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
    }, [editingReview]);

    const handleChange = (field) => (event) => {
        const value = event.target ? event.target.value : event;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSelectButton = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (formData.rating === 0) newErrors.rating = '별점을 선택해주세요.';
        if (!formData.grading) newErrors.grading = '성적을 선택해주세요.';
        if (!formData.difficulty) newErrors.difficulty = '난이도를 선택해주세요.';
        if (!formData.exams) newErrors.exams = '시험을 선택해주세요.';
        if (!formData.quiz) newErrors.quiz = '퀴즈를 선택해주세요.';
        if (!formData.assignments) newErrors.assignments = '과제를 선택해주세요.';
        if (!formData.teamProjects) newErrors.teamProjects = '팀플을 선택해주세요.';
        if (!formData.onlineOfflineRatio) newErrors.onlineOfflineRatio = '온/오프라인 비율을 선택해주세요.';
        if (!formData.teachingMethod) newErrors.teachingMethod = '강의 방식을 선택해주세요.';
        if (formData.comment.length < 10) newErrors.comment = '코멘트는 10자 이상 작성해주세요.';
        if (formData.comment.length > 500) newErrors.comment = '코멘트는 500자 이하로 작성해주세요.';

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

    const renderSelectButtons = (field, label, options) => (
        <Box className={classes.formSection}>
            <FormLabel className={classes.formLabel}>{label} *</FormLabel>
            <Box className={classes.buttonGroup}>
                {options.map((option) => (
                    <button
                        key={option}
                        className={`${classes.selectButton} ${formData[field] === option ? 'selected' : ''
                            }`}
                        onClick={() => handleSelectButton(field, option)}
                    >
                        {REVIEW_LABELS[field][option]}
                    </button>
                ))}
            </Box>
            {errors[field] && (
                <Typography className={classes.errorText}>{errors[field]}</Typography>
            )}
        </Box>
    );

    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <IconButton onClick={onCancel} style={{ padding: 8 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography className={classes.headerTitle}>강의평 작성</Typography>
            </Box>

            <Box className={classes.content}>
                {/* Course Info Summary */}
                <Box className={classes.courseInfo}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography className={classes.courseName} style={{ marginRight: 10 }}>
                            {course.courseName}
                        </Typography>
                        <Typography color="textSecondary">
                            {course.courseCode}
                        </Typography>
                    </Box>
                    <Typography className={classes.professor}>
                        {course.professor}
                    </Typography>

                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                        <StarRating
                            rating={formData.rating}
                            onChange={handleChange('rating')}
                            editable={true}
                            size={30}
                        />
                        {errors.rating && (
                            <Typography className={classes.errorText} style={{ marginTop: 0 }}>
                                {errors.rating}
                            </Typography>
                        )}
                    </Box>

                    <Box mt={2}>
                        <TextField
                            placeholder="강의평을 작성해주세요"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={formData.comment}
                            onChange={handleChange('comment')}
                            className={classes.commentField}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Box>
                                {errors.comment && (
                                    <Typography className={classes.errorText} style={{ marginTop: 0 }}>
                                        {errors.comment}
                                    </Typography>
                                )}
                            </Box>
                            <Typography className={`${classes.charCount} ${formData.comment.length > 500 ? classes.charCountError : ''}`} style={{ marginTop: 0 }}>
                                {formData.comment.length}/500
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Form Fields */}
                <Box display="flex" gap={2} className={classes.formSection}>
                    <Box flex={1} display="flex" flexDirection="column" alignItems="flex-start">
                        <FormLabel className={classes.formLabel}>수강 학기 *</FormLabel>
                        <Select
                            value={formData.semester}
                            onChange={handleChange('semester')}
                            variant="outlined"
                            style={{ backgroundColor: '#fff', width: '80px' }}
                            margin="dense"
                        >
                            {SEMESTER_OPTIONS.map((opt) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box flex={1}>
                        {renderSelectButtons('grading', '성적', REVIEW_CRITERIA.grading)}
                    </Box>
                    <Box flex={1}>
                        {renderSelectButtons('difficulty', '수업 난이도', REVIEW_CRITERIA.difficulty)}
                    </Box>
                </Box>


                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        {renderSelectButtons('exams', '시험', REVIEW_CRITERIA.exams)}
                    </Box>
                    <Box flex={1}>
                        {renderSelectButtons('quiz', '퀴즈', REVIEW_CRITERIA.quiz)}
                    </Box>
                    <Box flex={1}>
                        {renderSelectButtons('assignments', '과제', REVIEW_CRITERIA.assignments)}
                    </Box>
                </Box>

                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        {renderSelectButtons('teamProjects', '팀플', REVIEW_CRITERIA.teamProjects)}
                    </Box>
                    <Box flex={1}>
                        {renderSelectButtons('onlineOfflineRatio', '온/오프라인 비율', REVIEW_CRITERIA.onlineOfflineRatio)}
                    </Box>
                </Box>

                {renderSelectButtons('teachingMethod', '강의 방식', REVIEW_CRITERIA.teachingMethod)}

                <Button
                    className={`${classes.submitButton} ${'active'}`}
                    onClick={handleSubmit}
                >
                    강의평 등록하기
                </Button>
            </Box>
        </Box>
    );
}
