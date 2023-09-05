
import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser'; 

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};

export const login = (user) => async(dispatch) => {
    const {credential, password} = user; 
    const response = await csrfFetch('/api/session', {
        method: 'POST', 
        header: {
          "Content-type": 'application/json'
        },
        body: JSON.stringify({
            credential, 
            password,
        }),
    });
  
    const data = await response.json(); 
    if(!response.status >= 400) {
      
      // console.log(data, 'DATA')
      
      return (data.errors)
    }

    dispatch(setUser(data.user));
   
    return response; 
}

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();

    // console.log(data)
    if (response.status >= 400){
      return (data.errors)
    }
    dispatch(setUser(data.user));
    return response;
  };


  export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

const initalSate = {user:null}; 





const sessionReducer =  (state = initalSate, action) => {
    let newState;
    switch (action.type) {
      case SET_USER:
        newState = Object.assign({}, state); 
        newState.user = action.payload;
        return newState; 
      case REMOVE_USER:
        newState = Object.assign({}, state); 
        newState.user = null; 
        return newState;
        default: 
        return state;
    }
}
export default sessionReducer;