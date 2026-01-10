import { Axios } from '../lib/axios';

export default class Review {
  // 강의평이 있는 과목 목록 검색
  static searchCourses = async (search = '') =>
    await Axios().get(`/review/courses`, { params: { search } });

  // 특정 과목의 강의평 목록 + 통계
  static getCourseReviews = async (name, professor, sort = 'latest') =>
    await Axios().get(`/review/course`, { params: { name, professor, sort } });

  // 내가 작성한 강의평 목록
  static getMyReviews = async () => await Axios().get(`/review/my`);

  // 강의평 작성
  static createReview = async (data) => await Axios().post(`/review`, data);

  // 강의평 수정
  static updateReview = async (reviewId, data) =>
    await Axios().put(`/review/${reviewId}`, data);

  // 강의평 삭제
  static deleteReview = async (reviewId) =>
    await Axios().delete(`/review/${reviewId}`);

  // 좋아요 토글
  static toggleLike = async (reviewId) =>
    await Axios().post(`/review/${reviewId}/like`);
}
