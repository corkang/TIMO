import React, { useState } from 'react';
import {
    makeStyles,
    Box,
    IconButton,
    Fab,
    Typography,
    Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CourseStatsCard from './CourseStatsCard';
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
    },
    backButton: {
        color: '#333',
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        color: '#666',
        padding: 8,
    },
    content: {
        padding: '0 20px 20px',
        flex: 1,
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
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#1b8986',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#167a77',
        },
        zIndex: 10,
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
            {/* Header with Title and Close/Write Button */}
            {/* Based on design, maybe we don't need a heavy header here if the content has it? 
          But the image shows "Subject Selected". 
          We'll keep a simple clean header or rely on CourseStatsCard.
          Actually, the CourseStatsCard is quite big.
      */}

            {/* The Design Top Image shows a Green "Write Review" button. 
          It seems to be floating or at top right. 
          Let's put it in the header for now. 
      */}

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

            <Box className={classes.content}>
                <CourseStatsCard courseInfo={courseInfo} stats={stats} />

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
