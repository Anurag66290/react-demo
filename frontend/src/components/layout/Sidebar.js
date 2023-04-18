import React, {useEffect} from "react";
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link, useHistory} from 'react-router-dom';
import * as Path from 'routes/paths';

const Sidebar = ({user, profile}) => {
    //history
    const history = useHistory();

    const pathname = history.location.pathname.split('/');
 
 
    const filtered = pathname.filter(function (el) {
         if(el !== ""){
             return el;
         }
    });
     
    let path = '/';
 
    if(filtered.length>=3){
         path += filtered[0]+"/"+filtered[1]+"/"+filtered[2];
    }
    else {
        path += filtered[0]+"/"+filtered[1] ?? '';
    }

    const sidebarHideShow = () => {
        if (document.body.classList.contains('sidebar-show')) {
            document.body.classList.add('sidebar-gone');
            document.body.classList.remove('sidebar-mini');
            document.body.classList.remove('sidebar-show');
        } 
    }

    useEffect(() => {
        sidebarHideShow();
    }, [])


    return(
        <div className="main-sidebar sidebar-style-2">
            <aside id="sidebar-wrapper">
                <ul className="sidebar-menu">
                    <li className={classNames("", {'active' : (path===Path.users) })} to={Path.users}><Link class="nav-link"  title="User" onClick={sidebarHideShow} to={Path.users}><i class="fa fa-users"></i> <span>Users</span></Link></li>
                </ul>
            </aside>
        </div>
    )
}

const mapStateToPros = (state, props) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        loader: state.persistStore.loader,
        user: state.Auth,
        profile: state.persistStore.profile,
    }
};

export default connect(
    mapStateToPros,
)(Sidebar);
