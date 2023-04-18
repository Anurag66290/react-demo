import React from "react";
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
const Auth = (props) => {
  return (
        <> 
          <Helmet titleTemplate={`%s | Test`} /> 
            {React.cloneElement(props.children)}
        </>
  );
}

const mapStateToPros = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        user: state.Auth,
        loader: state.persistStore.loader,
    }
};

export default connect(
  mapStateToPros,
)(Auth);

