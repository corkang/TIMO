import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Box, makeStyles } from '@material-ui/core';

import {
  TimeTablePage,
  IssacPage,
  CartPage,
  CourseGuidePage,
  SharePage,
  NotFoundPage,
  LoginPage,
  ReviewPage,
  PrivacyPage,
  TermsPage,
} from './pages';
import { Header, Modal } from './components';
import theme from './theme';
import { useAuth, useModal } from './hooks';
import { MODAL_ACTIONS } from './commons/constants';
import { User } from './models';
import { storage } from './utils/storage';
import { STORAGE_KEY } from './commons/constants';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
}));

/**
 * useTokenHandler - processes OAuth token from URL parameter
 * Returns true if token is being processed (to prevent premature redirects)
 */
function useTokenHandler() {
  const location = useLocation();
  const [isProcessing] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('token');
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Save token to localStorage
      storage.set(STORAGE_KEY.ACCESS_TOKEN, token);

      // Remove token from URL and reload
      params.delete('token');
      const newSearch = params.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      window.history.replaceState({}, '', newUrl);
      window.location.reload();
    }
  }, [location]);

  return isProcessing;
}

/**
 * AuthenticatedLayout wraps authenticated pages with common Header and provides shared handlers.
 */
function AuthenticatedLayout({ children, logout }) {
  const classes = useStyles();
  const [modalState, modalDispatch, closeModal] = useModal();

  const openReportFeedbackModal = () =>
    modalDispatch({
      type: MODAL_ACTIONS.OPEN_FEEDBACK_MODAL,
      payload: { onSubmit: handleFeedbackReport },
    });

  const openComingSoonModal = (data) =>
    modalDispatch({
      type: MODAL_ACTIONS.OPEN_COMING_SOON_MODAL,
      payload: { onSubmit: closeModal, ...data },
    });

  const handleFeedbackReport = (feedback) => {
    User.reportFeedback(feedback).then(() => {
      modalDispatch({
        type: MODAL_ACTIONS.OPEN_SUBMIT_CONFIRM_MODAL,
        payload: { onSubmit: closeModal },
      });
    });
  };

  return (
    <Box className={classes.root}>
      <Header
        logout={logout}
        openReportFeedbackModal={openReportFeedbackModal}
        openComingSoonModal={openComingSoonModal}
      />
      <Box className={classes.content}>
        {children}
      </Box>
      <Modal {...modalState} onClose={closeModal} />
    </Box>
  );
}

function AppRoutes() {
  const [authenticated, logout] = useAuth();
  const isProcessingToken = useTokenHandler();

  // While processing token, don't render routes to prevent redirect to login
  if (isProcessingToken) {
    return null;
  }

  return (
    <Switch>
      <Route
        exact
        path="/login"
        render={() => (authenticated ? <Redirect to="/timetable" /> : <LoginPage />)}
      />

      <Route
        exact
        path="/"
        render={() => (authenticated ? <Redirect to="/timetable" /> : <Redirect to="/login" />)}
      />

      <Route
        exact
        path="/timetable"
        render={() => {
          if (!authenticated) return <Redirect to="/login" />;
          return (
            <AuthenticatedLayout logout={logout}>
              <TimeTablePage />
            </AuthenticatedLayout>
          );
        }}
      />

      <Route
        exact
        path="/issac"
        render={() => {
          if (!authenticated) return <Redirect to="/login" />;
          return (
            <AuthenticatedLayout logout={logout}>
              <IssacPage />
            </AuthenticatedLayout>
          );
        }}
      />

      <Route
        exact
        path="/cart"
        render={() => {
          if (!authenticated) return <Redirect to="/login" />;
          return (
            <AuthenticatedLayout logout={logout}>
              <CartPage />
            </AuthenticatedLayout>
          );
        }}
      />

      <Route
        exact
        path="/courseguide"
        render={() => {
          if (!authenticated) return <Redirect to="/login" />;
          return (
            <AuthenticatedLayout logout={logout}>
              <CourseGuidePage />
            </AuthenticatedLayout>
          );
        }}
      />

      <Route
        exact
        path="/review"
        render={() => {
          if (!authenticated) return <Redirect to="/login" />;
          return (
            <AuthenticatedLayout logout={logout}>
              <ReviewPage />
            </AuthenticatedLayout>
          );
        }}
      />

      <Route exact path="/terms" component={TermsPage} />
      <Route exact path="/privacy" component={PrivacyPage} />
      <Route path="/share/:id" component={SharePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </div>
  );
}
