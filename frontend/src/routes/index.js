import { BrowserRouter as Router , Switch, Route, Redirect } from 'react-router-dom';
import PublicRoute from './Public';
import PrivateRoute from './Private';
import AuthRoute from './Auth';
import routes from './routes';
import { connect } from 'react-redux';
import * as Path from './paths';

//...............................................
function Routes({authentication}) {
    return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return (
                                !authentication ? <Redirect to={Path.login} /> : <Redirect to={Path.users} />
                            )
                        }}
                    />
                    {routes.map((route) => {
                        if (route.fallback) {
                            return <AuthRoute key={route.path} {...route} />;
                        } if (route.auth) {
                            return <PrivateRoute key={route.path} {...route} />;
                        }
                            return <PublicRoute key={route.path} {...route} />;
                    })}
                </Switch>
            </Router>
    );
}

const mapStateToPros = (state) => {
    return{
        authentication: state.Auth.isAuthenticated,
        user: state.Auth.user
    }
};
  
function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(Routes);
