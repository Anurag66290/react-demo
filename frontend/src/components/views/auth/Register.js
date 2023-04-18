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
import ImageUploading from 'react-images-uploading';

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

const Register = (props) => {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const { handleSubmit, submitting} = props;
    const [picture, setPicture] = useState(null);

    const [values, setValues] = useState({
        first_name:"",
        last_name:"",
        email:"",
        password:"",
    });

    const initialValues = {
        profile_image: picture ? picture : '',
    };
    const [imgData, setImgData] = useState(null);

    //handle change
    const handleChanges = (e) => {
        setPicture(null)
        setImgData(null)
        if (e.target.files[0]) {
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
          }
    };

    const handleSubmit_ = async (values) => {
        try{
            const formData = new FormData(); 
            let query = {}
            formData.append('image', picture);
            formData.append('type', 'image');
            formData.append('folder', 'users');

            props.dispatch(actions.persist_store({  loader:true }));
            await props.dispatch(AuthService.fileUpload(formData)).then((res) => {
                setSending(false);
                let newImg = res.body;
                values.profile_image = JSON.stringify(newImg)
            });

            

            await props.dispatch(AuthService.register(values)).then((res) => {
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
            <Helmet title="Register" />
            <div className="container mt-5" style={{overflow:'hidden'}}>
                <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="login-brand">
                    <img src="/../assets/img/stisla-fill.svg" alt="logo" width="100" className="shadow-light" />
                    </div>

                    <div className="card card-primary">
                    <div className="card-header"><h4>Register</h4></div>

                    <div className="card-body">
                        <form method="POST" onSubmit={handleSubmit(handleSubmit_)} autoComplete="off">
                        <div className="form-group">
                            <label for="first_name">First Name</label>
                            <Field 
                                name="first_name" 
                                component={renderField}
                                placeholder="First Name"
                                type="first_name" 
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label for="last_name">Last Name</label>
                            <Field 
                                name="last_name" 
                                component={renderField}
                                placeholder="First Name"
                                type="last_name" 
                                autoComplete="off"
                            />
                        </div>

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
                            <div className="d-block">
                                <label for="password" className="control-label">Confirm password</label>
                            </div>
                            <Field 
                                name="confirm_password" 
                                component={renderField}
                                placeholder="Password"
                                type="password" 
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6 col-12">
                                <label>Profile Image*</label>
                                <input 
                                    name="profile_image" 
                                    accept="image/*"
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleChanges(e)}
                                    // onBlur={handleBlur}
                                    // value={values.video}
                                />
                            </div>
                        </div>
                        {imgData!==null &&
                        <div className="row">
                            <div className="form-group col-md-6 col-12">
                                <img src={imgData} style={{with:'150px', height:'150px'}}/>
                            </div>
                        </div>
                        }

                        <div className="form-group">
                            <LoadingButton
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                loading={sending}
                                disabled={submitting}
                            >
                                {!sending ? <><i className="fa fa-sign-in fa-lg fa-fw"></i>Register</> : ''}
                            </LoadingButton>
                        </div>
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
    //first_name
    if (!values.first_name) {
        errors.first_name = 'Required'
    }
    //last_name
    if (!values.last_name) {
        errors.last_name = 'Required'
    }
    //email
    if (!values.email) {
      errors.email = 'Required'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    //password
    if (!values.password) {
      errors.password = 'Required'
    }
    else if (values.password.length < 6) {
      errors.password = 'Must be 6 characters or greater'
    }
    //confirm _password
    if (!values.confirm_password) {
        errors.confirm_password = "Confirm Password is required";
    }
    else if (values.confirm_password !== values.password) {
        errors.confirm_password = "Confirm Password doesn't match with password"
    }
    return errors
}

const RegisterForm = reduxForm({
	form: 'register',
	validate
})(Register);


export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);