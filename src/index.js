import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';

import stores from './stores';

import App from './App';

const theme = createMuiTheme({});

// my default setup for React/MUI/MobX projects

ReactDOM.render((
    <MuiThemeProvider theme={theme}>
        <Provider {...stores}>
            <App />
        </Provider>
    </MuiThemeProvider>
), document.getElementById('root'));