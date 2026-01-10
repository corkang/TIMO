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
    padding: 16,
    marginBottom: 12,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  semester: {
    fontSize: 13,
    color: '#1b8986',
    fontWeight: 500,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e8f3f3',
    color: '#1b8986',
    fontSize: 12,
    padding: '3px 8px',
    borderRadius: 4,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 1.6,
    marginBottom: 12,
    fontFamily: 'Noto Sans KR, sans-serif',
    whiteSpace: 'pre-wrap',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  likeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  likeButton: {
    padding: 4,
    color: '#ababab',
    '&:hover': {
      color: '#1b8986',
    },
  },
  likedButton: {
    padding: 4,
    color: '#1b8986',
  },
  likeCount: {
    fontSize: 13,
    color: '#ababab',
    fontFamily: 'Lato, sans-serif',
  },
  actions: {
    display: 'flex',
    gap: 4,
  },
  actionButton: {
    padding: 4,
    color: '#ababab',
    '&:hover': {
      color: '#1b8986',
    },
  },
  date: {
    fontSize: 12,
    color: '#ababab',
    fontFamily: 'Lato, sans-serif',
  },
}));

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

export default function ReviewItem({
  review,
  onLike,
  onEdit,
  onDelete,
}) {
  const classes = useStyles();

  const badges = [
    { key: 'grading', label: REVIEW_LABELS.grading[review.grading] },
    { key: 'difficulty', label: REVIEW_LABELS.difficulty[review.difficulty] },
    { key: 'exams', label: `시험: ${REVIEW_LABELS.exams[review.exams]}` },
    { key: 'assignments', label: `과제: ${REVIEW_LABELS.assignments[review.assignments]}` },
    { key: 'teamProjects', label: `팀플: ${REVIEW_LABELS.teamProjects[review.teamProjects]}` },
  ];

  return (
    <Box className={classes.item}>
      <Box className={classes.header}>
        <Box>
          <Typography className={classes.semester}>
            {review.semester}학기 수강자
          </Typography>
          <Box className={classes.ratingRow}>
            <StarRating rating={review.rating} size={16} />
          </Box>
        </Box>
        <Typography className={classes.date}>
          {getRelativeTime(review.createdAt)}
        </Typography>
      </Box>

      <Box className={classes.badges}>
        {badges.map((badge) => (
          <span key={badge.key} className={classes.badge}>
            {badge.label}
          </span>
        ))}
      </Box>

      <Typography className={classes.comment}>{review.comment}</Typography>

      <Box className={classes.footer}>
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

        {review.isMyReview && (
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
        )}
      </Box>
    </Box>
  );
}
