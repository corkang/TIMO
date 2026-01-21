import React from 'react';
import {
    makeStyles,
    Box,
    IconButton,
    Button
} from '@material-ui/core';
import { CourseHeader, CourseStats } from './CourseStatsCard'; // Named imports
import ReviewList from './ReviewList';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 6px',
        flexShrink: 0,
        backgroundColor: '#fff',
        zIndex: 1,
    },
    // New Wrapper for Fixed Course Info
    courseInfoWrapper: {
        padding: '0 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        flexShrink: 0,
    },
    backButton: {
        color: '#333',
    },
    content: {
        padding: '20px',
        flex: 1,
        minHeight: 0, // Ensure flex item can shrink below content size for scrolling
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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
    writeButtonHeader: {
        backgroundColor: '#1b8986',
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Noto Sans KR, sans-serif',
        padding: '6px 16px',
        borderRadius: 8,
        '&:hover': {
            backgroundColor: '#156E6B',
        },
        marginLeft: 'auto',
        marginRight: 14,
    },
}));

export default function ReviewDetailView({
    courseInfo,
    stats,
    reviews,
    sortBy,
    onSortChange,
    onLike,
    onWrite,
    onUpdateReview,
    onDeleteReview,
    onClose,
}) {
    const classes = useStyles();

    const handleDelete = (reviewId) => {
        if (window.confirm('강의평을 삭제하시겠습니까?')) {
            onDeleteReview(reviewId);
        }
    };

    const handleEdit = (review) => {
        onWrite(review); // Pass review to edit
    };

    const hasMyReview = reviews.some((review) => review.isMyReview);

    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <IconButton onClick={onClose} className={classes.backButton}>
                    <ArrowBackIcon />
                </IconButton>

                {!hasMyReview && (
                    <Button
                        variant="contained"
                        className={classes.writeButtonHeader}
                        onClick={() => onWrite(null)}
                    >
                        강의평 작성하기
                    </Button>
                )}
            </Box>

            {/* Fixed Course Header */}
            <Box className={classes.courseInfoWrapper}>
                <CourseHeader courseInfo={courseInfo} stats={stats} />
            </Box>

            {/* Scrollable Content (Stats + Reviews) */}
            <Box className={classes.content}>
                {/* Stats Section */}
                <CourseStats stats={stats} />

                <ReviewList
                    reviews={reviews}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                    onLike={onLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>
        </Box>
    );
}
