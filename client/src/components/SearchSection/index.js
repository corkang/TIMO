import React, { useEffect, useRef } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import SearchBar from './SearchBar';
import LectureCard from './LectureCard';
import { SEARCH_TABS } from '../../commons/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      margin: '5px 0 7px 0',
    },
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 25px',
  },

  title: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 24,
    color: '#1A8986',
    marginBottom: '6px',
    padding: '0 5px'
  },

  searchTab: {
    // backgroundColor: 'white',
    padding: '0',
    // border: '1px solid #eaedf1',
    // borderRadius: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    // [theme.breakpoints.down('sm')]: {
    //   padding: '7px 7px 0 7px',
    // },
  },

  searchBarWrapper: {
    width: '100%',
    marginBottom: 20,
  },

  lectureList: {
    height: '100%',
    width: '100%',
    padding: '5px',
    overflowY: 'scroll',
  },

  notFound: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
  },

  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 'fit-content',
    marginTop: 5,
  },
}));

/**
 * SearchSection displays the lecture search interface with search bar and results.
 */
export default function SearchSection({
  lectures,
  pagination,
  searchLoading,
  tabIndex,
  setTabIndex,
  handleSearchSubmit,
  handleAddLectureClick,
  handleDeleteLectureClick,
  handleBookmarkLectureClick,
  handleUnbookmarkLectureClick,
  handleAddSpikeLectureClick,
  handleDeleteSpikeLectureClick,
  handleSearchPageChange,
}) {
  const classes = useStyles();
  const searchListRef = useRef();

  // Only use the first tab (search results)
  const searchResults = lectures[0];

  useEffect(() => {
    if (searchListRef?.current) searchListRef.current.scrollTo(0, 0);
  }, [pagination]);

  const notFoundMessages = [
    '검색 결과가 없습니다 :(',
    '[상세 검색 팁]',
    ', 를 이용해서 여러개의 정보를 한번에 검색할 수도 있습니다.',
    '예) 화7,목7',
    '예) 데이터,김호준',
  ];

  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>강의 검색</Typography>
      <Box className={classes.searchBarWrapper}>
        <SearchBar {...{ handleSearchSubmit }} />
      </Box>
      <Box className={classes.searchTab}>
        {searchResults.length !== 0 ? (
          <Box className={classes.lectureList} ref={searchListRef}>
            {searchResults.map((lecture) => (
              <LectureCard
                key={lecture.id}
                searchTab={SEARCH_TABS.LECTURE}
                lecture={lecture}
                onAddClick={() => handleAddLectureClick(lecture)}
                onDeleteClick={() => handleDeleteLectureClick(lecture)}
                onBookmarkClick={() => handleBookmarkLectureClick(lecture)}
                onUnbookmarkClick={() => handleUnbookmarkLectureClick(lecture)}
                onAddSpikeClick={() => handleAddSpikeLectureClick(lecture)}
                onDeleteSpikeClick={() => handleDeleteSpikeLectureClick(lecture)}
              />
            ))}
          </Box>
        ) : (
          <Box className={classes.notFound}>
            {searchLoading ? (
              <Typography variant={'body1'}> 검색 결과 로딩 중!</Typography>
            ) : (
              notFoundMessages.map((message, index) => (
                <Typography variant={'body1'} key={index}>
                  {message}
                </Typography>
              ))
            )}
          </Box>
        )}
      </Box>
      <Box className={classes.pagination}>
        <Pagination
          page={pagination.current}
          count={pagination.total}
          onChange={handleSearchPageChange}
        />
      </Box>
    </Box>
  );
}
