import React, { useEffect, useState } from 'react';
import { Box, IconButton, makeStyles, CircularProgress, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Review } from '../models';
import { CourseHeader, CourseStats } from './ReviewSection/CourseStatsCard';
import ReviewItem from './ReviewSection/ReviewItem';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: 'calc(40% + 30px)',
        zIndex: 1300,
        width: '500px',
        maxHeight: '600px',
        backgroundColor: '#E8F3F3',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        pointerEvents: 'auto',
        overflow: 'hidden',
        padding: '50px 24px 24px 24px',
    },
    closeButton: {
        position: 'absolute',
        right: '12px',
        top: '12px',
        padding: '8px',
        color: '#1A8986',
        '&:hover': {
            backgroundColor: 'rgba(26, 137, 134, 0.1)',
        },
        zIndex: 10,
    },
    content: {
        // padding: '0 20px 20px 20px', // Removed specific padding
        marginTop: '10px',
        overflowY: 'auto',
        flex: 1,
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ddd',
            borderRadius: '3px',
        },
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
    },
}));

export default function SearchReviewModal({ open, onClose, lecture, style }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [bestReview, setBestReview] = useState(null);

    const fetchReviews = async () => {
        if (!lecture) return;
        setLoading(true);
        try {
            const { data } = await Review.getCourseReviews(lecture.name, lecture.professor, 'likes');
            setStats(data.stats);
            setCourseInfo(data.courseInfo);

            if (data.reviews && data.reviews.length > 0) {
                setBestReview({ ...data.reviews[0], isMyReview: false });
            } else {
                setBestReview(null);
            }
        } catch (err) {
            console.error("Failed to fetch review summary", err);
            setStats(null);
            setBestReview(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && lecture) {
            fetchReviews();
        }
    }, [open, lecture]);

    if (!open || !lecture) return null;

    return (
        <Paper className={classes.root} elevation={0} style={style}>
            <IconButton className={classes.closeButton} onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>

            <CourseHeader courseInfo={courseInfo} stats={stats} />

            {loading ? (
                <Box className={classes.loadingContainer}>
                    <CircularProgress style={{ color: '#1A8986' }} />
                </Box>
            ) : (
                <Box className={classes.content}>
                    <CourseStats stats={stats} style={{ backgroundColor: '#E8F3F3', border: '1px solid #B8DAD9' }} />

                    {bestReview ? (
                        <Box mt={2}>
                            <ReviewItem review={bestReview} />
                        </Box>
                    ) : (
                        <Box mt={2} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                            등록된 강의평이 없습니다.
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}
