import React from "react";
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

//imported
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const App = (props) => {
  return (
			<div>
				<Helmet titleTemplate={`%s | Test`} /> 
				<Header />  
				<Sidebar />
				<div className="main-content">
					{React.cloneElement(props.children)}
				</div>
				<Footer />
			</div>
		
  );
}

const mapStateToPros = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        user: state.Auth,
    }
};

export default connect(
  mapStateToPros,
)(App);


