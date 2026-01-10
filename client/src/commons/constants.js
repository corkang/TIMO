export const STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  LAST_NOTIFICATION_SEEN_AT: 'lastNotificationSeenAt',
};

export const SNACKBAR_DURATION = 2000;

export const TIMETABLE_DAYS = ['', '월', '화', '수', '목', '금'];
export const MAX_PERIOD = 9;

export const TIMETABLE_COLORSET = ["#F5C6C6", "#F5DDC7", "#F5EFC7", "#E5F5C7", "#C7F5CC", "#C7F5EF", "#C7E2F5", "#C7D5F5", "#D9C7F5", "#F5C7F3"];

export const NOTIFICATION_POSTED_AT = new Date('2022-01-13');

export const SEARCH_TABS = {
  LECTURE: '강의 검색',
  SEARCH: '강의 검색',
  BOOKMARKS: '즐겨 찾기',
  TIMETABLE: '현재 시간표',
  SPIKES: '이삭 줍기',
  SPIKE_ADD: '이삭 줍기 신청',
  VIEW_ONLY: '보기 전용',
};

export const USER_ACTIONS = {
  BOOKMARK_LECTURE: 'bookmarkLecture',
  UNBOOKMARK_LECTURE: 'unbookmarkLecture',
  ADD_SPIKE_LECTURE: 'addSpikeLecture',
  DELETE_SPIKE_LECTURE: 'deleteSpikeLecture',
  ADD_LECTURE_TO_TIMETABLE: 'addLectureToTimetable',
  DELETE_LECTURE_FROM_TIMETABLE: 'deleteLectureFromTimetable',
  GET_TIMETABLE: 'getTimetable',
  CREATE_TIMETABLE: 'createTimetable',
  DELETE_TIMETABLE: 'deleteTimetable',
  UPDATE_TIMETABLE: 'updateTimetable',
};

export const SEARCH_ACTIONS = {
  START_SEARCH: 'startSearch',
  FINISH_SEARCH: 'finishSearch',
  REFLECT_BOOKMARKS: 'reflectBookmarks',
};

export const SNACKBAR_ACTIONS = {
  ALERT_NO_CURRENT_TIMETABLE: 'alertNoCurrentTimetable',
  ALERT_NO_SHAREABLE_TIMETABLE: 'alertNoShareableTimetable',
  ALERT_NO_EDITABLE_TIMETABLE: 'alertNoEditableTimetable',
  ALERT_NO_DELETABLE_TIMETABLE: 'alertNoDeletableTimetable',
  ALERT_LECTURE_EXACT_DUP: 'alertLectureExactDup',
  ALERT_LECTURE_NAME_DUP: 'alertLectureNameDup',
  ALERT_PERIOD_DUP: 'alertPeriodDup',
  ALERT_SHARE_LINK_COPIED: 'alertShareLinkCopied',
  ALERT_MAX_SPIKES: 'alertMaxSpikes',
};

export const MODAL_ACTIONS = {
  OPEN_DELETE_LECTURE_MODAL: 'openDeleteLectureModal',
  OPEN_CREATE_TIMETABLE_MODAL: 'openCreateTimetableModal',
  OPEN_DELETE_TIMETABLE_MODAL: 'openDeleteTimetableModal',
  OPEN_EDIT_TIMETABLE_MODAL: 'openEditTimetableModal',
  OPEN_SHARE_TIMETABLE_MODAL: 'openShareTimetableModal',
  OPEN_FEEDBACK_MODAL: 'openFeedbackModal',
  OPEN_SUBMIT_CONFIRM_MODAL: 'openSubmitConfirmModal',
};

// 강의평 관련 상수
export const REVIEW_ACTIONS = {
  SET_MY_COURSES: 'setMyCourses',
  SET_SEARCH_RESULTS: 'setSearchResults',
  SET_SEARCH_QUERY: 'setSearchQuery',
  SELECT_COURSE: 'selectCourse',
  SET_REVIEWS: 'setReviews',
  ADD_REVIEW: 'addReview',
  UPDATE_REVIEW: 'updateReview',
  DELETE_REVIEW: 'deleteReview',
  TOGGLE_LIKE: 'toggleLike',
  SET_SORT: 'setSort',
  SET_LOADING: 'setLoading',
  CLEAR_SELECTION: 'clearSelection',
};

// 평가 항목 옵션
export const REVIEW_CRITERIA = {
  grading: ['generous', 'normal', 'tight', 'survival'],
  difficulty: ['easy', 'low', 'mid', 'normal', 'hard'],
  exams: ['none', 'normal', 'hard'],
  assignments: ['none', 'normal', 'heavy'],
  teamProjects: ['none', 'normal', 'heavy'],
  onlineOfflineRatio: ['offline', 'half', 'online'],
  teachingMethod: ['theory', 'discussion', 'project'],
};

// 평가 항목 한글 라벨
export const REVIEW_LABELS = {
  grading: {
    generous: '너그러움',
    normal: '보통',
    tight: '깐깐함',
    survival: '생존',
  },
  difficulty: {
    easy: '쉬움',
    low: '1~2점',
    mid: '3점 이상',
    normal: '보통',
    hard: '어려움',
  },
  exams: {
    none: '없음',
    normal: '보통',
    hard: '어려움',
  },
  assignments: {
    none: '없음',
    normal: '보통',
    heavy: '많음',
  },
  teamProjects: {
    none: '없음',
    normal: '보통',
    heavy: '많음',
  },
  onlineOfflineRatio: {
    offline: '100% 오프라인',
    half: '50% 반반',
    online: '100% 온라인',
  },
  teachingMethod: {
    theory: '이론 중심',
    discussion: '토론 중심',
    project: '프로젝트 중심',
  },
};

// 학기 옵션 생성 (최근 4학기)
export const SEMESTER_OPTIONS = (() => {
  const now = new Date();
  const year = now.getFullYear() % 100;
  const month = now.getMonth() + 1;
  const currentSemester = month >= 7 ? 2 : 1;
  const options = [];

  for (let i = 0; i < 4; i++) {
    let y = year;
    let s = currentSemester;
    s -= i;
    while (s <= 0) {
      s += 2;
      y -= 1;
    }
    options.push(`${y}-${s}`);
  }
  return options;
})();

// 정렬 옵션
export const REVIEW_SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'likes', label: '좋아요순' },
  { value: 'rating', label: '별점순' },
];
