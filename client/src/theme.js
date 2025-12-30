import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1B8986',
      light: '#b8dad9',
      dark: '#156e6b',
      contrastText: '#FAFAFA',
    },
    secondary: {
      main: '#04ccf2',
      contrastText: '#fff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FAFAFA',
    },
    backgroundColor: {
      default: '#FAFAFA',
      paper: 'rgb(255,255,255)',
      grayPaper: 'rgb(250,250,250)',
      bluePaper: 'rgb(251,253,254)',
      chip: 'rgb(247,247,247)',
      rateBar: 'rgb(243,243,243)',
      white: '#FAFAFA',
    },
    common: {
      black: '#212121',
      white: '#FAFAFA',
    },
    divider: 'rgb(235,235,235)',
    text: {
      primary: '#212121',
      secondary: 'rgb(95,99,105)',
      hint: 'rgb(155,155,155)',
      disabled: 'rgb(155,155,155)',
      footer: 'rgb(137,143,156)',
      subTitle: 'rgb(116,116,116)',
      date: 'rgb(189,189,189)',
    },
  },
  typography: {
    fontFamily: ['Lato', 'Roboto', 'NotoSansKR', 'Apple SD Gothic Neo', 'arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '2.143rem',
      fontWeight: '700',
      fontFamily: 'Lato',
    },
    h2: {
      fontSize: '1.714rem',
      fontWeight: '700',
      fontFamily: 'Lato',
      textAlign: 'start',
    },
    h3: {
      fontSize: '1.286rem',
      fontWeight: '700',
      fontFamily: 'Lato',
      textAlign: 'start',
    },
    h6: {
      fontSize: '1.143rem',
      fontWeight: '400',
      fontFamily: 'Lato',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: '400',
      fontFamily: 'Lato',
      textAlign: 'start',
    },
    body2: {
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: 'Roboto',
      textAlign: 'start',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      fontFamily: 'Lato',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: '300',
      fontFamily: 'Lato',
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
  },
  breakpoints: {
    values: {
      xs: 408, // 360  + 48
      sm: 696, // 648  + 48
      md: 1008, // 960  +  48
    },
  },

  background: {
    default: '#FAFAFA'
  }
});

export default theme;
