import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Fab,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CourseStatsCard from './CourseStatsCard';
import ReviewList from './ReviewList';
import ReviewWriteModal from './ReviewWriteModal';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      maxWidth: 700,
      width: '100%',
      maxHeight: '90vh',
      margin: 16,
    },
  },
  dialogFullScreen: {
    '& .MuiDialog-paper': {
      margin: 0,
      maxHeight: '100%',
      maxWidth: '100%',
      borderRadius: 0,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 16px 0',
  },
  closeButton: {
    color: '#666',
  },
  content: {
    padding: '0 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  reviewListContainer: {
    flex: 1,
    overflowY: 'auto',
    marginTop: 16,
  },
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    backgroundColor: '#1b8986',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#167a77',
    },
  },
  fabInDialog: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1b8986',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#167a77',
    },
  },
}));

export default function ReviewModal({
  open,
  onClose,
  courseInfo,
  stats,
  reviews,
  sortBy,
  onSortChange,
  onLike,
  onCreateReview,
  onUpdateReview,
  onDeleteReview,
  selectedCourse,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const handleOpenWriteModal = () => {
    setEditingReview(null);
    setWriteModalOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setWriteModalOpen(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('강의평을 삭제하시겠습니까?')) {
      onDeleteReview(reviewId);
    }
  };

  const handleWriteSubmit = async (data) => {
    if (editingReview) {
      const result = await onUpdateReview(editingReview.id, data);
      if (result.success) {
        setWriteModalOpen(false);
        setEditingReview(null);
      }
    } else {
      const result = await onCreateReview(data);
      if (result.success) {
        setWriteModalOpen(false);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        className={isMobile ? classes.dialogFullScreen : classes.dialog}
        scroll="paper"
      >
        <Box className={classes.header}>
          <IconButton onClick={onClose} className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent className={classes.content}>
          <CourseStatsCard courseInfo={courseInfo} stats={stats} />

          <Box className={classes.reviewListContainer}>
            <ReviewList
              reviews={reviews}
              sortBy={sortBy}
              onSortChange={onSortChange}
              onLike={onLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        </DialogContent>

        <Fab
          className={classes.fabInDialog}
          onClick={handleOpenWriteModal}
          aria-label="강의평 작성"
        >
          <EditIcon />
        </Fab>
      </Dialog>

      <ReviewWriteModal
        open={writeModalOpen}
        onClose={() => {
          setWriteModalOpen(false);
          setEditingReview(null);
        }}
        onSubmit={handleWriteSubmit}
        course={selectedCourse}
        editingReview={editingReview}
      />
    </>
  );
}
