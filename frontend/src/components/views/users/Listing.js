import React, {useState, useEffect} from "react";
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import AuthService from 'services';
import swal from 'sweetalert';
import * as actions from 'store/actions';
import env from 'env.json';


const Listing = (props) => {
    const [data, setData] = useState([]);
    const MODULE_NAME = 'user';
    
    //get data
    async function getData() {
        try{
            let query={
                MODULE_NAME
            }
           props.dispatch(actions.persist_store({ loader:true}));
            await props.dispatch(AuthService.getList(query)).then((res) => {
               props.dispatch(actions.persist_store({ loader:false}));
               setData(res.body);
            });
 
        }catch(err) {
           props.dispatch(actions.persist_store({ loader:false}));
           console.log(err);
           if(err && err.data && err.data.message){
               swal("Oops!", err.data.message, "error");
           }
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return(
        <>
            <Helmet title="Users" />
            <section className="section">
                <div className="section-header">
                    <h1>Users List</h1>
                </div>
           
                    <div className="section-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div class="card-header">
                                        <div className="col-md-6">
                                            <h4>Listing</h4>
                                        </div>
                                    </div>
                                    <div className="card-body"  style={{overflowY: 'auto'}}>
                                        {!props.loader && data.length>0 &&
                                            <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Image</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {data.length>0  && data.map((item, i) => {
                                                return(
                                                    <tr key={i}>
                                                        <td>{item.first_name}</td>
                                                        <td>{item.last_name}</td>
                                                        <td>{item.email}</td>
                                                        <td>
                                                            <img src={item.profile_image && item.profile_image?.original ? env.SERVER_URL+item.profile_image.thumbnail : '/assets/img/avatar/avatar-1.png'} className="img-size" />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                            </table>
                                        }
                                        {!props.loader && data.length==0 && 
                                            <div className="col-md-6">
                                                <h6>Data not found....</h6>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </>
    )
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated: state.Auth.isAuthenticated,
        user: state.Auth,
        loader:state.persistStore.loader,
    }
};

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Listing);