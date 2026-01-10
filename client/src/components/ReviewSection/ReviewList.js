import React from 'react';
import { makeStyles, Box, Typography, Select, MenuItem, FormControl } from '@material-ui/core';
import ReviewItem from './ReviewItem';
import { REVIEW_SORT_OPTIONS } from '../../commons/constants';

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  sortSelect: {
    minWidth: 100,
    '& .MuiSelect-root': {
      fontSize: 14,
      padding: '6px 12px',
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#ababab',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
}));

export default function ReviewList({
  reviews,
  sortBy,
  onSortChange,
  onLike,
  onEdit,
  onDelete,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Typography className={classes.title}>강의평</Typography>
        <FormControl variant="outlined" size="small">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={classes.sortSelect}
          >
            {REVIEW_SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {reviews.length === 0 ? (
        <Box className={classes.emptyState}>
          <Typography className={classes.emptyText}>
            아직 작성된 강의평이 없습니다.
          </Typography>
          <Typography className={classes.emptySubtext}>
            첫 번째 강의평을 작성해 주세요!
          </Typography>
        </Box>
      ) : (
        reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onLike={onLike}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </Box>
  );
}
