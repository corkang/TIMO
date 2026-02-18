import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  makeStyles,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  TextField,
  InputAdornment,
  Button,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import { CourseCard } from '../components/ReviewSection';
import ReviewDetailView from '../components/ReviewSection/ReviewDetailView';
import ReviewWriteView from '../components/ReviewSection/ReviewWriteView';
import useReview from '../hooks/useReview';
import { useUser } from '../hooks';
import { Lecture, Review } from '../models';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '30px 7%',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 30,
    height: 'calc(100vh - 210px)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  leftSection: {
    flex: '0 0 40%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 8px 23px 25px', // Removed right padding
    height: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  rightSection: {
    flex: '0 0 60%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto',
      height: 'calc(100vh - 200px)',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexShrink: 0,
    paddingRight: '25px', // Compensate for parent padding removal
  },
  sectionTitle: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 24,
    color: '#1A8986',
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    flexShrink: 0,
    paddingRight: '25px', // Compensate for parent padding removal
  },
  lectureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    overflowY: 'auto',
    overflowX: 'hidden',
    // backgroundColor: '#F5F5F5', // Removed for seamless look
    // borderRadius: '12px', // Removed for seamless look
    padding: '5px', // Reduced padding to match SearchSection
    minHeight: 0,
    maxHeight: 'calc(100% - 80px)',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#E8E8E8',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#B8DAD9',
      borderRadius: '10px',
      '&:hover': {
        backgroundColor: '#1A8986',
      },
    },
  },
  searchFieldWrapper: {
    width: '45%',
    marginBottom: 16,
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fafafa',
      '& fieldset': {
        borderColor: '#B8DAD9',
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: '#1b8986',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1b8986',
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      fontFamily: 'Lato, Noto Sans KR, sans-serif',
      padding: '12px 14px',
      '&::placeholder': {
        color: '#ccc',
        opacity: 1,
      },
    },
  },
  searchIcon: {
    color: '#B8DAD9',
    fontSize: 22,
  },
  contentContainer: {
    backgroundColor: '#E8F3F3',
    borderRadius: 16,
    padding: '20px 12px 20px 20px',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden', // Ensure Container doesn't scroll
  },
  searchResultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: 8,
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#d0e8e8',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#1A8986',
      borderRadius: '10px',
      '&:hover': {
        backgroundColor: '#156E6B',
      },
    },
    [theme.breakpoints.down('sm')]: {
      '&::-webkit-scrollbar': {
        width: '4px',
      },
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
  },
  emptyState: {
    textAlign: 'center',
    padding: 40,
    color: '#666',
    fontSize: 14,
  },
  snackbar: {
    '& .MuiSnackbarContent-root': {
      backgroundColor: '#333',
      fontFamily: 'Noto Sans KR, sans-serif',
    },
  },
}));

export default function ReviewPage() {
  const classes = useStyles();
  const [{ timetables }] = useUser();
  const listRef = useRef(null);

  const {
    state,
    selectCourse,
    changeSortBy,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
  } = useReview();

  // 'search', 'detail', 'write'
  const [viewMode, setViewMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [lectures, setLectures] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lecturesLoading, setLecturesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  // 첫 번째 시간표(대표시간표) 강의 목록
  const firstTimetable = timetables[0] || { lectures: [] };
  const myLectures = firstTimetable.lectures || [];

  // 초기 강의 목록 로드 (20개)
  const loadLectures = useCallback(async (pageNum, query = '', reset = false) => {
    if (reset) {
      setLecturesLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const { data } = await Lecture.getSearchResults(query, pageNum, 20, true);
      const newLectures = data.lectures || [];
      // console.log('[DEBUG] ReviewPage lectures:', newLectures);

      if (reset) {
        setLectures(newLectures);
      } else {
        setLectures((prev) => [...prev, ...newLectures]);
      }

      // 더 이상 데이터가 없으면 hasMore를 false로
      setHasMore(newLectures.length >= 20);
    } catch (error) {
      console.error('Failed to load lectures:', error);
    } finally {
      setLecturesLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadLectures(1, '', true);
  }, [loadLectures]);

  // 검색어 변경 시 새로 로드
  useEffect(() => {
    if (searchQuery) {
      // If user types, switch to search mode automatically
      if (viewMode !== 'search') setViewMode('search');
    }

    const timeoutId = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadLectures(1, searchQuery, true);
    }, 300); // 디바운스 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadLectures]);

  // 무한 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (!listRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    // 하단에서 100px 이내로 스크롤하면 추가 로드
    if (scrollHeight - scrollTop - clientHeight < 100) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLectures(nextPage, searchQuery, false);
    }
  }, [loadingMore, hasMore, page, searchQuery, loadLectures]);

  // 강의평 보기 클릭 (Detail View 로 전환)
  const handleViewReviews = useCallback(
    async (course) => {
      try {
        const { data } = await Review.getCourseReviews(
          course.name || course.courseName,
          course.professor,
          'latest',
        );

        selectCourse({
          courseName: course.name || course.courseName,
          courseCode: course.code || course.courseCode,
          professor: course.professor,
        });

        // 데이터가 없어도 Detail View로 이동 (작성 유도)
        setViewMode('detail');

      } catch (error) {
        // 에러 시에도 일단 이동 시도 (빈 상태)
        selectCourse({
          courseName: course.name || course.courseName,
          courseCode: course.code || course.courseCode,
          professor: course.professor,
        });
        setViewMode('detail');
      }
    },
    [selectCourse],
  );

  const handleGlobalWriteClick = () => {
    if (state.selectedCourse) {
      setEditingReview(null);
      setViewMode('write');
    } else {
      setSnackbarMessage('리스트에서 과목을 선택한 후 작성해주세요.');
      setSnackbarOpen(true);
    }
  };

  const handleWriteClickFromDetail = (reviewToEdit = null) => {
    setEditingReview(reviewToEdit);
    setViewMode('write');
  };

  const handleCreateReview = async (data) => {
    const result = await createReview(data);
    if (result.success && state.selectedCourse) {
      // Re-fetch reviews or update state logic is inside createReview usually,
      // but here we might need to manually ensure it acts like SelectCourse
      await selectCourse(state.selectedCourse); // Refresh logic
      setViewMode('detail');
    }
    return result;
  };

  const handleUpdateReview = async (reviewId, data) => {
    const result = await updateReview(reviewId, data);
    if (result.success && state.selectedCourse) {
      await selectCourse(state.selectedCourse);
      setViewMode('detail');
    }
    return result;
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await deleteReview(reviewId);
    if (result.success && state.selectedCourse) {
      selectCourse(state.selectedCourse);
    }
    return result;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 내 강의를 CourseCard 형식으로 변환
  const convertLectureToCourse = (lecture) => ({
    courseName: lecture.name,
    courseCode: lecture.code,
    professor: lecture.professor,
    period: lecture.period,
    credit: lecture.credit,
    avgRating: lecture.reviewStats?.avgRating || 0,
    reviewCount: lecture.reviewStats?.reviewCount || 0,
  });

  // Render Content based on viewMode
  const renderRightContent = () => {
    if (viewMode === 'write' && state.selectedCourse) {
      return (
        <ReviewWriteView
          course={state.selectedCourse}
          editingReview={editingReview}
          onSubmit={editingReview ? (data) => handleUpdateReview(editingReview.id, data) : handleCreateReview}
          onCancel={() => setViewMode('detail')}
        />
      );
    }
    else if (viewMode === 'detail' && state.selectedCourse) {
      return (
        <ReviewDetailView
          courseInfo={state.courseInfo}
          stats={state.stats}
          reviews={state.reviews}
          sortBy={state.sortBy}
          onSortChange={changeSortBy}
          onLike={toggleLike}
          onWrite={handleWriteClickFromDetail}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
          onClose={() => setViewMode('search')}
        />
      );
    }
    // Default: Search Results
    return (
      <>
        {lecturesLoading ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress style={{ color: '#1b8986' }} />
          </Box>
        ) : lectures.length > 0 ? (
          <Box
            className={classes.searchResultsList}
            ref={listRef}
            onScroll={handleScroll}
          >
            {lectures.map((lecture) => (
              <CourseCard
                key={lecture.id}
                course={convertLectureToCourse(lecture)}
                onViewReviews={() => handleViewReviews(lecture)}
                showPeriod={false}
              />
            ))}
            {loadingMore && (
              <Box className={classes.loadMoreContainer}>
                <CircularProgress size={24} style={{ color: '#1b8986' }} />
              </Box>
            )}
          </Box>
        ) : (
          <Typography className={classes.emptyState}>
            {searchQuery
              ? '검색 결과가 없습니다.'
              : '등록된 강의가 없습니다.'}
          </Typography>
        )}
      </>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.body}>
        {/* 왼쪽: 현재 수강 중인 내 강의 */}
        <Box className={classes.leftSection}>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>
              현재 수강 중인 내 강의
            </Typography>
          </Box>
          <Typography className={classes.noticeText}>* 대표시간표 기준</Typography>
          <Box className={classes.lectureList}>
            {myLectures.length > 0 ? (
              myLectures.map((lecture) => (
                <CourseCard
                  key={lecture.id}
                  course={convertLectureToCourse(lecture)}
                  onViewReviews={() => handleViewReviews(lecture)}
                  showPeriod={true}
                  showFullCode={true}
                />
              ))
            ) : (
              <Typography className={classes.emptyState}>
                시간표에 담긴 과목이 없습니다.
              </Typography>
            )}
          </Box>
        </Box>

        {/* 오른쪽: 강의 검색 및 목록 */}
        <Box className={classes.rightSection}>
          <Box className={classes.searchFieldWrapper}>
            <TextField
              variant="outlined"
              placeholder="강의명/교수명/과목코드"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={classes.searchField}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className={classes.searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className={classes.contentContainer}>
            {renderRightContent()}
          </Box>
        </Box>
      </Box>

      {/* 토스트 메시지 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        className={classes.snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
