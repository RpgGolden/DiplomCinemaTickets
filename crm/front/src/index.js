// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//           <App />
//   </Provider>
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc143c', // Красный акцент
    },
    secondary: {
      main: '#b22222', // Огонь-красный
    },
    background: {
      default: '#fff',
    },
    error: {
      main: '#c41212',
    },
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#dc143c',
          '&.Mui-checked': {
            color: '#dc143c',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#dc143c',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#dc143c',
            color: '#fff',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
          <CssBaseline />
          <App />
        </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
