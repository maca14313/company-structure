import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';

import { store } from './app/store';
import { Provider } from 'react-redux';




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

<Provider store={store}>
<MantineProvider
    theme={{
      colors: {
        brand: ['#F0EFFF', '#D3CEFF', '#A6A3FF', '#8C8AFF', '#6966FF', '#5854D6', '#4643AD', '#373386', '#282360', '#191339'],
      },
      primaryColor: 'brand',
    }}
  >
    
    <App />
  </MantineProvider>
  </Provider>,

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
