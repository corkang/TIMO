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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #eaedf1',
    marginBottom: '15px',
  },

  timeSlotHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },

  timeSlotBadge: {
    backgroundColor: '#1A8986',
    color: '#FAFAFA',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    marginRight: 15,
  },

  timeSlotTitle: {
    fontSize: 18,
    fontWeight: 600,
  },

  timeSlotInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  timeSlotNotice: {
    fontSize: 14,
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
              <Box className={classes.timeSlotHeader}>
                <Box className={classes.timeSlotBadge}>
                  <Typography>{slot.round}</Typography>
                </Box>
                <Typography className={classes.timeSlotTitle}>
                  {slot.number}
                </Typography>
              </Box>
              <Typography className={classes.timeSlotInfo}>
                전일 {slot.period} 사이 취소
              </Typography>
              <Typography className={classes.timeSlotNotice}>
                → {slot.openTime} | 🔔 {slot.alertTime}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Right Section: Course Selection and History */}
        <Box className={classes.rightSection}>
          {/* Top: Course Selection */}
          <Box>
            <Typography className={classes.sectionTitle}>신청 과목 선택</Typography>
            <Typography className={classes.noticeText}>
              * 대표시간표 기준으로 지연제 신청할 과목을 선택합니다.
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
              ⚠️ 서버 시간 차이로 인한 빠른 재고가 오픈될 수 있습니다.
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
