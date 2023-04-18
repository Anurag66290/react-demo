import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Routes from './routes';
import { Provider } from 'react-redux';
import store from './store';
import * as action from './store/actions';

store.dispatch(action.authCheck());
function App() {
  return (
	<Provider store={store}>
			<Router>	
				<Switch>
					<Routes />
				</Switch>
			</Router>
	</Provider> 
		
  	);
}

export default App;