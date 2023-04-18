import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({
  component: Component,
  screenProps: ScreenProps,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <>
        <Component {...props} />
      </>
    )}
    isAuthed
  />
);
export default PublicRoute;

