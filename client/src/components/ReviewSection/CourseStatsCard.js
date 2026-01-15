import React from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
import StarRating from './StarRating';
import ProgressBar from './ProgressBar';

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  courseName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  professor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 700,
    marginTop: 4,
    fontFamily: 'Lato, sans-serif',
  },
  statsSection: {
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
}));

// Progress Bar 값 계산 (0-100)
const SCORE_MAP = {
  grading: { generous: 0, normal: 33, tight: 67, survival: 100 },
  difficulty: { easy: 0, normal: 50, hard: 100 },
  assignments: { none: 0, normal: 50, heavy: 100 },
  teamProjects: { none: 0, normal: 50, heavy: 100 },
};

function calculateProgressValue(distribution, scoreMap) {
  if (!distribution) return 0;
  let totalScore = 0;
  let totalPercent = 0;

  Object.entries(distribution).forEach(([option, percent]) => {
    if (scoreMap[option] !== undefined) {
      totalScore += scoreMap[option] * percent;
      totalPercent += percent;
    }
  });

  return totalPercent > 0 ? totalScore / totalPercent : 0;
}

export function CourseHeader({ courseInfo, stats }) {
  const classes = useStyles();
  if (!courseInfo || !stats) return null;

  return (
    <Box className={classes.header}>
      <Box className={classes.headerLeft}>
        <Typography className={classes.courseName}>{courseInfo.courseName}</Typography>
        <Typography className={classes.professor}>{courseInfo.professor}</Typography>
      </Box>
      <Box className={classes.headerRight}>
        <StarRating rating={stats.avgRating || 0} size={20} />
        <Typography className={classes.ratingText}>
          {stats.avgRating?.toFixed(1) || '0.0'} ({courseInfo.reviewCount || 0})
        </Typography>
      </Box>
    </Box>
  );
}

export function CourseStats({ stats }) {
  const classes = useStyles();
  if (!stats) return null;

  const progressStats = [
    {
      label: '성적',
      value: calculateProgressValue(stats.grading, SCORE_MAP.grading),
    },
    {
      label: '수업 난이도',
      value: calculateProgressValue(stats.difficulty, SCORE_MAP.difficulty),
    },
    {
      label: '과제',
      value: calculateProgressValue(stats.assignments, SCORE_MAP.assignments),
    },
    {
      label: '팀플',
      value: calculateProgressValue(stats.teamProjects, SCORE_MAP.teamProjects),
    },
  ];

  return (
    <Box className={classes.statsSection}>
      <Typography className={classes.statsTitle}>강의 통계</Typography>
      {progressStats.map((stat) => (
        <ProgressBar key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </Box>
  );
}

export default function CourseStatsCard({ courseInfo, stats }) {
  const classes = useStyles();

  if (!courseInfo || !stats) {
    return null;
  }

  return (
    <Box className={classes.card}>
      <CourseHeader courseInfo={courseInfo} stats={stats} />
      <CourseStats stats={stats} />
    </Box>
  );
}
