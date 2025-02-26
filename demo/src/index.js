import React from 'react';
import ReactDOM from 'react-dom';

import { Desktop, Window } from './lib';
import './index.css';

const App = (props) => {
  return (
    <Desktop width={1024} height={768}>
      <Window>
        {({ isActive, titleProps }) => (
          <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
            <div className="my-window__title" {...titleProps}>
              notepad.exe - Hello World
            </div>
            <h1>Window contents.</h1>
          </div>
        )}
      </Window>
      <Window>
        {({ isActive, titleProps }) => (
          <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
            <div className="my-window__title" {...titleProps}>
              chrome.exe - Messageboard
            </div>
            <p>Leave a message...</p>
          </div>
        )}
      </Window>
    </Desktop>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
