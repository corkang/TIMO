import { makeStyles, Box, Typography, Button } from '@material-ui/core';
import StarRating from './StarRating';

const useStyles = makeStyles(() => ({
  cardWrapper: {
    padding: '2px 4px',
    flexShrink: 0,
  },
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    border: '1px solid #dfe1e5',
    borderRadius: 15,
    padding: '15px 20px',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    '&:hover': {
      borderColor: 'rgba(223,225,229,0)',
      boxShadow: '0 2px 8px rgba(32,33,36,.28)',
    },
  },
  cardSelected: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#edf5f5',
    border: '1px solid #B8DAD9',
    borderRadius: 15,
    padding: '15px 20px',
    boxSizing: 'border-box',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  courseName: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 20,
    color: '#333',
  },
  courseCode: {
    fontSize: 14,
    color: '#ababab',
    fontFamily: 'Lato',
  },
  professor: {
    fontSize: 16,
    fontWeight: 450,
    color: '#333',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  info: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Lato, Noto Sans KR, sans-serif',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    marginLeft: 16,
  },
  viewButton: {
    backgroundColor: '#1b8986',
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 700,
    padding: '8px 12px',
    borderRadius: 10,
    textTransform: 'none',
    fontFamily: 'Lato',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#156E6B',
    },
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#ababab',
    fontFamily: 'Lato',
  },
}));

export default function CourseCard({
  course,
  isSelected = false,
  onSelect,
  onViewReviews,
  showPeriod = true,
}) {
  const classes = useStyles();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(course);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (onViewReviews) {
      onViewReviews(course);
    }
  };

  // period 포맷팅 (쉼표를 슬래시로)
  const formattedPeriod = course.period ? course.period.replace(/,/g, '/') : '';

  return (
    <Box className={classes.cardWrapper}>
      <Box
        className={isSelected ? classes.cardSelected : classes.card}
        onClick={handleCardClick}
      >
        {/* 왼쪽: 과목 정보 */}
        <Box className={classes.leftSection}>
          <Box className={classes.titleRow}>
            <Typography className={classes.courseName}>{course.courseName}</Typography>
            {course.courseCode && (
              <Typography className={classes.courseCode}>{course.courseCode.split('-')[0]}</Typography>
            )}
          </Box>
          <Typography className={classes.professor}>{course.professor}</Typography>
          {showPeriod && formattedPeriod && (
            <Typography className={classes.info}>
              {formattedPeriod}
              {course.credit && `, ${course.credit}학점`}
            </Typography>
          )}
        </Box>

        {/* 오른쪽: 버튼 + 별점 */}
        <Box className={classes.rightSection}>
          <Button className={classes.viewButton} onClick={handleButtonClick}>
            강의평 보기
          </Button>
          <Box className={classes.ratingSection}>
            <StarRating rating={course.avgRating || 0} size={16} />
            <Typography className={classes.ratingText}>
              {(course.avgRating || 0).toFixed(1)} ({course.reviewCount || 0})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
