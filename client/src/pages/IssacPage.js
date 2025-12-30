import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { useUser } from '../hooks';
import { USER_ACTIONS } from '../commons/constants';
import { User, SpikeLecture } from '../models';
import LectureCard from '../components/SearchSection/LectureCard';
import { SEARCH_TABS } from '../commons/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: 'calc(100vh - 150px)',
    padding: '30px 7%',
  },

  body: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 30,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },

  leftSection: {
    flex: '0 0 50%',
    minWidth: 0,
  },

  rightSection: {
    flex: '0 0 50%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 25px',
  },

  sectionTitle: {
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: 24,
    color: '#212121',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #eaedf1',
    marginBottom: '15px',
  },

  lectureList: {
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
    padding: '15px',
    '& > div:last-child': {
      marginBottom: 0,
    },
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

  noticeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },

  warningText: {
    fontSize: 14,
    color: '#D92929',
    marginTop: 10,
  },

  timeSlotCard: {
    backgroundColor: '#FAFAFA',
    padding: '18px 20px',
    borderRadius: '15px',
    border: '2px solid #E8F4F3',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },

  timeSlotBadge: {
    backgroundColor: '#1A8986',
    color: '#FAFAFA',
    borderRadius: '25px',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 16,
    whiteSpace: 'nowrap',
    minWidth: '120px',
  },

  timeSlotContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  timeSlotInfo: {
    fontSize: 15,
    color: '#333333',
    fontWeight: 500,
  },

  timeSlotNotice: {
    fontSize: 15,
    color: '#1A8986',
    fontWeight: 600,
  },
}));

// Time slot data (hardcoded)
const TIME_SLOTS = [
  {
    round: '1차',
    number: '09시',
    period: '전일 18:00 ~ 당일 08:59',
    openTime: '09:00 오픈',
    alertTime: '08:45 알림 발송',
  },
  {
    round: '2차',
    number: '12시',
    period: '당일 09:00 ~ 11:59',
    openTime: '12:00 오픈',
    alertTime: '11:45 알림 발송',
  },
  {
    round: '3차',
    number: '15시',
    period: '당일 12:00 ~ 14:59',
    openTime: '15:00 오픈',
    alertTime: '14:45 알림 발송',
  },
  {
    round: '4차',
    number: '18시',
    period: '당일 15:00 ~ 17:59',
    openTime: '18:00 오픈',
    alertTime: '17:45 알림 발송',
  },
];

/**
 * IssacPage displays lecture gleaning (spike) management with time slot notifications.
 */
export default function IssacPage() {
  const classes = useStyles();
  const [{ timetables, spikes = [] }, userDispatch] = useUser();

  // Get first timetable (예비시간표1) lectures
  const firstTimetableLectures = timetables[0]?.lectures || [];

  // Filter out lectures that are already in spikes
  const availableLectures = firstTimetableLectures.filter(
    (lecture) => !spikes.some((spike) => spike.id === lecture.id)
  );

  const handleAddSpikeLectureClick = (lecture) => {
    User.addSpikeLecture(lecture.id).then(() => {
      userDispatch({
        type: USER_ACTIONS.ADD_SPIKE_LECTURE,
        payload: { lecture: new SpikeLecture(lecture) },
      });
    });
  };

  const handleDeleteSpikeLectureClick = (lecture) => {
    User.deleteSpikeLecture(lecture.id).then(() => {
      userDispatch({
        type: USER_ACTIONS.DELETE_SPIKE_LECTURE,
        payload: { lectureId: lecture.id },
      });
    });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.body}>
        {/* Left Section: Time Slot Notifications */}
        <Box className={classes.leftSection}>
          <Typography className={classes.sectionTitle}>취소 시간별 알림 시간</Typography>
          {TIME_SLOTS.map((slot, index) => (
            <Box key={index} className={classes.timeSlotCard}>
              <Box className={classes.timeSlotBadge}>
                <Typography>{slot.round} ({slot.number})</Typography>
              </Box>
              <Box className={classes.timeSlotContent}>
                <Typography className={classes.timeSlotInfo}>
                  {slot.period} 사이 취소
                </Typography>
                <Typography className={classes.timeSlotNotice}>
                  → {slot.openTime} | 🔔 {slot.alertTime}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Section: Course Selection and History */}
        <Box className={classes.rightSection}>
          {/* Top: Course Selection */}
          <Box>
            <Typography className={classes.sectionTitle}>신청 과목 선택</Typography>
            <Typography className={classes.noticeText}>
              * 대표시간표 기준으로 빈자리 알림을 신청할 수 있습니다.
            </Typography>
            <Box className={classes.lectureList}>
              {availableLectures.length > 0 ? (
                availableLectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    searchTab={SEARCH_TABS.SPIKE_ADD}
                    lecture={lecture}
                    onAddClick={() => {}}
                    onDeleteClick={() => {}}
                    onBookmarkClick={() => {}}
                    onUnbookmarkClick={() => {}}
                    onAddSpikeClick={() => handleAddSpikeLectureClick(lecture)}
                    onDeleteSpikeClick={() => {}}
                  />
                ))
              ) : (
                <Typography className={classes.noticeText}>
                  신청 가능한 과목이 없습니다.
                </Typography>
              )}
            </Box>
            <Typography className={classes.warningText}>
              ⚠️ 서버 시간 차이로 인한 빈 자릿수 오차가 있을 수 있습니다.
            </Typography>
          </Box>

          {/* Bottom: Application History */}
          <Box>
            <Typography className={classes.sectionTitle}>
              수강신청 지연제 신청 과목 내역
            </Typography>
            <Box className={classes.lectureList}>
              {spikes.length > 0 ? (
                spikes.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    searchTab={SEARCH_TABS.SPIKES}
                    lecture={lecture}
                    onAddClick={() => {}}
                    onDeleteClick={() => {}}
                    onBookmarkClick={() => {}}
                    onUnbookmarkClick={() => {}}
                    onAddSpikeClick={() => {}}
                    onDeleteSpikeClick={() => handleDeleteSpikeLectureClick(lecture)}
                  />
                ))
              ) : (
                <Typography className={classes.noticeText}>
                  신청한 과목이 없습니다.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
