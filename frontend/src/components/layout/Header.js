import React,{useState, useEffect} from "react";
import { connect, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useHistory, Link } from 'react-router-dom';
import * as Path from 'routes/paths';
import * as actions from 'store/actions';
import AuthService from 'services';
import swal from 'sweetalert';
import env from 'env.json';

const Header = ({user, dispatch, profile}) => {
    //history
    const history = useHistory();
    const pathname = history.location.pathname.split('/');    
    
    const filtered = pathname.filter(function (el) {
            if(el !== ""){
                return el;
            }
    });
        
    let path = '/';
    
    if(filtered.length>=2){
            path += filtered[0]+"/"+filtered[1];
    }
    else {
        path += filtered[0] ?? '';
    }

    //logout function
    const handleLogout = async () => {
        try{
            const authToken = user && user.user ? user.user.access_token  :'';
            await dispatch(AuthService.logout(authToken)).then((res) => {
                swal("Success", res.message, "success");
            });
        }catch(err) {
            console.log(err.data);
            dispatch(actions.persist_store({  loader:false }));
            if(err && err.data && err.data.message){
                swal("Oops!", err.data.message, "error");
            }
        }
    };

    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        document.body.classList.toggle('sidebar-mini', isOpen);
        if (document.body.classList.contains('sidebar-gone')) {
            document.body.classList.remove('sidebar-gone');
            document.body.classList.remove('sidebar-mini');
            document.body.classList.add('sidebar-show', isOpen);
        }
    },[isOpen])

    return(
        <>
            <div className="navbar-bg"></div>
            <nav className="navbar navbar-expand-lg main-navbar">
                <form className="form-inline mr-auto">
                <ul className="navbar-nav mr-3">
                    <li><Link to="#" data-toggle="sidebar" onClick={()=> setIsOpen(!isOpen)} className="nav-link nav-link-lg"><i className="fas fa-bars"></i></Link></li>
                </ul>
                </form>
                <ul className="navbar-nav navbar-right">
                <li className="dropdown"><Link to="#" data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                    <img alt="image" src={profile && profile.profile_image ? env.SERVER_URL+profile.profile_image.original : user && user.user &&  user.user.profile_image ? env.SERVER_URL+user.user.profile_image.original : `/../assets/img/avatar/avatar-1.png`} className="rounded-circle mr-1" style={{height:'31px', width:'33px'}}/>
                    <div className="d-sm-none d-lg-inline-block">{profile && profile.first_name ? profile.first_name : user && user.user ? user.user.first_name : ''}</div></Link>
                    <div className="dropdown-menu dropdown-menu-right">
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-item has-icon text-danger logout-span" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> <span className="logout-span">Logout</span>
                    </span>
                    </div>
                </li>
                </ul>
            </nav>
        </>
    )
}

const mapStateToPros = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        loader: state.persistStore.loader,
        user: state.Auth,
        profile: state.persistStore.profile,
    }
};
function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(Header);
