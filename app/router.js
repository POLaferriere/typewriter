import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/app';
import Index from './components/index';

ReactDOM.render((
	<Router>
		<Route path='/' component={App}>
			<IndexRoute component={Index}/>
		</Route>
	</Router>
), document.getElementById('application'));
