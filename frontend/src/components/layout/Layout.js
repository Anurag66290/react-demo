import React, {useState} from "react";
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
//imported
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";

const Layout = (props) => {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `;
    let [color, setColor] = useState("#6777ef");
    
    return(
    
            <div className="main-wrapper">
                <Helmet titleTemplate={`%s | Test`} /> 
                <Header /> 
                <Sidebar /> 
                <div className="main-content">
                    {React.cloneElement(props.children)}
                    {props.loader==true &&
                        <div className="main-loader">
                            <DotLoader color={color} loading={props.loader} css={override} size={100} />
                        </div>
                    }
                </div>
                <Footer />
            </div>

    )
}

const mapStateToPros = (state, props) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        user: state.Auth,
        loader: state.persistStore.loader,
    }
};

export default connect(
  mapStateToPros,
)(Layout);



