import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Select, MenuItem, makeStyles } from '@material-ui/core';

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
    [theme.breakpoints.down('sm')]: {
      flex: '0 0 100%',
      border: 'none',
      padding: '0 0 20px 0',
    },
  },

  rightSection: {
    flex: '0 0 60%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #B8DAD9',
    borderRadius: 16,
    padding: '23px 25px',
    height: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      flex: '0 0 100%',
    },
  },

  sectionTitle: {
    fontFamily: 'Lato',
    fontWeight: 700,
    fontSize: 24,
    color: '#1A8986',
    marginBottom: 20,
  },

  // 모바일 드롭다운
  departmentDropdown: {
    width: '100%',
    marginBottom: 15,
    [theme.breakpoints.up('md')]: {
      display: 'none', // 데스크톱에서는 숨김
    },
    '& .MuiSelect-root': {
      padding: '12px 16px',
      fontFamily: 'Lato',
      fontSize: 16,
    },
  },

  // 데스크톱 리스트
  departmentList: {
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none', // 모바일에서는 숨김
    },
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
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
    overflow: 'hidden',
    height: '100%',
  },

  pdfIframe: {
    width: '100%',
    height: '800px',
    border: 'none',
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      height: '600px',
    },
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
    pdfUrl: 'https://drive.google.com/file/d/12mccZDnioxj7hV0bVjIN7HxBZdf3f7x3/preview' // Google Drive 링크를 여기에 입력하세요
  },
  { id: 2, name: '교양교육과정', subtitle: '(GLS)', pdfUrl: 'https://drive.google.com/file/d/147bIk6ZXk2bzSDZQfxnAdSMXGOC_ctNw/preview' },
  { id: 3, name: 'AI융합학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1t2Op3125l1jpCsJM22kpGPqeRrhDG0XJ/preview' },
  { id: 4, name: '국제어문학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1hdo_EgCwAM8m3jcPfagqmfQU7AF6CR9v/preview' },
  { id: 5, name: '커뮤니케이션학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1mgcpnsrov9k2WYzsamcMw854eTWWjknN/preview' },
  { id: 6, name: '경영경제학부', subtitle: '(GM포함)', pdfUrl: 'https://drive.google.com/file/d/1MNYOYaNx2RfX9pkE7JZR-xpIM12e1RCL/preview' },
  { id: 7, name: '법학부', subtitle: '(UIL포함)', pdfUrl: 'https://drive.google.com/file/d/1d52SvKhhoUuaca26JqQiH8BMrUG2KsWn/preview' },
  { id: 8, name: '상담심리사회복지학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1Jwf4SpxanNXM-ma1xw7lmrPpZHtrHZe_/preview' },
  { id: 9, name: '생명과학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1j9dci0qLZkRarvPu61_Qv9nr0P3WaCxh/preview' },
  { id: 10, name: 'AI컴퓨터전자공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1Q0Lpv1LMmGYbL8ZztZpoLBzhC6SsQP7l/preview' },
  { id: 11, name: '기계제어공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1LQ-4ZEenf8p6gZqTc8EkVDlpT7aAEQmV/preview' },
  { id: 12, name: '공간환경시스템공학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/13u54QJ0lteBJd5PmorackhBgW9c85AdE/preview' },
  { id: 13, name: '콘텐츠융합디자인학부', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/1t1Qc6zyp_EDSCo46-o5_fHbhKzyrcNCZ/preview' },
  { id: 14, name: '창의융합교육원', subtitle: '', pdfUrl: 'https://drive.google.com/file/d/193IkDJ8qPcVWwvPH6B_p4zY-a4HajK97/preview' },
  // { id: 15, name: 'AI융합교육원', subtitle: '(AI융합학부)', pdfUrl: 'https://drive.google.com/file/d/1ZZtaoRXH3uKcW7xdb0kOtVjqjAlks99D/preview' },
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
          <Typography className={classes.sectionTitle}>학부별 수강편람 (2026년 1학기)</Typography>

          {/* 모바일 드롭다운 */}
          <Select
            value={selectedDepartment?.id || ''}
            onChange={(e) => {
              const dept = DEPARTMENTS.find(d => d.id === e.target.value);
              setSelectedDepartment(dept);
            }}
            displayEmpty
            className={classes.departmentDropdown}
            variant="outlined"
          >
            <MenuItem value="" disabled>
              학부를 선택하세요
            </MenuItem>
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name} {dept.subtitle}
              </MenuItem>
            ))}
          </Select>

          {/* 데스크톱 리스트 */}
          <List className={classes.departmentList}>
            {DEPARTMENTS.map((dept) => (
              <ListItem
                key={dept.id}
                className={`${classes.departmentItem} ${selectedDepartment?.id === dept.id ? classes.departmentItemSelected : ''
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
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
