import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { Admin } from '../models';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#FAFAFA',
    padding: '30px 7%',
    color: '#212121',
    [theme.breakpoints.down('sm')]: {
      padding: 12,
    },
  },
  shellHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
  },
  subtitle: {
    color: 'rgb(95,99,105)',
    fontSize: 14,
    textAlign: 'left',
  },
  logoutButton: {
    borderRadius: 8,
    borderColor: '#1B8986',
    color: '#156e6b',
    fontWeight: 700,
    flexShrink: 0,
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
    marginBottom: 14,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
  metricCard: {
    minHeight: 104,
    borderRadius: 8,
    border: '1px solid rgb(235,235,235)',
    boxShadow: 'none',
    padding: 18,
    textAlign: 'left',
  },
  metricLabel: {
    color: 'rgb(95,99,105)',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 12,
  },
  metricValue: {
    color: '#1B8986',
    fontFamily: 'Lato',
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
  },
  notice: {
    border: '1px solid #B8DAD9',
    borderRadius: 8,
    backgroundColor: '#F6FBFB',
    color: '#105250',
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 24,
    padding: '12px 14px',
    textAlign: 'left',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
    gap: 18,
    marginBottom: 18,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    borderRadius: 8,
    border: '1px solid rgb(235,235,235)',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  fullWidthSection: {
    borderRadius: 8,
    border: '1px solid rgb(235,235,235)',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  sectionHeader: {
    alignItems: 'center',
    borderBottom: '1px solid rgb(235,235,235)',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 16px',
  },
  sectionTitle: {
    fontFamily: 'Lato',
    fontSize: 17,
    fontWeight: 700,
  },
  tableContainer: {
    maxHeight: 420,
  },
  tableCell: {
    fontSize: 13,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  feedbackCell: {
    maxWidth: 420,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  stateBox: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
    minHeight: 240,
    textAlign: 'center',
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  stateText: {
    color: 'rgb(95,99,105)',
    fontSize: 14,
  },
}));

const formatNumber = (value) => Number(value || 0).toLocaleString();

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

function MetricCard({ label, value }) {
  const classes = useStyles();

  return (
    <Paper className={classes.metricCard}>
      <Typography className={classes.metricLabel}>{label}</Typography>
      <Typography className={classes.metricValue}>{formatNumber(value)}</Typography>
    </Paper>
  );
}

function Section({ title, children, fullWidth = false }) {
  const classes = useStyles();

  return (
    <Paper className={fullWidth ? classes.fullWidthSection : classes.section}>
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>{title}</Typography>
      </Box>
      {children}
    </Paper>
  );
}

function EmptyRow({ colSpan, message }) {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.tableCell} colSpan={colSpan}>
        {message}
      </TableCell>
    </TableRow>
  );
}

export default function AdminPage({ logout }) {
  const classes = useStyles();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    Admin.getDashboard()
      .then(({ data }) => {
        if (mounted) setDashboard(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.status === 403 ? 'forbidden' : 'error');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box className={classes.root}>
        <Box className={classes.stateBox}>
          <CircularProgress />
          <Typography className={classes.stateText}>Loading dashboard data</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.root}>
        <Box className={classes.stateBox}>
          <Typography className={classes.stateTitle}>
            {error === 'forbidden' ? 'You do not have admin access.' : 'Dashboard data could not be loaded.'}
          </Typography>
          <Typography className={classes.stateText}>
            {error === 'forbidden'
              ? 'Use an allowlisted Google account to view this page.'
              : 'Refresh the page or try again later.'}
          </Typography>
        </Box>
      </Box>
    );
  }

  const users = dashboard?.users || {};
  const recentActive = users.recentActive || {};
  const feedbackItems = dashboard?.feedback?.items || [];
  const topTerms = dashboard?.searches?.topTerms || [];
  const userItems = users.items || [];

  return (
    <Box className={classes.root}>
      <Box className={classes.shellHeader}>
        <Box className={classes.titleGroup}>
          <Typography component="h1" className={classes.title}>
            Admin Dashboard
          </Typography>
          <Typography className={classes.subtitle}>
            Read-only operational view for existing TIMO data.
          </Typography>
        </Box>
        <Button className={classes.logoutButton} variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Box className={classes.metricGrid}>
        <MetricCard label="Total registered users" value={users.total} />
        <MetricCard label="Active in last 24 hours" value={recentActive.last24Hours} />
        <MetricCard label="Active in last 3 days" value={recentActive.last3Days} />
        <MetricCard label="Active in last 7 days" value={recentActive.last7Days} />
      </Box>

      <Box className={classes.notice}>
        Recent active users are based on the latest authenticated app activity timestamp, not full login
        history or real-time online sessions.
      </Box>

      <Box className={classes.sectionGrid}>
        <Section title="Search term rankings">
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small" aria-label="Search term rankings">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>Rank</TableCell>
                  <TableCell className={classes.tableCell}>Search term</TableCell>
                  <TableCell className={classes.tableCell}>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topTerms.length === 0 ? (
                  <EmptyRow colSpan={3} message="No search terms recorded yet." />
                ) : (
                  topTerms.map((term, index) => (
                    <TableRow key={`${term.search}-${index}`} hover>
                      <TableCell className={classes.tableCell}>{index + 1}</TableCell>
                      <TableCell className={classes.tableCell}>{term.search || '-'}</TableCell>
                      <TableCell className={classes.tableCell}>{formatNumber(term.count)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Section>

        <Section title="Feedback">
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small" aria-label="Feedback list">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>User</TableCell>
                  <TableCell className={classes.tableCell}>Feedback</TableCell>
                  <TableCell className={classes.tableCell}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbackItems.length === 0 ? (
                  <EmptyRow colSpan={3} message="No feedback has been submitted yet." />
                ) : (
                  feedbackItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell className={classes.tableCell}>{item.email || `User #${item.userId}`}</TableCell>
                      <TableCell className={`${classes.tableCell} ${classes.feedbackCell}`}>
                        {item.feedback || '-'}
                      </TableCell>
                      <TableCell className={classes.tableCell}>{formatDateTime(item.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Section>
      </Box>

      <Section title="Users" fullWidth>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader size="small" aria-label="User activity table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Email</TableCell>
                <TableCell className={classes.tableCell}>Latest activity</TableCell>
                <TableCell className={classes.tableCell}>Views</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userItems.length === 0 ? (
                <EmptyRow colSpan={3} message="No users found." />
              ) : (
                userItems.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell className={classes.tableCell}>{user.email || '-'}</TableCell>
                    <TableCell className={classes.tableCell}>{formatDateTime(user.lastLoggedInAt)}</TableCell>
                    <TableCell className={classes.tableCell}>{formatNumber(user.viewCount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  );
}
