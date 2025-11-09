import React, { useState, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, makeStyles } from '@material-ui/core';
import { useUser } from '../hooks';
import LectureCard from '../components/SearchSection/LectureCard';
import TimetableSection from '../components/TimetableSection';
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
    flex: '0 0 40%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 25px',
  },

  rightSection: {
    flex: '0 0 60%',
    minWidth: 0,
    '& > div > div:first-child': {
      display: 'none', // Hide timetable header (tabs and buttons)
    },
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sectionTitle: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 24,
    color: '#1A8986',
  },

  sortDropdown: {
    minWidth: 200,
    '& .MuiSelect-root': {
      padding: '10px 16px',
      fontFamily: 'Lato',
      fontSize: 14,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#B8DAD9',
      borderWidth: 2,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A8986',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A8986',
    },
  },

  noticeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },

  lectureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 'calc(100vh - 300px)',
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
}));

/**
 * CartPage displays competition rate for lectures in the first timetable and the timetable grid.
 */
export default function CartPage() {
  const classes = useStyles();
  const [{ timetables }] = useUser();
  const [sortBy, setSortBy] = useState('competition'); // 'competition' or 'major'

  // Get first timetable (예비시간표1) lectures
  const firstTimetable = timetables[0] || { lectures: [] };
  
  // Sort lectures based on selected criteria
  const sortedLectures = useMemo(() => {
    const firstTimetableLectures = firstTimetable.lectures || [];
    const lectures = [...firstTimetableLectures];
    
    if (sortBy === 'competition') {
      // Sort by competition rate (descending)
      return lectures.sort((a, b) => {
        const rateA = a.maxNum > 0 ? a.curNum / a.maxNum : 0;
        const rateB = b.maxNum > 0 ? b.curNum / b.maxNum : 0;
        return rateB - rateA;
      });
    } else if (sortBy === 'major') {
      // Sort by major first, then general education
      return lectures.sort((a, b) => {
        const aIsMajor = (a.gubun || '').includes('전');
        const bIsMajor = (b.gubun || '').includes('전');
        
        if (aIsMajor && !bIsMajor) return -1;
        if (!aIsMajor && bIsMajor) return 1;
        return 0;
      });
    }
    
    return lectures;
  }, [firstTimetable.lectures, sortBy]);

  return (
    <Box className={classes.root}>
      <Box className={classes.body}>
        {/* Left Section: Lecture List */}
        <Box className={classes.leftSection}>
          <Box className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>담긴 과목</Typography>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={classes.sortDropdown}
              variant="outlined"
            >
              <MenuItem value="competition">우선순위순 (경쟁률순)</MenuItem>
              <MenuItem value="major">전공 우선 순</MenuItem>
            </Select>
          </Box>
          <Typography className={classes.noticeText}>
            * 대표시간표 기준
          </Typography>
          <Box className={classes.lectureList}>
            {sortedLectures.length > 0 ? (
              sortedLectures.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  searchTab={SEARCH_TABS.VIEW_ONLY}
                  lecture={lecture}
                  onAddClick={() => {}}
                  onDeleteClick={() => {}}
                  onBookmarkClick={() => {}}
                  onUnbookmarkClick={() => {}}
                  onAddSpikeClick={() => {}}
                  onDeleteSpikeClick={() => {}}
                  showCompetitionRate={true}
                  isCartPage={true}
                />
              ))
            ) : (
              <Typography className={classes.noticeText}>
                시간표에 담긴 과목이 없습니다.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right Section: Timetable Display */}
        <Box className={classes.rightSection}>
          <TimetableSection
            timetables={[firstTimetable]}
            lectures={firstTimetable.lectures || []}
            tabIndex={0}
            setTabIndex={() => {}}
            hideSearchTab={false}
            setHideSearchTab={() => {}}
            handleDeleteLectureClick={() => {}}
            handleCreateTimetableClick={() => {}}
            handleDeleteTimetableClick={() => {}}
            handleEditTimetableClick={() => {}}
            handleShareTimetableClick={() => {}}
            isSharePage={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
