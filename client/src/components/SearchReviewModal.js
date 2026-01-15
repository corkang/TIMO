import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, makeStyles, CircularProgress, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Review } from '../models';
import StarRating from './ReviewSection/StarRating';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        // left: 'calc(40% + 7% + 30px)', // Moved to inline style or keep here if it's constant relative to body
        // 40% (search width) + 30px (gap)
        // But body has padding: '30px 7%', so the search section width is 40% of (100% - 14%).
        // Wait, flex-basis is 40%. The gap is 30px.
        // It's safer to rely on the visual column gap requested: "searchsection에서 column-gap 만큼만 띄워서".
        // SearchSection is the first child of body.
        // If I put Modal inside Body, "left" should be calculated relative to Body's content box?
        // Let's assume the Body has `position: relative`.
        // Left = 40% (SearchSection) + 30px (Gap).
        // Check `TimeTablePage` styles: `gap: 30`. `searchSection` flex: `0 0 40%`.
        // So `left: 'calc(40% + 30px)'` should be correct relative to the flex container (body).
        left: 'calc(40% + 30px)',
        zIndex: 1300,
        width: '420px',
        maxHeight: '400px', // Limit height to keep it compact
        backgroundColor: '#E8F3F3',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        outline: 'none',
        pointerEvents: 'auto',
    },
    closeButton: {
        position: 'absolute',
        right: '12px',
        top: '12px',
        padding: '5px',
        color: '#1A8986',
        '&:hover': {
            backgroundColor: 'rgba(26, 137, 134, 0.1)',
        },
    },
    headerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerInfoLeft: {
        display: 'flex',
        flexDirection: 'column',
    },
    headerInfoRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: '10px',
        marginRight: '20px', // Avoid overlap with close button slightly if needed, or rely on spacing
    },
    titleRow: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: '4px',
    },
    lectureName: {
        fontFamily: 'Noto Sans KR',
        fontWeight: 700,
        fontSize: '18px',
        color: '#333333',
        marginRight: '6px',
        letterSpacing: '-0.5px',
    },
    lectureCode: {
        fontFamily: 'Lato',
        fontSize: '12px',
        color: '#999999',
        textDecoration: 'underline',
    },
    professor: {
        fontFamily: 'Noto Sans KR',
        fontWeight: 500,
        fontSize: '13px',
        color: '#666666',
    },
    ratingScore: {
        fontFamily: 'Lato',
        fontSize: '13px',
        color: '#999999',
        marginTop: '2px',
    },
    statsSection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px 16px',
        marginBottom: '4px',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        backgroundColor: 'rgba(26, 137, 134, 0.08)', // Faint teal background
        padding: '10px 12px',
        borderRadius: '8px',
    },
    statLabelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#555555',
        fontFamily: 'Noto Sans KR',
    },
    statValueText: {
        fontSize: '11px',
        fontWeight: 400,
        color: '#1A8986',
    },
    statBarBg: {
        width: '100%',
        height: '4px',
        backgroundColor: '#E0E0E0',
        borderRadius: '2px',
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
        backgroundColor: '#1A8986',
        borderRadius: '2px',
    },
    reviewSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        gap: '16px',
    },
    reviewCol1: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minWidth: '80px',
        borderRight: '1px solid #EEEEEE',
        paddingRight: '12px',
    },
    reviewCol2: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
    },
    reviewCol3: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        minWidth: '40px',
    },
    reviewSemester: {
        fontSize: '12px',
        color: '#999999',
        marginBottom: '4px',
    },
    reviewText: {
        fontSize: '13px',
        color: '#444444',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        marginBottom: 0,
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
    },
}));

const SCORE_MAP = {
    grading: { generous: 100, normal: 50, tight: 0, survival: 0 },
    difficulty: { hard: 100, normal: 50, easy: 0 },
    assignments: { heavy: 100, normal: 50, none: 0 },
    teamProjects: { heavy: 100, normal: 50, none: 0 },
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

    return totalPercent > 0 ? (totalScore / totalPercent) : 0;
}

function getStatLabel(category, score) {
    if (category === 'grading') {
        if (score <= 33) return '깐깐함';
        if (score <= 66) return '보통';
        return '잘 주심';
    }
    if (category === 'difficulty') {
        if (score <= 33) return '쉬움';
        if (score <= 66) return '보통';
        return '어려움';
    }
    if (category === 'assignments') {
        if (score <= 33) return '적음';
        if (score <= 66) return '보통';
        return '많음';
    }
    if (category === 'teamProjects') {
        if (score <= 33) return '없음';
        if (score <= 66) return '보통';
        return '많음';
    }
    return '-';
}

export default function SearchReviewModal({ open, onClose, lecture, style }) {
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

    if (!open || !lecture) return null;

    const getStatData = (category, labelText) => {
        if (!stats || !stats[category]) return { label: labelText, valueText: '-', barValue: 0 };
        const score = calculateProgressValue(stats[category], SCORE_MAP[category]);
        const valueText = getStatLabel(category, score);
        return {
            label: labelText,
            valueText,
            barValue: score
        };
    };

    const progressStats = [
        getStatData('grading', '성적'),
        getStatData('difficulty', '수업 난이도'),
        getStatData('assignments', '과제'),
        getStatData('teamProjects', '팀플'),
    ];

    return (
        <Paper className={classes.root} elevation={0} style={style}>
            <IconButton className={classes.closeButton} onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
            </IconButton>

            <Box className={classes.headerSection}>
                <Box className={classes.headerInfoLeft}>
                    <Box className={classes.titleRow}>
                        <Typography className={classes.lectureName}>{lecture.name}</Typography>
                        <Typography className={classes.lectureCode}>{lecture.code}</Typography>
                    </Box>
                    <Typography className={classes.professor}>{lecture.professor}</Typography>
                </Box>
                <Box className={classes.headerInfoRight}>
                    <StarRating rating={stats?.avgRating || 0} size={24} />
                    <Typography className={classes.ratingScore}>
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
                    <Box className={classes.statsSection}>
                        {progressStats.map((stat) => (
                            <Box key={stat.label} className={classes.statItem}>
                                <Box className={classes.statLabelRow}>
                                    <span>{stat.label}</span>
                                    <span className={classes.statValueText}>
                                        {stat.valueText} {Math.round(stat.barValue)}%
                                    </span>
                                </Box>
                                <Box className={classes.statBarBg}>
                                    <Box className={classes.statBarFill} style={{ width: `${stat.barValue}%` }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {bestReview ? (
                        <Box className={classes.reviewSection}>
                            <Box className={classes.reviewCol1}>
                                <Typography className={classes.reviewSemester}>
                                    {bestReview.semester}학기
                                </Typography>
                                <StarRating rating={bestReview.rating} size={14} />
                                <Typography style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                    {bestReview.rating.toFixed(1)}
                                </Typography>
                            </Box>

                            <Box className={classes.reviewCol2}>
                                <Typography className={classes.reviewText}>
                                    {bestReview.comment.length > 70 ? bestReview.comment.substring(0, 70) + '...' : bestReview.comment}
                                </Typography>
                            </Box>

                            <Box className={classes.reviewCol3}>
                                <Typography variant="caption" style={{ color: '#D92929', fontWeight: 'bold' }}>
                                    ♥ {bestReview.likeCount}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box className={classes.reviewSection} style={{ justifyContent: 'center', color: '#999' }}>
                            등록된 강의평이 없습니다.
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
}
