import React from 'react';
import { Switch, Case, Default } from 'react-if';
import { Box, Button, IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core';

import BookmarkIcon from '@material-ui/icons/Bookmark';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import EcoOutlinedIcon from '@material-ui/icons/EcoOutlined';
import EcoIcon from '@material-ui/icons/Eco';
import { SEARCH_TABS } from '../../commons/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '15px',
    border: '1px solid #dfe1e5',
    marginBottom: '10px',
    padding: '5px',

    '&:hover': {
      borderColor: 'rgba(223,225,229,0)',
      boxShadow: '0 1px 6px rgba(32,33,36,.28)',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'baseline',
    marginBottom: '2.5px',
  },

  categoryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    marginBottom: '8px',
  },

  title: {
    marginRight: '5px',
    textAlign: 'left',
  },

  item: {
    marginRight: '5px',
  },

  period: {
    height: '21px',
    lineHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: '10px',
    marginRight: '5px',
    padding: '3px 7px 3px 7px',
  },

  categoryTag: {
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    marginRight: '6px',
    padding: '4px 10px',
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 14,
    color: '#333333',
  },

  majorTag: {
    backgroundColor: '#B8DCF5',
  },

  generalTag: {
    backgroundColor: '#F5B8B8',
  },

  requiredTag: {
    backgroundColor: '#F5EA9F',
  },

  buttonBox: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
  },

  textButton: {
    backgroundColor: '#1B8986',
    color: '#FAFAFA',
    borderRadius: 10,
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 14,
    padding: '8px 12px',
    margin: '12px 10px',
    
    '&:hover': {
      backgroundColor: '#156E6B'
    },
  },

  blckText: {
    color: '#333333',
  },

  lecName: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 20,
  },

  lecProf: {
    fontSize: '16px',
    fontWeight: '450',
  },

  redText: {
    color: '#D92929',
  },

  competitionRate: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 18,
    color: '#D92929',
    marginTop: '5px',
  },

  // Cart page specific styles
  cartRoot: {
    position: 'relative',
  },

  cartCompetitionRate: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 16,
    color: '#D92929',
  },

  lecNameWithProf: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  lecCode: {
    fontSize: 14,
    color: '#ABABAB',
    fontFamily: 'Lato',
    fontWeight: 400,
  },

  excessText: {
    color: '#1A8986',
    marginLeft: '10px',
  },
}));

/**
 * LectureCard displays a single lecture item with category tags and action buttons.
 */
export default function LectureCard({
  searchTab,
  lecture,
  onAddClick,
  onDeleteClick,
  onBookmarkClick,
  onUnbookmarkClick,
  onAddSpikeClick,
  onDeleteSpikeClick,
  showCompetitionRate = false,
  isCartPage = false,
}) {
  const classes = useStyles();

  // Calculate competition rate
  const competitionRate = lecture.maxNum > 0 
    ? (lecture.curNum / lecture.maxNum).toFixed(2) 
    : 0;

  // Calculate excess (초과 인원)
  const excessCount = Math.max(0, (lecture.curNum || 0) - (lecture.maxNum || 0));

  // Render category tags based on lecture.gubun
  const renderCategoryTags = () => {
    const gubun = lecture.gubun || '';
    const tags = [];

    // Check for major (전공) or general (교양)
    if (gubun.includes('전')) {
      tags.push(
        <Box key="major" className={`${classes.categoryTag} ${classes.majorTag}`}>
          <Typography>전공</Typography>
        </Box>
      );
    } else if (gubun.includes('교')) {
      tags.push(
        <Box key="general" className={`${classes.categoryTag} ${classes.generalTag}`}>
          <Typography>교양</Typography>
        </Box>
      );
    }

    // Check for required (필수)
    if (gubun.includes('필')) {
      tags.push(
        <Box key="required" className={`${classes.categoryTag} ${classes.requiredTag}`}>
          <Typography>필수</Typography>
        </Box>
      );
    }

    return tags;
  };

  const DeleteButtonGroup = (onClick, title) => {
    return (
      <Box className={classes.buttonBox}>
        <Button className={classes.textButton} onClick={onClick}>
          삭제
        </Button>
      </Box>
    );
  };

  const SpikeAddButtonGroup = () => {
    return (
      <Box className={classes.buttonBox}>
        <Button className={classes.textButton} onClick={onAddSpikeClick}>
          알림 신청하기
        </Button>
      </Box>
    );
  };

  const DefaultButtonGroup = () => {
    return (
      <Box className={classes.buttonBox}>
        <Button className={classes.textButton} onClick={onAddClick}>
          추가
        </Button>
        {/* <IconButton onClick={lecture.isBookmarked ? onUnbookmarkClick : onBookmarkClick}>
          {lecture.isBookmarked ? (
            <Tooltip title="즐겨찾기 삭제" arrow>
              <BookmarkIcon />
            </Tooltip>
          ) : (
            <Tooltip title="즐겨찾기 추가" arrow>
              <BookmarkBorderIcon />
            </Tooltip>
          )}
        </IconButton>
        <IconButton onClick={lecture.isSpike ? onDeleteSpikeClick : onAddSpikeClick}>
          {lecture.isSpike ? (
            <Tooltip title="이삭 줍기에서 삭제" arrow>
              <EcoIcon />
            </Tooltip>
          ) : (
            <Tooltip title="이삭 줍기에서 추가" arrow>
              <EcoOutlinedIcon />
            </Tooltip>
          )}
        </IconButton> */}
      </Box>
    );
  };

  // Cart page specific render
  if (isCartPage) {
    return (
      <Box className={`${classes.root} ${classes.cartRoot}`} id={lecture.id}>
        <Box className={classes.column}>
          <Box className={classes.categoryRow}>
            {renderCategoryTags()}
          </Box>
          <Box className={classes.row}>
            <Typography variant="h3" className={`${classes.item} ${classes.blckText} ${classes.lecName}`}>
              {lecture.name}
            </Typography>
            <Typography className={classes.lecCode}>
              {lecture.code}
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography className={`${classes.item} ${classes.lecProf}`}>
              {lecture.professor}
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography>{lecture.period.replace(',', '/')}</Typography>
            <Typography className={classes.item}>{", "+lecture.credit}학점</Typography>
          </Box>
          <Box className={classes.row}>
            <Typography className={`${classes.item} ${classes.redText}`}>
              담은 인원 {lecture.curNum || 0}
            </Typography>
            <Typography className={`${classes.item} ${classes.redText}`}>
              / 수강 정원 {lecture.maxNum || 0}
            </Typography>
            <Typography className={`${classes.item} ${classes.excessText}`}>
              → {excessCount}명 초과
            </Typography>
          </Box>
        </Box>
        {showCompetitionRate && (
          <Typography className={classes.cartCompetitionRate}>
            경쟁률 {competitionRate}:1
          </Typography>
        )}
      </Box>
    );
  }

  // Default render (timetable page)
  return (
    <Box className={classes.root} id={lecture.id}>
      <Box className={classes.column}>
        <Box className={classes.categoryRow}>
          {renderCategoryTags()}
        </Box>
        <Box className={classes.row}>
          <Typography variant="h3" className={`${classes.item} ${classes.blckText} ${classes.lecName}`}>
            {lecture.name}
          </Typography>
          <Typography className={classes.lecCode}>
            {lecture.code}
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography className={`${classes.item} ${classes.lecProf}`}>
            {lecture.professor}
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography>{lecture.period.replace(',', '/')}</Typography>
          <Typography className={classes.item}>{", "+lecture.credit}학점</Typography>
        </Box>
        <Box className={classes.row}>
          <Typography className={`${classes.item} ${classes.redText}`}>
            담은 인원 {lecture.curNum || 0}
          </Typography>
          <Typography className={`${classes.item} ${classes.redText}`}>
            / 수강 정원 {lecture.maxNum || 0}
          </Typography>
        </Box>
        {showCompetitionRate && (
          <Box className={classes.row}>
            <Typography className={classes.competitionRate}>
              경쟁률 {competitionRate}:1
            </Typography>
          </Box>
        )}
        
      </Box>
      {
        <Switch>
          <Case condition={searchTab === SEARCH_TABS.TIMETABLE}>
            {DeleteButtonGroup(onDeleteClick, '현재 시간표에서 삭제')}
          </Case>
          <Case condition={searchTab === SEARCH_TABS.SPIKES}>
            {DeleteButtonGroup(onDeleteSpikeClick, '이삭 줍기에서 삭제')}
          </Case>
          <Case condition={searchTab === SEARCH_TABS.SPIKE_ADD}>
            {SpikeAddButtonGroup()}
          </Case>
          <Case condition={searchTab === SEARCH_TABS.VIEW_ONLY}>
            {/* No button for view-only mode */}
          </Case>
          <Default>{DefaultButtonGroup()}</Default>
        </Switch>
      }
    </Box>
  );
}
