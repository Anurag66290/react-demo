import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from 'components/layout/Layout';
import { connect } from 'react-redux';
import * as Path from './paths';

const PrivateRoute = ({
  component: Component,
  screenProps: ScreenProps,
  authentication,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      authentication === true ? (
        <Layout screenProps={ScreenProps}>
          <Component {...props} authRoute={true} />
        </Layout>
      ) : (
        <Redirect to={{ pathname: Path.login, state: { from: props.location } }} />
      )
    }
  />
);
const mapStateToPros = (state) => {
    return{
        authentication: state.Auth.isAuthenticated,
    }
};
  
function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(PrivateRoute);

