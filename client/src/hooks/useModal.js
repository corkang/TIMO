import { useState } from 'react';
import { MODAL_ACTIONS } from '../commons/constants';

const initialModalState = {
  open: false,
  onSubmit: () => { },
  isInputRequired: false,
  modalType: 'DEFAULT',
  text: {
    title: '',
    placeholder: '',
    button: '',
  },
};

const getOpenModalState = ({ onSubmit, isInputRequired = true, text, modalType = 'DEFAULT' }) => ({
  open: true,
  isInputRequired,
  onSubmit,
  text,
  modalType,
});

function searchReducer(state, { type, payload }) {
  switch (type) {
    case MODAL_ACTIONS.OPEN_DELETE_LECTURE_MODAL: {
      const { onSubmit, lectureName } = payload;
      return getOpenModalState({
        onSubmit,
        isInputRequired: false,
        text: {
          title: `'${lectureName}' 과목을 삭제하시겠습니까?`,
          button: '확인',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_CREATE_TIMETABLE_MODAL: {
      const { onSubmit } = payload;
      return getOpenModalState({
        onSubmit,
        text: {
          title: '시간표를 생성하시겠습니까?',
          placeholder: '시간표 이름',
          button: '생성',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_DELETE_TIMETABLE_MODAL: {
      const { onSubmit, timetableTitle } = payload;
      return getOpenModalState({
        onSubmit,
        isInputRequired: false,
        text: {
          title: `'${timetableTitle}'을(를) 삭제하시겠습니까?`,
          button: '확인',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_EDIT_TIMETABLE_MODAL: {
      const { onSubmit } = payload;
      return getOpenModalState({
        onSubmit,
        text: {
          title: '시간표 이름을 변경하시겠습니까?',
          placeholder: '시간표 이름',
          button: '변경',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_SHARE_TIMETABLE_MODAL: {
      const { onSubmit } = payload;
      return getOpenModalState({
        onSubmit,
        isInputRequired: false,
        text: {
          title: '공유 링크를 복사하시겠습니까?',
          button: '복사',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_FEEDBACK_MODAL: {
      const { onSubmit } = payload;
      return getOpenModalState({
        onSubmit,
        modalType: 'FEEDBACK',
        text: {
          title: 'TimO에게 의견 보내기',
          caption: 'TimO를 더 나은 서비스로 만들기 위한 여러분들의 소중한 의견을 기다립니다.',
          placeholder: '피드백이나 버그 상황을 자세히 알려주시면 더 빠르게 반영/해결할 수 있습니다!',
          button: '제출하기',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_SUBMIT_CONFIRM_MODAL: {
      const { onSubmit } = payload;
      return getOpenModalState({
        onSubmit,
        isInputRequired: false,
        text: {
          title: `소중한 의견 감사합니다! 빠른 시일 내에 반영하도록 하겠습니다 😊`,
          button: '확인',
        },
      });
    }

    case MODAL_ACTIONS.OPEN_COMING_SOON_MODAL: {
      const { onSubmit, titlePrefix, content, date } = payload;
      const targetDate = new Date(`${date}T00:00:00+09:00`);
      const today = new Date();
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const dDayLabel = diffDays > 0 ? `D-${diffDays}` : (diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)}`);

      return getOpenModalState({
        onSubmit,
        isInputRequired: false,
        text: {
          title: `${titlePrefix} ${dDayLabel}`,
          titleColor: '#1A8986',
          content: content,
          button: '확인',
        },
      });
    }

    default:
      return state;
  }
}

export default function useModal() {
  const [state, setState] = useState(initialModalState);

  function dispatch(action) {
    const nextState = searchReducer(state, action);
    setState(nextState);
  }

  function closeModal() {
    setState({ ...initialModalState });
  }

  return [state, dispatch, closeModal];
}
