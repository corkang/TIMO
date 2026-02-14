import React from 'react';
import { Box, Typography, makeStyles, Divider } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
    alignItems: 'flex-start',
    width: '100%',
    gap: 30,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },

  leftSection: {
    flex: '0 0 45%',
    minWidth: 0,
    backgroundColor: '#F2F2F2',
    borderRadius: '20px',
    padding: 30,
  },

  rightSection: {
    flex: '0 0 55%',
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
    marginBottom: 5,
  },

  highlight: {
    display: 'inline',
    boxShadow: 'inset 0 -9px 0 var(--highlight-color)',
  },

  sectionSubTitle: {
    fontSize: 14,
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

  blankNotice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },

  delayNotice: {
    fontSize: 14,
    fontWeight: 500,
    color: '#999999',
    marginTop: 25,
    textAlign: 'center',
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
    borderRadius: '25px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    minWidth: '110px',
  },

  timeSlotBadgeText: {
    fontFamily: 'Lato',
    fontWeight: 600,
    fontSize: 15,
    color: '#FAFAFA',
    
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

  divider: {
    height: 3,
    backgroundColor: '#E8F3F3',
  },
}));

// Time slot data (hardcoded)
const TIME_SLOTS = [
  {
    round: '1차',
    number: '09시',
    period: '전일 17:00 ~ 당일 07:59',
    openTime: '09:00',
    alertTime: '08:45 알림 발송',
  },
  {
    round: '2차',
    number: '12시',
    period: '당일 08:00 ~ 10:59',
    openTime: '12:00',
    alertTime: '11:45 알림 발송',
  },
  {
    round: '3차',
    number: '15시',
    period: '당일 11:00 ~ 13:59',
    openTime: '15:00',
    alertTime: '14:45 알림 발송',
  },
  {
    round: '4차',
    number: '18시',
    period: '당일 14:00 ~ 16:59',
    openTime: '18:00',
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
          <Typography className={classes.sectionTitle}>
            <span 
              className={classes.highlight}
              style={{ '--highlight-color': '#B8DAD9' }}
            >취소 시간별 알림 시간</span>
          </Typography>
          <Typography className={classes.sectionSubTitle} style={{ color: '#333333', marginBottom: 20 }}>* 히즈넷 취소지연제 공지 기준으로 운영됩니다</Typography>
          {TIME_SLOTS.map((slot, index) => (
            <Box key={index} className={classes.timeSlotCard}>
              <Box className={classes.timeSlotBadge}>
                <Typography className={classes.timeSlotBadgeText}>{slot.round} ({slot.number})</Typography>
              </Box>
              <Box className={classes.timeSlotContent}>
                <Typography className={classes.timeSlotInfo}>
                  <span style={{fontWeight: 700}}>{slot.period}</span> 사이 취소
                </Typography>
                <Typography className={classes.timeSlotNotice}>
                  → {slot.openTime} <span style={{ color: '#333333', fontWeight: 500 }}>오픈 |</span> <NotificationsIcon style={{ fontSize: 16, color: '#D92929', verticalAlign: '-2.1' }} /> <span style={{color: '#D92929'}}>{slot.alertTime}</span>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Section: Course Selection and History */}
        <Box className={classes.rightSection}>
          {/* Top: Course Selection */}
          <Box>
            <Box style={{ display: 'flex', alignItems: 'baseline', gap: 10,  }}>
              <Typography className={classes.sectionTitle}>
                <span
                  className={classes.highlight}
                  style={{ '--highlight-color': '#F0D860' }}
                >신청 과목 선택</span>
              </Typography>
              <Typography
                className={classes.sectionSubTitle}
                style={{ color: '#ABABAB', position: 'relative', top: 2.5 }}
              >* 대표시간표 기준으로 빈자리 알림을 신청할 수 있습니다.</Typography>
            </Box>
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
                    showTags={false}
                  />
                ))
              ) : (
                <Typography className={classes.blankNotice}>
                  신청 가능한 과목이 없습니다.
                </Typography>
              )}
            </Box>
            <Typography className={classes.delayNotice}>
              ⚠️ 서버 시간 차이로 인한 빈 자릿수 오차가 있을 수 있습니다.
            </Typography>
          </Box>
          <Divider className={classes.divider} />
          {/* Bottom: Application History */}
          <Box>
            <Typography className={classes.sectionTitle}>
              <span
                className={classes.highlight}
                style={{ '--highlight-color': '#F0D860' }}
              >수강신청 지연제 신청 과목 내역</span></Typography>
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
                    showTags={false}
                  />
                ))
              ) : (
                <Typography className={classes.blankNotice}>
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
