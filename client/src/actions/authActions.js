import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER } from "./type";
import jwt_decode from "jwt-decode";

//register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      console.log(res.data);
      //   refresh
      //   window.location.href = "/login";

      //not refresh
      history.push("/login");
    })
    .catch(err => {
      //not 200
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

  //     dispatch({
  //       type: GET_ERRORS,
  //       payload: res
  //     });
  //   } catch (e) {
  //     console.log(e.response);
  //   }
};

export const loginUser = userData => {
  return dispatch => {
    axios
      .post("/api/users/login", userData)
      .then(res => {
        //save to localstorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        //set token to head
        setAuthToken(token);
        //decode
        const decoded = jwt_decode(token);
        //set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  };
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//log user out
export const logoutUser = () => dispatch => {
  //remove token from localStorage
  localStorage.removeItem("jwtToken");

  //remove auth header
  setAuthToken(false);

  //set redux state
  dispatch(setCurrentUser({}));
};
