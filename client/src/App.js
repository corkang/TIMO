import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Box, makeStyles } from '@material-ui/core';

import { 
  TimeTablePage, 
  IssacPage, 
  CartPage, 
  CourseGuidePage, 
  SharePage, 
  NotFoundPage, 
  LoginPage 
} from './pages';
import { Header, Modal } from './components';
import theme from './theme';
import { useAuth, useModal } from './hooks';
import { MODAL_ACTIONS } from './commons/constants';
import { User } from './models';

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
      <Header logout={logout} openReportFeedbackModal={openReportFeedbackModal} />
      <Box className={classes.content}>
        {children}
      </Box>
      <Modal {...modalState} onClose={closeModal} />
    </Box>
  );
}

export default function App() {
  const [authenticated, logout] = useAuth();

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
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

            <Route path="/share/:id" component={SharePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}
