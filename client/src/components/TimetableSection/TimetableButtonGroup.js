import React, { useState } from 'react';
import { IconButton, ButtonGroup, Tooltip, makeStyles, Menu, MenuItem } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: 'flex-end',
    height: 40,
    borderRadius: '23px',
    backgroundColor: 'white',
    // marginBottom: '5px',
  },
  menuItem: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,

    color: '#146765',
    fontWeight: 500,
  },
  menuPaper: {
    backgroundColor: 'white',

    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Optional: adjusting shadow if needed, or keeping default but adding border logic
  },
}));

export default function TimetableButtonGroup({
  handleCreateTimetableClick,
  handleEditTimetableClick,
  handleDeleteTimetableClick,
  handleShareTimetableClick,
  handleSetRepresentative,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSetRepresentative = () => {
    handleSetRepresentative();
    handleClose();
  };

  return (
    <>
      <ButtonGroup size="small" className={classes.root}>
        <Tooltip title="시간표 생성" arrow>
          <IconButton onClick={handleCreateTimetableClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="시간표 이름 수정" arrow>
          <IconButton onClick={handleEditTimetableClick}>
            <CreateIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="시간표 삭제" arrow>
          <IconButton onClick={handleDeleteTimetableClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="시간표 공유" arrow>
          <IconButton onClick={handleShareTimetableClick}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="더보기" arrow>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        classes={{ paper: classes.menuPaper }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={onSetRepresentative} className={classes.menuItem}>대표시간표로 지정하기</MenuItem>
      </Menu>
    </>
  );
}
