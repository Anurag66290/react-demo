import React from "react";
import { connect } from 'react-redux';

const Footer = ({user, dispatch}) => {
    return(
        <footer className="main-footer">
            <div className="footer-left">
            Copyright &copy; 2023 <div className="bullet"></div>
            </div>
      </footer>
    )
}

const mapStateToPros = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        loader: state.persistStore.loader,
        user: state.Auth,
    }
};
function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(Footer);
