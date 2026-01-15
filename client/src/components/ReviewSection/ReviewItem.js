import React from 'react';
import { makeStyles, Box, Typography, IconButton } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import StarRating from './StarRating';
import { REVIEW_LABELS } from '../../commons/constants';

const useStyles = makeStyles(() => ({
  item: {
    backgroundColor: '#fafafa',
    border: '1px solid #ebebeb',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column', // Changed to column to stack main row and actions
    gap: 8,
  },
  mainRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // Center vertical alignment
    gap: 16,
    width: '100%',
  },
  // Left Column: Semester + Stars
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '120px', // Fixed width
    flexShrink: 0,
    gap: 6,
  },
  semester: {
    fontSize: 13,
    color: '#1b8986',
    fontWeight: 700,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: 700,
    color: '#333',
    fontFamily: 'Lato, sans-serif',
  },
  // Middle Column: Text
  midCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 0,
  },
  comment: {
    fontSize: 14,
    color: '#222',
    lineHeight: 1.6,
    fontFamily: 'Noto Sans KR, sans-serif',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  // Right Column: Like
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '60px', // Fixed width
    flexShrink: 0,
    gap: 8,
  },
  likeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  likeButton: {
    padding: 0,
    color: '#ababab',
    '&:hover': {
      color: '#1b8986',
    },
  },
  likedButton: {
    padding: 0,
    color: '#1b8986',
  },
  likeCount: {
    fontSize: 13,
    color: '#ababab',
    fontFamily: 'Lato, sans-serif',
    minWidth: 15,
    textAlign: 'center',
  },
  // Bottom Row: Actions
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 8,
    borderTop: '1px solid #f0f0f0',
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  actionButton: {
    padding: 4,
    color: '#ababab',
    '&:hover': {
      color: '#1b8986',
    },
  },
}));


export default function ReviewItem({
  review,
  onLike,
  onEdit,
  onDelete,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.item}>
      {/* Main Row: Info, Text, Like */}
      <Box className={classes.mainRow}>
        {/* Left Column */}
        <Box className={classes.leftCol}>
          <Typography className={classes.semester}>
            {review.semester}학기 수강자
          </Typography>
          <Box className={classes.ratingContainer}>
            <StarRating rating={review.rating} size={14} />
            <Typography className={classes.ratingNumber}>
              {review.rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        {/* Middle Column */}
        <Box className={classes.midCol}>
          <Typography className={classes.comment}>{review.comment}</Typography>
        </Box>

        {/* Right Column */}
        <Box className={classes.rightCol}>
          <Box className={classes.likeSection}>
            <IconButton
              className={review.isLikedByMe ? classes.likedButton : classes.likeButton}
              onClick={() => onLike && onLike(review.id)}
              size="small"
              disabled={review.isMyReview}
            >
              {review.isLikedByMe ? (
                <ThumbUpIcon fontSize="small" />
              ) : (
                <ThumbUpOutlinedIcon fontSize="small" />
              )}
            </IconButton>
            <Typography className={classes.likeCount}>{review.likeCount}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom Row: Actions (Only for My Review) */}
      {review.isMyReview && (
        <Box className={classes.actionRow}>
          <Box className={classes.actions}>
            <IconButton
              className={classes.actionButton}
              onClick={() => onEdit && onEdit(review)}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              className={classes.actionButton}
              onClick={() => onDelete && onDelete(review.id)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
