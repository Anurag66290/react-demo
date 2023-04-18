import * as Path from './paths';

//-----------------------auth--------------------//
import SignIn from 'components/views/auth/Login';
import Register from 'components/views/auth/Register';

//------------User--------------------------//
import UserList from 'components/views/users/Listing';

//---------------Page not found--------------//
import NotFound from 'components/NotFound';

const routes = [  
	{
		path: Path.login,
		exact: true,
		auth: false,
		fallback: true,
		component: SignIn,
	},
	{
		path: Path.register,
		exact: true,
		auth: false,
		// fallback: true,
		component: Register,
	},
	/* users routes */
	{
		path: Path.users,
		exact: true,
		auth: true,
		component: UserList,
	},
	{
		path: '/',
		exact: false,
		component: NotFound,
	},

];

export default routes;
