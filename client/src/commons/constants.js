export const STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  LAST_NOTIFICATION_SEEN_AT: 'lastNotificationSeenAt',
};

export const SNACKBAR_DURATION = 2000;

export const TIMETABLE_DAYS = ['', '월', '화', '수', '목', '금'];
export const MAX_PERIOD = 9;

export const TIMETABLE_COLORSET = ["#F5C6C6", "#F5DDC7", "#F5EFC7", "#E5F5C7", "#C7F5CC", "#C7F5EF", "#C7E2F5", "#C7D5F5", "#D9C7F5", "#F5C7F3"];

// 1교시: 08:30 ~ 09:45
// 2교시: 10:00 ~ 11:15
// 3교시: 11:30 ~ 12:45
// 4교시: 13:00 ~ 14:15
// 5교시: 14:30 ~ 15:45
// 6교시: 16:00 ~ 17:15
// 7교시: 17:30 ~ 18:45
// 8교시: 19:00 ~ 20:15
// 9교시: 20:30 ~ 21:45
export const PERIOD_HOURS_MAP = {
  1: { start: { h: 8, m: 30 }, end: { h: 9, m: 45 } },
  2: { start: { h: 10, m: 0 }, end: { h: 11, m: 15 } },
  3: { start: { h: 11, m: 30 }, end: { h: 12, m: 45 } },
  4: { start: { h: 13, m: 0 }, end: { h: 14, m: 15 } },
  5: { start: { h: 14, m: 30 }, end: { h: 15, m: 45 } },
  6: { start: { h: 16, m: 0 }, end: { h: 17, m: 15 } },
  7: { start: { h: 17, m: 30 }, end: { h: 18, m: 45 } },
  8: { start: { h: 19, m: 0 }, end: { h: 20, m: 15 } },
  9: { start: { h: 20, m: 30 }, end: { h: 21, m: 45 } },
};

export const TIMETABLE_START_HOUR = 8;
export const TIMETABLE_END_HOUR = 22;

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
  SWAP_TIMETABLE: 'swapTimetable',
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
  ALERT_ALREADY_REPRESENTATIVE: 'alertAlreadyRepresentative',
  ALERT_SET_REPRESENTATIVE: 'alertSetRepresentative',
};

export const MODAL_ACTIONS = {
  OPEN_DELETE_LECTURE_MODAL: 'openDeleteLectureModal',
  OPEN_CREATE_TIMETABLE_MODAL: 'openCreateTimetableModal',
  OPEN_DELETE_TIMETABLE_MODAL: 'openDeleteTimetableModal',
  OPEN_EDIT_TIMETABLE_MODAL: 'openEditTimetableModal',
  OPEN_SHARE_TIMETABLE_MODAL: 'openShareTimetableModal',
  OPEN_FEEDBACK_MODAL: 'openFeedbackModal',
  OPEN_SUBMIT_CONFIRM_MODAL: 'openSubmitConfirmModal',
  OPEN_COMING_SOON_MODAL: 'openComingSoonModal',
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
  grading: ['generous', 'normal', 'tight'],
  difficulty: ['easy', 'normal', 'hard'],
  exams: ['none', 'normal', 'hard'],
  quiz: ['none', 'normal', 'hard'],
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
  },
  difficulty: {
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
  },
  exams: {
    none: '없음',
    normal: '1~2회',
    hard: '3회 이상',
  },
  quiz: {
    none: '없음',
    normal: '1~2회',
    hard: '3회 이상',
  },
  assignments: {
    heavy: '많음',
    normal: '보통',
    none: '없음',
  },
  teamProjects: {
    heavy: '많음',
    normal: '보통',
    none: '없음',
  },
  onlineOfflineRatio: {
    offline: '100% 오프라인',
    half: '50% 반반',
    online: '100% 온라인',
  },
  teachingMethod: {
    theory: '이론 중심(강의 위주)',
    discussion: '토론 중심(학생 참여형)',
    project: '프로젝트 중심(팀 과제/발표)',
  },
};

// 학기 옵션 생성 (최근 4학기)
export const SEMESTER_OPTIONS = ["25-2", "25-1", "24-2", "24-1", "23년도 이전"]
// export const SEMESTER_OPTIONS = (() => {
//   const now = new Date();
//   const year = now.getFullYear() % 100;
//   const month = now.getMonth() + 1;
//   const currentSemester = month >= 7 ? 2 : 1;
//   const options = [];

//   for (let i = 0; i < 4; i++) {
//     let y = year;
//     let s = currentSemester;
//     s -= i;
//     while (s <= 0) {
//       s += 2;
//       y -= 1;
//     }
//     options.push(`${y}-${s}`);
//   }
//   return options;
// })();

// 정렬 옵션
export const REVIEW_SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'likes', label: '좋아요순' },
];
