import React, { useState, useEffect } from 'react';
import { makeStyles, Button, Modal, Fade, Backdrop, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '30px',
        borderRadius: 10,
        width: 400,
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        [theme.breakpoints.down('xs')]: {
            width: '90%',
            padding: '20px',
        },
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    formControl: {
        width: '100%',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 20,
        gap: 10,
        alignItems: 'center',
    },
    logoutButton: {
        marginRight: 'auto',
        color: '#999',
        textDecoration: 'underline',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'transparent',
            color: '#666',
        },
    },
    saveButton: {
        backgroundColor: '#1B8986',
        color: 'white',
        '&:hover': {
            backgroundColor: '#156E6B',
        },
    },
    cancelButton: {
        color: '#666',
    }
}));

const MAJORS = [
    '글로벌리더십학부',
    '국제어문학부',
    '커뮤니케이션학부',
    '경영경제학부',
    '법학부',
    '상담심리사회복지학부',
    '생명과학부',
    'AI융합학부',
    '전산전자공학부',
    '기계제어공학부',
    '공간환경시스템공학부',
    '콘텐츠융합디자인학부',
];

const SEMESTERS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ProfileModal({ open, onClose, userInfo, onSave, onLogout, isInitial }) {
    const classes = useStyles();
    const [firstMajor, setFirstMajor] = useState('');
    const [secondMajor, setSecondMajor] = useState('');
    const [semester, setSemester] = useState('');

    useEffect(() => {
        if (open && userInfo) {
            setFirstMajor(userInfo.firstMajor || '');
            setSecondMajor(userInfo.secondMajor || '');
            setSemester(userInfo.semester || '');
        }
    }, [open, userInfo]);

    const handleSave = () => {
        if (!firstMajor || !semester) {
            alert('제 1전공과 현재 학기는 필수 입력 사항입니다.');
            return;
        }
        onSave({ firstMajor, secondMajor, semester });
    };

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={isInitial ? undefined : onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            disableBackdropClick={isInitial}
            disableEscapeKeyDown={isInitial}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <div className={classes.title}>
                        {isInitial ? '환영합니다! 정보를 입력해주세요' : '내 정보 수정'}
                    </div>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>제 1전공 (필수)</InputLabel>
                        <Select
                            value={firstMajor}
                            onChange={(e) => setFirstMajor(e.target.value)}
                            label="제 1전공 (필수)"
                        >
                            <MenuItem value="">
                                <em>선택해주세요</em>
                            </MenuItem>
                            {MAJORS.map((major) => (
                                <MenuItem key={major} value={major}>
                                    {major}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>제 2전공 (선택)</InputLabel>
                        <Select
                            value={secondMajor}
                            onChange={(e) => setSecondMajor(e.target.value)}
                            label="제 2전공 (선택)"
                        >
                            <MenuItem value="">
                                <em>없음</em>
                            </MenuItem>
                            {MAJORS.map((major) => (
                                <MenuItem key={major} value={major}>
                                    {major}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel>현재 학기 (필수)</InputLabel>
                        <Select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            label="현재 학기 (필수)"
                        >
                            <MenuItem value="">
                                <em>선택해주세요</em>
                            </MenuItem>
                            {SEMESTERS.map((sem) => (
                                <MenuItem key={sem} value={sem}>
                                    {sem}학기
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className={classes.buttonGroup}>
                        {!isInitial && onLogout && (
                            <Button className={classes.logoutButton} onClick={onLogout}>
                                로그아웃
                            </Button>
                        )}

                        {!isInitial && (
                            <Button className={classes.cancelButton} onClick={onClose}>
                                취소
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            className={classes.saveButton}
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
}
