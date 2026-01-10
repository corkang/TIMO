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
    marginBottom: 16,
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
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  avgRating: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1b8986',
    fontFamily: 'Lato, sans-serif',
  },
  reviewCount: {
    fontSize: 14,
    color: '#ababab',
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
  difficulty: { easy: 0, low: 25, mid: 50, normal: 75, hard: 100 },
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

export default function CourseStatsCard({ courseInfo, stats }) {
  const classes = useStyles();

  if (!courseInfo || !stats) {
    return null;
  }

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
    <Box className={classes.card}>
      <Box className={classes.header}>
        <Typography className={classes.courseName}>{courseInfo.courseName}</Typography>
        <Typography className={classes.professor}>{courseInfo.professor}</Typography>
        <Box className={classes.ratingSection}>
          <Typography className={classes.avgRating}>
            {stats.avgRating?.toFixed(1) || '0.0'}
          </Typography>
          <StarRating rating={stats.avgRating || 0} size={20} />
          <Typography className={classes.reviewCount}>
            ({courseInfo.reviewCount || 0}개의 강의평)
          </Typography>
        </Box>
      </Box>

      <Box className={classes.statsSection}>
        <Typography className={classes.statsTitle}>강의 통계</Typography>
        {progressStats.map((stat) => (
          <ProgressBar key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </Box>
    </Box>
  );
}
