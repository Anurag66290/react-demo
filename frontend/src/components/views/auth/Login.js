import React, {useState} from "react";
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as Path from 'routes/paths';
import { Field, reduxForm } from 'redux-form';
import LoadingButton from 'components/shared/LoadingButton';
import AuthService from 'services';
import swal from 'sweetalert';
import * as actions from 'store/actions';

const renderField = ({
    input,
    placeholder,
    type,
    autoComplete,
    meta: { touched, error, warning }
}) => (
    <>
        <input {...input} type={type} placeholder={placeholder} autoComplete={autoComplete} className={`form-control ${touched && error ? `is-invalid` : ''}`}/>
        
        {touched &&
            (error && <span className="invalid-feedback">{error}</span>)
        }
    </>
)

const Login = (props) => {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const { handleSubmit, submitting} = props;

    const [values, setValues] = useState({
        email:"",
        password:"",
    });

    const handleSubmit_ = async (values) => {
        try{
            setSending(true);
            props.dispatch(actions.persist_store({ loader:true }));
            await props.dispatch(AuthService.login(values)).then((res) => {
                setSending(false);
                props.dispatch(actions.persist_store({  loader:false }));
                swal("Success", res.message, "success");
                setSuccess(true);
            });
        }catch(err) {
            props.dispatch(actions.persist_store({ loader:false }));
            console.log(err);
            setSending(false);
            if(err && err.data && err.data.message){
                swal("Oops!", err.data.message, "error");
            }
        }
    }

    return(
        <>
        {success==true &&
            <Redirect to={Path.users} />
        }
            <Helmet title="Login" />
            <div className="container mt-5" style={{overflow:'hidden'}}>
                <div className="row">
                <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                    <div className="login-brand">
                    <img src="/../assets/img/stisla-fill.svg" alt="logo" width="100" className="shadow-light" />
                    </div>

                    <div className="card card-primary">
                    <div className="card-header"><h4>Login</h4></div>

                    <div className="card-body">
                        <form method="POST" onSubmit={handleSubmit(handleSubmit_)} autoComplete="off">
                        <div className="form-group">
                            <label for="email">Email</label>
                            <Field 
                                name="email" 
                                component={renderField}
                                placeholder="E-Mail"
                                type="email" 
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <div className="d-block">
                                <label for="password" className="control-label">Password</label>
                            </div>
                            <Field 
                                name="password" 
                                component={renderField}
                                placeholder="Password"
                                type="password" 
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <LoadingButton
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                loading={sending}
                                disabled={submitting}
                            >
                                {!sending ? <><i className="fa fa-sign-in fa-lg fa-fw"></i>SIGN IN</> : ''}
                            </LoadingButton>
                        </div>
                        <Link to={Path.register}><p>Register Here</p></Link>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>

    )
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        user: state.Auth,
    }
};

function mapDispatchToProps(dispatch) {
    return { dispatch };
}
const validate = (values) => {
    const errors = {}
    //email
    if (!values.email) {
      errors.email = 'Email Required'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    //password
    if (!values.password) {
      errors.password = 'Password Required'
    }
    else if (values.password.length < 6) {
      errors.password = 'Must be 6 characters or greater'
    }
    return errors
}

const LoginForm = reduxForm({
	form: 'login',
	validate
})(Login);


export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);