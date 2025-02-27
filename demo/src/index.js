import React from 'react';
import ReactDOM from 'react-dom';

import { Desktop, Window } from './lib';
import './index.css';

const App = (props) => {
  return (
    <Desktop width={1024} height={768}>
      <FreeDiv key="app-notepad">
        {({ isActive, titleProps }) => (
          <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
            <div className="my-window__title" {...titleProps}>
              Background Window
            </div>
            <h1>This div is also resizable.</h1>
            <p>Want to learn more?</p>
            <button>Open the Docs</button>
          </div>
        )}
      </FreeDiv>
      <FreeDiv key="app-chrome">
        {({ isActive, titleProps }) => (
          <div className={`my-window ${isActive ? 'my-window--active' : ''}`}>
            <div className="my-window__title" {...titleProps}>
              App Window
            </div>
            <h1>This div is resizable.</h1>
            <p>
              It's draggable too. Try dragging its title bar to see what's
              underneath.
            </p>
            <p>To resize, drag any of the edges.</p>
          </div>
        )}
      </FreeDiv>
    </Desktop>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
