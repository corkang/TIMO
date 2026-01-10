import { useReducer, useCallback } from 'react';
import { REVIEW_ACTIONS } from '../commons/constants';
import { Review } from '../models';

const initialState = {
  myCourses: [],
  searchResults: [],
  searchQuery: '',
  selectedCourse: null,
  reviews: [],
  stats: null,
  courseInfo: null,
  sortBy: 'latest',
  loading: false,
};

function reviewReducer(state, { type, payload }) {
  switch (type) {
    case REVIEW_ACTIONS.SET_MY_COURSES:
      return { ...state, myCourses: payload };

    case REVIEW_ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: payload };

    case REVIEW_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: payload };

    case REVIEW_ACTIONS.SELECT_COURSE:
      return { ...state, selectedCourse: payload };

    case REVIEW_ACTIONS.SET_REVIEWS:
      return {
        ...state,
        reviews: payload.reviews,
        stats: payload.stats,
        courseInfo: payload.courseInfo,
      };

    case REVIEW_ACTIONS.ADD_REVIEW: {
      const newReview = payload;
      return {
        ...state,
        reviews: [newReview, ...state.reviews],
        courseInfo: state.courseInfo
          ? { ...state.courseInfo, reviewCount: state.courseInfo.reviewCount + 1 }
          : null,
      };
    }

    case REVIEW_ACTIONS.UPDATE_REVIEW: {
      const { reviewId, data } = payload;
      return {
        ...state,
        reviews: state.reviews.map((r) => (r.id === reviewId ? { ...r, ...data } : r)),
      };
    }

    case REVIEW_ACTIONS.DELETE_REVIEW: {
      const { reviewId } = payload;
      return {
        ...state,
        reviews: state.reviews.filter((r) => r.id !== reviewId),
        courseInfo: state.courseInfo
          ? { ...state.courseInfo, reviewCount: state.courseInfo.reviewCount - 1 }
          : null,
      };
    }

    case REVIEW_ACTIONS.TOGGLE_LIKE: {
      const { reviewId, liked, likeCount } = payload;
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? { ...r, isLikedByMe: liked, likeCount } : r,
        ),
      };
    }

    case REVIEW_ACTIONS.SET_SORT:
      return { ...state, sortBy: payload };

    case REVIEW_ACTIONS.SET_LOADING:
      return { ...state, loading: payload };

    case REVIEW_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedCourse: null,
        reviews: [],
        stats: null,
        courseInfo: null,
      };

    default:
      return state;
  }
}

export default function useReview() {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // 과목 검색
  const searchCourses = useCallback(async (query) => {
    dispatch({ type: REVIEW_ACTIONS.SET_SEARCH_QUERY, payload: query });
    dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await Review.searchCourses(query);
      dispatch({ type: REVIEW_ACTIONS.SET_SEARCH_RESULTS, payload: data.courses });
    } catch (error) {
      console.error('Failed to search courses:', error);
    } finally {
      dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // 과목 선택 시 강의평 로드
  const selectCourse = useCallback(
    async (course) => {
      dispatch({ type: REVIEW_ACTIONS.SELECT_COURSE, payload: course });
      dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: true });
      try {
        const { data } = await Review.getCourseReviews(
          course.courseName,
          course.professor,
          state.sortBy,
        );
        dispatch({ type: REVIEW_ACTIONS.SET_REVIEWS, payload: data });
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: false });
      }
    },
    [state.sortBy],
  );

  // 정렬 변경
  const changeSortBy = useCallback(
    async (sort) => {
      dispatch({ type: REVIEW_ACTIONS.SET_SORT, payload: sort });
      if (state.selectedCourse) {
        dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: true });
        try {
          const { data } = await Review.getCourseReviews(
            state.selectedCourse.courseName,
            state.selectedCourse.professor,
            sort,
          );
          dispatch({ type: REVIEW_ACTIONS.SET_REVIEWS, payload: data });
        } catch (error) {
          console.error('Failed to reload reviews:', error);
        } finally {
          dispatch({ type: REVIEW_ACTIONS.SET_LOADING, payload: false });
        }
      }
    },
    [state.selectedCourse],
  );

  // 강의평 작성
  const createReview = useCallback(async (reviewData) => {
    try {
      const { data } = await Review.createReview(reviewData);
      return { success: true, reviewId: data.reviewId };
    } catch (error) {
      console.error('Failed to create review:', error);
      return { success: false, error: error.response?.data?.error || '작성 실패' };
    }
  }, []);

  // 강의평 수정
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      await Review.updateReview(reviewId, reviewData);
      dispatch({
        type: REVIEW_ACTIONS.UPDATE_REVIEW,
        payload: { reviewId, data: reviewData },
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to update review:', error);
      return { success: false, error: error.response?.data?.error || '수정 실패' };
    }
  }, []);

  // 강의평 삭제
  const deleteReview = useCallback(async (reviewId) => {
    try {
      await Review.deleteReview(reviewId);
      dispatch({ type: REVIEW_ACTIONS.DELETE_REVIEW, payload: { reviewId } });
      return { success: true };
    } catch (error) {
      console.error('Failed to delete review:', error);
      return { success: false, error: error.response?.data?.error || '삭제 실패' };
    }
  }, []);

  // 좋아요 토글
  const toggleLike = useCallback(async (reviewId) => {
    try {
      const { data } = await Review.toggleLike(reviewId);
      dispatch({
        type: REVIEW_ACTIONS.TOGGLE_LIKE,
        payload: { reviewId, liked: data.liked, likeCount: data.likeCount },
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return { success: false };
    }
  }, []);

  // 선택 해제
  const clearSelection = useCallback(() => {
    dispatch({ type: REVIEW_ACTIONS.CLEAR_SELECTION });
  }, []);

  return {
    state,
    dispatch,
    searchCourses,
    selectCourse,
    changeSortBy,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
    clearSelection,
  };
}
