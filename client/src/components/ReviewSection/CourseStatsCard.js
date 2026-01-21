import React from 'react';
import { makeStyles, Box, Typography, Grid } from '@material-ui/core'; // Added Grid
import StarRating from './StarRating';
import ProgressBar from './ProgressBar';

const useStyles = makeStyles(() => ({
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 24, // Increased padding slightly
    marginBottom: 16,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 700,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
    marginBottom: 4,
  },
  professor: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  ratingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 700,
    marginTop: 4,
    fontFamily: 'Lato, sans-serif',
  },
  sectionTitle: { // New style for section blocks
    fontSize: 16,
    fontWeight: 700,
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  statsSection: {
    marginTop: 0,
    marginBottom: 24,
  },
  infoSection: {
    backgroundColor: '#eef6f6', // Light teal background for Other Info
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Align vertically
  },
  infoItem: {
    flex: 1, // Take equal width
    display: 'flex',
    alignItems: 'center',
    gap: 12, // Space between Label and Value
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1b8986',
    width: 80, // Fixed width for alignment
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 500,
    fontFamily: 'Noto Sans KR, sans-serif',
  },
}));

// Progress Bar 값 계산 (0-100)
// 입력 3단계 (0, 50, 100) -> 출력 5단계 (10, 30, 50, 70, 90)
const SCORE_MAP = {
  grading: { generous: 0, normal: 50, strict: 100, tight: 100, survival: 100 }, // strict/tight/survival mapped to 100 for safety, focusing on 3-step 'generous, normal, strict'
  difficulty: { easy: 0, low: 25, mid: 50, normal: 50, hard: 100 },
  assignments: { none: 0, normal: 50, heavy: 100 },
  teamProjects: { none: 0, normal: 50, heavy: 100 },
};

function calculateProgressValue(distribution, scoreMap) {
  if (!distribution) return 0;
  let totalScore = 0;
  let totalPercent = 0;

  Object.entries(distribution).forEach(([option, percent]) => {
    // Map backend keys to values
    const value = scoreMap[option];
    if (value !== undefined) {
      totalScore += value * percent;
      totalPercent += percent;
    }
  });

  if (totalPercent === 0) return 0;

  const rawScore = totalPercent > 0 ? totalScore / totalPercent : 0;

  // 5단계 매핑 (10, 30, 50, 70, 90)
  // 0-20 -> 10 (Generous)
  // 20-40 -> 30 (Between)
  // 40-60 -> 50 (Normal)
  // 60-80 -> 70 (Between)
  // 80-100 -> 90 (Strict)
  // Logic: Round rawScore to nearest 25 step (0, 25, 50, 75, 100), then map to 10, 30, 50, 70, 90?
  // 0 -> 10
  // 25 -> 30
  // 50 -> 50
  // 75 -> 70
  // 100 -> 90
  // Formula: Math.round(rawScore / 25) * 20 + 10

  return Math.round(rawScore / 25) * 20 + 10;
}

// Logic to find most frequent response (Mode)
function getMostFrequent(distribution, labelMap) {
  if (!distribution) return '정보 없음';

  let maxPercent = 0;
  let bestKey = null;

  Object.entries(distribution).forEach(([key, percent]) => {
    if (percent > maxPercent) {
      maxPercent = percent;
      bestKey = key;
    }
  });

  if (maxPercent === 0 || !bestKey) return '정보 없음';

  return labelMap[bestKey] || bestKey;
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
        <StarRating rating={stats.avgRating || 0} size={24} />
        <Typography className={classes.ratingText}>
          {stats.avgRating?.toFixed(1) || '0.0'} <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>({courseInfo.reviewCount})</span>
        </Typography>
      </Box>
    </Box>
  );
}

export function CourseStats({ stats, style }) {
  const classes = useStyles();
  if (!stats) return null;

  // 1. Bar Stats Definition
  const barStats = [
    {
      label: '성적',
      // grading backend keys might be 'generous', 'normal', 'tight'
      // Update SCORE_MAP to handle 'tight' as 100 (Strict).
      value: calculateProgressValue(stats.grading, SCORE_MAP.grading),
      leftLabel: '너그러움',
      rightLabel: '깐깐함',
    },
    {
      label: '수업 난이도',
      value: calculateProgressValue(stats.difficulty, SCORE_MAP.difficulty),
      leftLabel: '쉬움',
      rightLabel: '어려움',
    },
    {
      label: '과제',
      value: calculateProgressValue(stats.assignments, SCORE_MAP.assignments),
      leftLabel: '없음',
      rightLabel: '많음',
    },
    {
      label: '팀플',
      value: calculateProgressValue(stats.teamProjects, SCORE_MAP.teamProjects),
      leftLabel: '없음',
      rightLabel: '많음',
    },
  ];

  // 2. Text Info Definition & Maps
  const examMap = { none: '없음', normal: '보통', hard: '어려움' }; // 'exams' in backend is difficulty-like
  const methodMap = { theory: '이론 위주', discussion: '토론 중심', project: '실습 위주' }; // 'teachingMethod'
  const ratioMap = { offline: '100% 대면', half: '50% 반반', online: '100% 비대면' }; // 'onlineOfflineRatio' 

  // Calculate text values
  const examText = getMostFrequent(stats.exams, examMap);
  const methodText = getMostFrequent(stats.teachingMethod, methodMap);
  const ratioText = getMostFrequent(stats.onlineOfflineRatio, ratioMap);

  const getTextStyle = (text) => ({
    color: text === '정보 없음' ? '#aaa' : '#333'
  });

  return (
    <Box>
      {/* Unified Stats Section (Bars + Info) */}
      <Box className={classes.infoSection} style={style}> {/* Using infoSection style for container */}
        <Grid container spacing={3}>
          {barStats.map((stat) => (
            <Grid item xs={12} sm={6} key={stat.label}>
              <ProgressBar
                label={stat.label}
                value={stat.value}
                leftLabel={stat.leftLabel}
                rightLabel={stat.rightLabel}
                style={{ marginBottom: 0 }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Info Rows */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #dceceb', paddingTop: 15 }}>
          {/* Row 1 */}
          <Box className={classes.infoRow}>
            <Box className={classes.infoItem}>
              <Typography className={classes.infoLabel}>시험</Typography>
              <Typography className={classes.infoValue} style={getTextStyle(examText)}>{examText}</Typography>
            </Box>
            <Box className={classes.infoItem}>
              <Typography className={classes.infoLabel}>퀴즈</Typography>
              <Typography className={classes.infoValue} style={getTextStyle(getMostFrequent(stats.quiz, { none: '없음', normal: '1~2회', hard: '3회 이상' }))}>
                {getMostFrequent(stats.quiz, { none: '없음', normal: '1~2회', hard: '3회 이상' })}
              </Typography>
            </Box>
          </Box>

          {/* Row 2 */}
          <Box className={classes.infoRow}>
            <Box className={classes.infoItem}>
              <Typography className={classes.infoLabel}>온/오프라인</Typography>
              <Typography className={classes.infoValue} style={getTextStyle(ratioText)}>{ratioText}</Typography>
            </Box>
            <Box className={classes.infoItem}>
              <Typography className={classes.infoLabel}>강의 방식</Typography>
              <Typography className={classes.infoValue} style={getTextStyle(methodText)}>{methodText}</Typography>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box >
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
