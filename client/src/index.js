import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from './Context';

ReactDOM.render(<Provider><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
