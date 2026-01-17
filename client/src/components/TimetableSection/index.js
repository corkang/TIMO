import React, { useState } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import Tabs from '../Tabs';
import TimetableButtonGroup from './TimetableButtonGroup';
import LectureGrid from './LectureGrid';
import { sum } from '../../utils/helper';
import {
  TIMETABLE_DAYS,
  TIMETABLE_COLORSET,
  PERIOD_HOURS_MAP,
  TIMETABLE_START_HOUR,
  TIMETABLE_END_HOUR,
  MAX_PERIOD,
} from '../../commons/constants';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',

    [theme.breakpoints.down('sm')]: {
      height: (props) => (props.hideSearchTab ? '100%' : '75%'),
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 'fit-content',
    marginBottom: 18,
  },

  timetableHeader: {
    width: '100%',
    height: '40px',
    display: 'flex', // Changed to flex
    paddingLeft: '50px', // Space for time labels
    borderTop: '1px solid #eaedf1',
    borderLeft: '1px solid #eaedf1', // Left border for the whole container
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
    backgroundColor: '#eaedf1',

    [theme.breakpoints.down('sm')]: {
      height: '30px',
    },
  },

  timetableBody: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflowY: 'scroll',
    display: 'flex',
    borderTop: '1px solid #eaedf1',
    borderLeft: '1px solid #eaedf1',
    borderBottom: '1px solid #eaedf1',
    backgroundColor: 'white',
    borderRadius: 16,
  },

  timeColumn: {
    width: '50px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #eaedf1',
    flexShrink: 0,
    backgroundColor: '#fcfcfc',
  },

  timeSlot: {
    flex: 1, // Each hour takes equal height
    display: 'flex',
    justifyContent: 'flex-end', // Align right
    alignItems: 'flex-start', // Align top
    borderBottom: '1px solid #f0f0f0',
    color: '#999',
    fontSize: '0.75rem',
    position: 'relative',
    paddingTop: '4px',
    paddingRight: '6px',
    boxSizing: 'border-box',
  },

  columnsContainer: {
    flex: 1,
    display: 'flex',
    position: 'relative',
  },

  dayColumn: {
    flex: 1,
    position: 'relative', // For absolute positioning of lectures
    borderRight: '1px solid #eaedf1',
    // We need horizontal lines for hours, maybe background gradient or pseudo elements?
    // Using simple repeating-linear-gradient for grid lines
    // Changed to 'to top' to align with border-bottom of timeSlot
    backgroundImage: `linear-gradient(to top, #f0f0f0 1px, transparent 1px)`,
    backgroundSize: (props) => `100% ${(100 / props.hoursCount)}%`, // Distribute lines evenly based on dynamic count
  },

  dayHeader: { // Header for each day
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '1px solid #eaedf1',
    '&:last-child': {
      borderRight: 'none',
    },
  },

  dayIndicator: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Deleted periodIndicator and periodGrid classes as they are replaced

  lectureBlock: {
    position: 'absolute',
    width: '100%',
    padding: '0', // Removed padding to fill the cell
    zIndex: 1,
    transition: 'all 0.2s',
  },

  bottomBar: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 5,
    marginRight: 2,
    minHeight: 'fit-content',
  },

  hideButton: {
    marginLeft: 2,
    display: 'none',
    color: 'rgba(0, 0, 0, 0.54)',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },

  creditSum: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px',
  },
}));

const getLecturesForTimetable = (lectures = []) => {
  const lecturesForTimetable = {};
  lectures.forEach((lecture) =>
    lecture.period.split(',').forEach((period) => (lecturesForTimetable[period] = lecture)),
  );
  return lecturesForTimetable;
};

// We don't need getPeriod logic for grid index anymore, but we might need to parse '월1' -> day='월', period=1
const parsePeriodKey = (key) => {
  const day = key.charAt(0);
  const period = parseInt(key.slice(1));
  return { day, period };
};

export default function TimetableSection({
  timetables,
  lectures,
  tabIndex,
  setTabIndex,
  hideSearchTab,
  setHideSearchTab,
  handleDeleteLectureClick,
  handleCreateTimetableClick,
  handleDeleteTimetableClick,
  handleEditTimetableClick,
  handleShareTimetableClick,
  isSharePage,
}) {
  const lecturesForTimetable = getLecturesForTimetable(lectures);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const colorIndexByLectureId = {};
  let colorIndex = 0;



  const CreditIndicator = () => (
    <Box className={classes.creditSum}>
      <Typography variant="body1">총 {sum(lectures, 'credit')}학점</Typography>
    </Box>
  );

  const getBgColor = (lectureId) => {
    if (!(lectureId in colorIndexByLectureId))
      colorIndexByLectureId[lectureId] = colorIndex++;
    return TIMETABLE_COLORSET[colorIndexByLectureId[lectureId] % TIMETABLE_COLORSET.length];
  };

  // Determine visible time range
  const periods = Object.keys(lecturesForTimetable).map(k => parsePeriodKey(k).period);
  const maxPeriod = periods.length > 0 ? Math.max(...periods) : 0;

  // Check for Saturday classes
  const hasSaturday = Object.keys(lecturesForTimetable).some(key => key.startsWith('토'));
  const visibleDays = hasSaturday ? [...TIMETABLE_DAYS, '토'] : TIMETABLE_DAYS;

  // Start hour: 8 if period 1 exists (starts 08:30), otherwise 9
  // If no lectures, periods is empty, so we default to 9
  const hasPeriod1 = periods.includes(1);
  const startHour = hasPeriod1 ? 8 : 9;

  // End hour: Default 19. Extend if late classes exist.
  // Period 7 ends 18:45 -> fits in 18-19 slot (End 19)
  // Period 8 ends 20:15 -> needs 20-21 slot (End 21)
  // Period 9 ends 21:45 -> needs 21-22 slot (End 22)
  let endHour = 19;
  if (maxPeriod >= 9) endHour = 22;
  else if (maxPeriod >= 8) endHour = 21;

  const hoursCount = endHour - startHour; // e.g. 19 - 9 = 10 slots (9-10, ... 18-19)
  const SLOT_HEIGHT = 60; // 60px per hour
  const gridMinHeight = hoursCount * SLOT_HEIGHT;

  const classes = useStyles({ hideSearchTab, hoursCount }); // Pass hoursCount to styles

  // Rendering Helper: Calculate position style
  const getLectureStyle = (periodNum) => {
    const times = PERIOD_HOURS_MAP[periodNum];
    if (!times) return null;

    const startMinutes = (times.start.h - startHour) * 60 + times.start.m;
    const endMinutes = (times.end.h - startHour) * 60 + times.end.m;
    const durationMinutes = endMinutes - startMinutes;
    const totalMinutes = hoursCount * 60; // Total minutes in visible area

    const top = (startMinutes / totalMinutes) * 100;
    const height = (durationMinutes / totalMinutes) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        {timetables.length === 0 ? (
          <div className={classes.tabs}></div>
        ) : (
          <Tabs
            value={tabIndex}
            onChange={(e, index) => setTabIndex(index)}
            tabs={timetables.map(({ title }) => title)}
          />
        )}
        {!isSharePage ? (
          <TimetableButtonGroup
            {...{
              handleCreateTimetableClick,
              handleDeleteTimetableClick,
              handleEditTimetableClick,
              handleShareTimetableClick,
            }}
          />
        ) : (
          <CreditIndicator />
        )}
      </Box>

      <Box className={classes.timetableBody} id="timetable-grid">
        {/* Time Column */}
        <Box className={classes.timeColumn} style={{ minHeight: gridMinHeight }}>
          {Array.from({ length: hoursCount }).map((_, i) => (
            <Box key={i} className={classes.timeSlot}>
              <span>
                {startHour + i}
              </span>
            </Box>
          ))}
        </Box>

        {/* Day Columns */}
        <Box className={classes.columnsContainer} style={{ minHeight: gridMinHeight }}>
          {visibleDays.slice(1).map((day, dayIndex) => { // '월', '화' ...
            // Find lectures for this day
            // We iterate all lecturesForTimetable and filter those on this day
            // This is slightly inefficient but given N is small (max 9 periods * 5 days), it's fine.
            // Or better: iterate 1..9 periods and check if key exists.

            const lecturesOnDay = [];
            for (let p = 1; p <= MAX_PERIOD; p++) {
              const key = `${day}${p}`;
              if (lecturesForTimetable[key]) {
                lecturesOnDay.push({
                  ...lecturesForTimetable[key],
                  periodNum: p,
                  key: key
                });
              }
            }

            return (
              <Box className={classes.dayColumn} key={dayIndex} style={{ backgroundSize: `100% ${(100 / hoursCount)}%` }}>
                {lecturesOnDay.map((lecture) => {
                  const style = getLectureStyle(lecture.periodNum);

                  // Check if connected (same lecture in prev period) - though logic changes with time-based
                  // In time-based, lectures are distinct blocks unless we merge them.
                  // But usually continuous periods are just one long block?
                  // The user request images imply standard separate blocks but if they are continuous...
                  // The current data structure splits them by period.
                  // If "Period 1" and "Period 2" are the same lecture, they will appear as two blocks.
                  // Period 1 ends at 9:45, Period 2 starts at 10:00. Use gap is visible.
                  // So we just render distinct blocks.

                  const lectureId = lecture.id;

                  return (
                    <Box
                      className={classes.lectureBlock}
                      style={style}
                      key={lecture.key}
                      onMouseOver={() => setHoveredIndex(lectureId || -1)}
                    >
                      <LectureGrid
                        lecture={lecture}
                        handleDeleteClick={isSharePage ? undefined : handleDeleteLectureClick}
                        bgColor={getBgColor(lectureId)}
                        isHovered={hoveredIndex === lectureId}
                        isConnected={false} // No longer need visual connecting logic as they are time-speicific blocks
                      />
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
      {!isSharePage && (
        <Box className={classes.bottomBar}>
          <Box className={classes.hideButton} onClick={() => setHideSearchTab((v) => !v)}>
            {hideSearchTab ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </Box>

          <CreditIndicator />
        </Box>
      )}
    </Box>
  );
}
