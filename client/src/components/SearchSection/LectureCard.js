import React from 'react';
import { Switch, Case, Default } from 'react-if';
import { Box, Button, IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core';

import BookmarkIcon from '@material-ui/icons/Bookmark';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import EcoOutlinedIcon from '@material-ui/icons/EcoOutlined';
import EcoIcon from '@material-ui/icons/Eco';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf'; // In case we need it later, though requirement said full stars for now or just fill based on rating.

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
    position: 'relative', // For absolute positioning of Add button

    '&:hover': {
      borderColor: 'rgba(223,225,229,0)',
      boxShadow: '0 1px 6px rgba(32,33,36,.28)',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
    flex: 1, // Allow it to fill space but not force width
    minWidth: 0, // Critical for text wrapping in flex items
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

  // Modified button box to handle absolute positioning of add button and bottom stacking of review
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minWidth: '80px', // Reserve space for buttons
    marginLeft: 'auto',
    padding: '15px 15px 15px 0',
    flexShrink: 0, // Prevent button container from shrinking
  },

  addButton: {
    backgroundColor: '#1B8986',
    color: '#FAFAFA',
    borderRadius: 8,
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 14,
    padding: '3px 10px',
    minWidth: 'fit-content',

    '&:hover': {
      backgroundColor: '#156E6B'
    },
  },

  reviewButton: {
    backgroundColor: '#EAEAEA',
    color: '#333333',
    borderRadius: 8,
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 13,
    padding: '5px 10px',
    marginBottom: '4px',

    '&:hover': {
      backgroundColor: '#D1D1D1'
    },
  },

  starContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: '#FFB800', // Star color
  },

  starIcon: {
    fontSize: 16,
  },

  // Legacy styles
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

  buttonBox: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
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

  // Spike page specific styles
  spikeNumColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: '15px 10px',
    flexShrink: 0,
    gap: 4,
  },

  spikeNumText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#333333',
    whiteSpace: 'nowrap',
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
  onReviewClick,
  onBookmarkClick,
  onUnbookmarkClick,
  onAddSpikeClick,
  onDeleteSpikeClick,
  showCompetitionRate = false,
  isCartPage = false,
  showTags = true,
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
      <Box className={classes.buttonBox} >
        <Button 
          className={classes.textButton} 
          style={{ backgroundColor: '#DDEDED', color: '#146765' }} 
          onClick={onClick}
        >알림 해제
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

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<StarIcon key={i} className={classes.starIcon} />);
      } else {
        stars.push(<StarBorderIcon key={i} className={classes.starIcon} />);
      }
    }
    return stars;
  };

  const DefaultButtonGroup = () => {
    // Mock rating for now, should come from lecture object eventually
    const rating = parseFloat(lecture.reviewStats?.avgRating || lecture.avgRating || 0);

    return (
      <Box className={classes.buttonContainer}>
        <Button className={classes.addButton} onClick={onAddClick}>
          추가
        </Button>
        <Box display="flex" flexDirection="column" alignItems="flex-end" marginTop="auto">
          <Button className={classes.reviewButton} onClick={onReviewClick}>
            강의평
          </Button>
          <Box className={classes.starContainer}>
            {renderStars(rating)}
          </Box>
        </Box>
      </Box>
    );
  };

  // Spike page specific render (SPIKE_ADD, SPIKES)
  const isSpikeTab = searchTab === SEARCH_TABS.SPIKE_ADD || searchTab === SEARCH_TABS.SPIKES;
  if (isSpikeTab) {
    return (
      <Box className={classes.root} id={lecture.id}>
        {/* 과목 정보 column */}
        <Box className={classes.column}>
          <Box className={classes.row}>
            <Typography className={classes.item} component="div" style={{ lineHeight: '1.2' }}>
              <span className={`${classes.blckText} ${classes.lecName}`} style={{ marginRight: '6px' }}>
                {lecture.name}
              </span>
              <span className={classes.lecCode} style={{ whiteSpace: 'nowrap' }}>
                {lecture.code}
              </span>
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography className={`${classes.item} ${classes.lecProf}`}>
              {lecture.professor}
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography>{lecture.period.replace(',', '/')}</Typography>
            <Typography className={classes.item}>{', ' + lecture.credit}학점</Typography>
          </Box>
        </Box>

        {/* 담은 인원 / 수강 정원 column */}
        <Box className={classes.spikeNumColumn}>
          {(() => {
            const isFull = (lecture.curNum || 0) >= (lecture.maxNum || 0);
            const numColor = isFull ? '#D92929' : '#444444';
            return (
                <Typography className={classes.spikeNumText} style={{ color: numColor }}>담은 인원 {lecture.curNum || 0} / 수강 정원 {lecture.maxNum || 0}</Typography>
            );
          })()}
        </Box>

        {/* 버튼 column */}
        <Switch>
          <Case condition={searchTab === SEARCH_TABS.SPIKE_ADD}>
            {SpikeAddButtonGroup()}
          </Case>
          <Case condition={searchTab === SEARCH_TABS.SPIKES}>
            {DeleteButtonGroup(onDeleteSpikeClick, '이삭 줍기에서 삭제')}
          </Case>
        </Switch>
      </Box>
    );
  }

  // Cart page specific render
  if (isCartPage) {
    return (
      <Box className={`${classes.root} ${classes.cartRoot}`} id={lecture.id}>
        <Box className={classes.column}>
          {showTags && (
            <Box className={classes.categoryRow}>
              {renderCategoryTags()}
            </Box>
          )}
          <Box className={classes.row}>
            <Typography className={classes.item} component="div" style={{ lineHeight: '1.2' }}>
              <span className={`${classes.blckText} ${classes.lecName}`} style={{ marginRight: '6px' }}>
                {lecture.name}
              </span>
              <span className={classes.lecCode} style={{ whiteSpace: 'nowrap' }}>
                {lecture.code}
              </span>
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography className={`${classes.item} ${classes.lecProf}`}>
              {lecture.professor}
            </Typography>
          </Box>
          <Box className={classes.row}>
            <Typography>{lecture.period.replace(',', '/')}</Typography>
            <Typography className={classes.item}>{", " + lecture.credit}학점</Typography>
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
        {showTags && (
          <Box className={classes.categoryRow}>
            {renderCategoryTags()}
          </Box>
        )}
        <Box className={classes.row}>
          <Typography className={classes.item} component="div" style={{ lineHeight: '1.2' }}>
            <span className={`${classes.blckText} ${classes.lecName}`} style={{ marginRight: '6px' }}>
              {lecture.name}
            </span>
            <span className={classes.lecCode} style={{ whiteSpace: 'nowrap' }}>
              {lecture.code}
            </span>
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography className={`${classes.item} ${classes.lecProf}`}>
            {lecture.professor}
          </Typography>
        </Box>
        <Box className={classes.row}>
          <Typography>{lecture.period.replace(',', '/')}</Typography>
          <Typography className={classes.item}>{", " + lecture.credit}학점</Typography>
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
