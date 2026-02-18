import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, CircularProgress, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: theme.spacing(4, 0),
  },
  paper: {
    padding: theme.spacing(3, 4),
    textAlign: 'left',
    backgroundColor: '#ffffff',
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: theme.spacing(2),
    },
    '& th, & td': {
      border: '1px solid #ddd',
      padding: theme.spacing(1, 1.5),
      textAlign: 'left !important',
      fontSize: '0.875rem',
    },
    '& th': {
      fontWeight: 600,
    },
  },
}));

export default function MarkdownPage({ src }) {
  const classes = useStyles();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [src]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper} elevation={1}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </Paper>
    </Box>
  );
}