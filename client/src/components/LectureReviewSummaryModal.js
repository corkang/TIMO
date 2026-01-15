import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, IconButton, makeStyles, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Review } from '../models';
import StarRating from './ReviewSection/StarRating';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#E8F3F3',
        borderRadius: '16px',
        boxShadow: theme.shadows[5],
        padding: '24px',
        width: '400px',
        maxWidth: '90%',
        outline: 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
    closeButton: {
        position: 'absolute',
        right: '10px',
        top: '10px',
        padding: '5px',
        color: '#333333',
    },
    headerSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        paddingRight: '20px',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lectureName: {
        fontFamily: 'Lato',
        fontWeight: 700,
        fontSize: '20px',
        color: '#333333',
        marginRight: '8px',
    },
    lectureCode: {
        fontFamily: 'Lato',
        fontSize: '14px',
        color: '#ABABAB',
    },
    professor: {
        fontFamily: 'Lato',
        fontWeight: 700,
        fontSize: '14px',
        color: '#333333',
    },
    ratingInfo: {
        fontFamily: 'Lato',
        fontSize: '14px',
        color: '#ABABAB',
    },
    starContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    statsSection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px 20px',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    statLabelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontWeight: 700,
        color: '#555555',
    },
    statBarBg: {
        width: '100%',
        height: '6px',
        backgroundColor: 'rgba(26, 137, 134, 0.2)',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
        backgroundColor: '#1A8986',
        borderRadius: '3px',
    },
    reviewSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '20px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    reviewText: {
        fontSize: '15px',
        color: '#222222',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '15px',
    },
    detailButton: {
        display: 'flex',
        alignItems: 'center',
        color: '#555555',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        padding: 0,
        '&:hover': {
            textDecoration: 'underline',
            color: '#1A8986',
        },
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
    },
}));

// Helper to calculate progress value (copied from CourseStatsCard)
const SCORE_MAP = {
    grading: { generous: 0, normal: 33, tight: 67, survival: 100 },
    difficulty: { easy: 0, normal: 50, hard: 100 },
    assignments: { none: 0, normal: 50, heavy: 100 },
    teamProjects: { none: 0, normal: 50, heavy: 100 },
};

function calculateProgressValue(distribution, scoreMap) {
    if (!distribution) return 0;
    let totalScore = 0;
    let totalPercent = 0;

    Object.entries(distribution).forEach(([option, percent]) => {
        if (scoreMap[option] !== undefined) {
            totalScore += scoreMap[option] * percent;
            totalPercent += percent;
        }
    });

    return totalPercent > 0 ? totalScore / totalPercent : 0;
}

export default function LectureReviewSummaryModal({ open, onClose, lecture }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [bestReview, setBestReview] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);

    useEffect(() => {
        if (open && lecture) {
            setLoading(true);
            Review.getCourseReviews(lecture.name, lecture.professor, 'likes')
                .then(({ data }) => {
                    setStats(data.stats);
                    setCourseInfo(data.courseInfo);
                    // data.reviews is sorted by likes because we passed 'likes'
                    if (data.reviews && data.reviews.length > 0) {
                        setBestReview(data.reviews[0]);
                    } else {
                        setBestReview(null);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch review summary", err);
                    setStats(null);
                    setBestReview(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, lecture]);


    if (!lecture) return null;

    const progressStats = stats ? [
        { label: '성적', value: calculateProgressValue(stats.grading, SCORE_MAP.grading), text: stats.grading },
        { label: '수업 난이도', value: calculateProgressValue(stats.difficulty, SCORE_MAP.difficulty), text: stats.difficulty },
        { label: '과제', value: calculateProgressValue(stats.assignments, SCORE_MAP.assignments), text: stats.assignments },
        { label: '팀플', value: calculateProgressValue(stats.teamProjects, SCORE_MAP.teamProjects), text: stats.teamProjects },
    ] : [];

    // Helper to find dominant trait label if needed, or just use value.
    // Simplifying: Just show the bar like CourseStatsCard. 
    // The previous design showed "Generous 80%", here we just have bar value.
    // Let's stick to the bar for consistency, or we can try to find max % label.

    const getMaxLabel = (distribution) => {
        if (!distribution) return '-';
        let maxP = -1;
        let maxL = '-';
        // Need Korean labels... importing constants is better but let's just show % of Dominant?
        // Actually the design in Modal showed "Label Percentage%".
        // Let's just default to showing the progress bar visually for now as "Text" is complicated without labels map.
        return '';
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className={classes.modal}
            disableAutoFocus
        >
            <Box className={classes.paper}>
                <IconButton className={classes.closeButton} onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>

                <Box className={classes.headerSection}>
                    <Box className={classes.headerRow}>
                        <Box display="flex" alignItems="baseline">
                            <Typography className={classes.lectureName}>{lecture.name}</Typography>
                            <Typography className={classes.lectureCode}>{lecture.code}</Typography>
                        </Box>
                        <Box className={classes.starContainer}>
                            <StarRating rating={stats?.avgRating || 0} size={20} />
                        </Box>
                    </Box>
                    <Box className={classes.headerRow}>
                        <Typography className={classes.professor}>{lecture.professor}</Typography>
                        <Typography className={classes.ratingInfo}>
                            {stats?.avgRating?.toFixed(1) || '0.0'} ({courseInfo?.reviewCount || 0})
                        </Typography>
                    </Box>
                </Box>

                {loading ? (
                    <Box className={classes.loadingContainer}>
                        <CircularProgress style={{ color: '#1A8986' }} />
                    </Box>
                ) : (
                    <>
                        {/* Stats Section */}
                        {stats && (
                            <Box className={classes.statsSection}>
                                {progressStats.map((stat) => (
                                    <Box key={stat.label} className={classes.statItem}>
                                        <Box className={classes.statLabelRow}>
                                            <span>{stat.label}</span>
                                            {/* <span>{stat.value.toFixed(0)}%</span> */}
                                            {/* Showing raw calc value % might be confusing if it's not participation, but score. 
                                                CourseStatsCard just shows bar. Let's show bar. */}
                                        </Box>
                                        <Box className={classes.statBarBg}>
                                            <Box className={classes.statBarFill} style={{ width: `${stat.value}%` }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Review Section (Best Review) */}
                        {bestReview ? (
                            <Box className={classes.reviewSection}>
                                <Box width="100%">
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
                                        {bestReview.semester}학기 수강자
                                    </Typography>
                                    <Box display="flex" alignItems="center" marginBottom="4px">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <StarRating rating={bestReview.rating} size={16} />
                                            <Typography style={{ color: '#333', fontSize: '14px', fontWeight: 700 }}>
                                                {bestReview.rating.toFixed(1)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography className={classes.reviewText}>
                                        {bestReview.comment.length > 100 ? bestReview.comment.substring(0, 100) + '...' : bestReview.comment}
                                    </Typography>
                                    <Box display="flex" justifyContent="flex-end" marginTop="5px" alignItems="center">
                                        <Typography variant="caption" style={{ color: '#D92929', fontWeight: 'bold' }}>
                                            ♥ {bestReview.likeCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <Box className={classes.reviewSection} style={{ alignItems: 'center', color: '#999' }}>
                                등록된 강의평이 없습니다.
                            </Box>
                        )}

                        {/* Footer */}
                        <Box className={classes.footer}>
                            <button className={classes.detailButton} onClick={() => alert('Detail View functionality to be linked')}>
                                강의평 상세보기 <NavigateNextIcon fontSize="small" />
                            </button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
}
