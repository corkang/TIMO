import React, { useState } from 'react';
import { Box, Typography, List, ListItem, makeStyles } from '@material-ui/core';

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
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 25px',
  },

  sectionTitle: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 24,
    color: '#1A8986',
    marginBottom: 20,
  },

  departmentList: {
    padding: 0,
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto',
  },

  departmentItem: {
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Lato',
    fontSize: 16,
    '&:hover': {
      backgroundColor: '#E8F4F3',
    },
  },

  departmentItemSelected: {
    backgroundColor: '#1A8986',
    color: '#FAFAFA',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#156E6B',
    },
  },

  pdfContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '600px',
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
    overflow: 'hidden',
  },

  pdfIframe: {
    width: '100%',
    height: '700px',
    border: 'none',
    borderRadius: '10px',
  },

  placeholderText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },

  instructionText: {
    color: '#666',
    fontSize: 14,
    marginTop: '20px',
    padding: '0 20px',
    textAlign: 'center',
    lineHeight: 1.6,
  },

  linkText: {
    color: '#1A8986',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

// 15개 학부 데이터
// PDF URL 형식:
// - Google Drive: https://drive.google.com/file/d/FILE_ID/preview
// - AWS S3: https://your-bucket.s3.region.amazonaws.com/filename.pdf
// - 로컬: /pdfs/filename.pdf (public 폴더에 저장)
const DEPARTMENTS = [
  { 
    id: 1, 
    name: '학사관련 내용', 
    subtitle: '(공학인증, 수강신청 포함)', 
    pdfUrl: 'https://drive.google.com/file/d/1jMmh3a9zMh4BQ91fckkBK7kXZi1Kp6-C/preview' // Google Drive 링크를 여기에 입력하세요
  },
  { id: 2, name: '교양교육과정', subtitle: '(GLS)', pdfUrl: 'https://drive.google.com/file/d/1nQW-93HUpWA3Ahyezm8zKqis38vjhq2E/preview' },
  { id: 3, name: 'ICT 창업학부', subtitle: '(AI융합학부)', pdfUrl: 'https://drive.google.com/file/d/1WJ-XlRH_iERA9tb8fY9v_PrelxHGUQOl/preview' },
  { id: 4, name: '국제어문학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1dmrGgW0kyHH0XDb-60lI_44t335pgodW/preview' },
  { id: 5, name: '커뮤니케이션학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1CMYvWrt6-p2er3IoRH0RjZT8WUar3B11/preview' },
  { id: 6, name: '경영경제학부', subtitle: '(GM포함)', pdfUrl: 'https://drive.google.com/file/d/15BYlJ3FtXP0NN8t_7njaX1Nu16Jqu0dV/preview' },
  { id: 7, name: '법학부', subtitle: '(UIL포함)', pdfUrl: 'https://drive.google.com/file/d/1lZNnSDY1GA8n4LLcoNP5mV53yVaMazYb/preview' },
  { id: 8, name: '상담심리사회복지학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1zg7O4UiKYZNrIJyree4R77Crqbn0XL3e/preview' },
  { id: 9, name: '생명과학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1ow3sAKBlt8xz1QypAOrk1h2MLX2zDr9C/preview' },
  { id: 10, name: '전산전자공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1AjutraQQ2spu0Pwd8-KjcO7b6IFiaXq1/preview' },
  { id: 11, name: '기계제어공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/15UTFStPNd9gVNkAo3-cntNl6bchFNmK3/preview' },
  { id: 12, name: '공간환경시스템공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/19DFYN8XHiUSVdDbUTOkTsCzZ-JhOK__M/preview' },
  { id: 13, name: '콘텐츠융합디자인학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/15chsCTLeUxZqdgX0NlZf2pfNwCoqZiCT/preview' },
  { id: 14, name: '창의융합교육원', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1xyZKLBenhSg4DnoGQbSNf8En16eKLE3Y/preview' },
  { id: 15, name: 'AI융합교육원', subtitle: '(AI융합학부)', pdfUrl: 'https://drive.google.com/file/d/1ZZtaoRXH3uKcW7xdb0kOtVjqjAlks99D/preview' },
];

/**
 * CourseGuidePage displays course guides for each department with PDF viewer.
 */
export default function CourseGuidePage() {
  const classes = useStyles();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    <Box className={classes.root}>
      <Box className={classes.body}>
        {/* Left Section: Department Selection */}
        <Box className={classes.leftSection}>
          <Typography className={classes.sectionTitle}>학부별 수강편람 (2025년 2학기)</Typography>
          <List className={classes.departmentList}>
            {DEPARTMENTS.map((dept) => (
              <ListItem
                key={dept.id}
                className={`${classes.departmentItem} ${
                  selectedDepartment?.id === dept.id ? classes.departmentItemSelected : ''
                }`}
                onClick={() => setSelectedDepartment(dept)}
                button
              >
                <Typography>
                  {dept.name} {dept.subtitle}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Section: PDF Viewer */}
        <Box className={classes.rightSection}>
          <Typography className={classes.sectionTitle}>
            {selectedDepartment ? selectedDepartment.name : '수강편람'}
          </Typography>
          <Box className={classes.pdfContainer}>
            {!selectedDepartment ? (
              <Typography className={classes.placeholderText}>
                좌측에서 학부를 선택하세요
              </Typography>
            ) : selectedDepartment.pdfUrl ? (
              <iframe
                src={selectedDepartment.pdfUrl}
                className={classes.pdfIframe}
                title={`${selectedDepartment.name} 수강편람`}
                allow="autoplay"
              />
            ) : (
              <Box>
                <Typography className={classes.placeholderText}>
                  📄 PDF 파일이 준비되지 않았습니다
                </Typography>
                <Typography className={classes.instructionText}>
                  <strong>PDF 추가 방법:</strong>
                  <br />
                  <br />
                  <strong>1. Google Drive 사용 (무료, 추천)</strong>
                  <br />
                  • PDF를 Google Drive에 업로드
                  <br />
                  • 파일 우클릭 → "공유" → "링크가 있는 모든 사용자"로 설정
                  <br />
                  • 파일 ID 복사 (URL의 /d/와 /view 사이 부분)
                  <br />
                  • CourseGuidePage.js에서 해당 학부의 pdfUrl에 추가:
                  <br />
                  <span className={classes.linkText}>
                    https://drive.google.com/file/d/FILE_ID/preview
                  </span>
                  <br />
                  <br />
                  <strong>2. 로컬 파일 사용</strong>
                  <br />
                  • public/pdfs/ 폴더에 PDF 저장
                  <br />
                  • pdfUrl에 경로 추가: /pdfs/파일명.pdf
                  <br />
                  <br />
                  <strong>3. AWS S3 사용 (배포 시 추천)</strong>
                  <br />
                  • S3 버킷에 PDF 업로드 후 공개 URL 사용
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
