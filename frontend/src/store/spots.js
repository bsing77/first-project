import { csrfFetch } from "./csrf";


const LOAD_SPOTS = '/spots/LOAD_SPOTS'
const RECEIVE_SPOT = '/spots/RECEIVE_SPOT';
const ADD_IMAGES_TO_SPOT= '/spots/ADD_IMAGES_TO_SPOT'
const ADD_SPOT = '/spots/ADD_SPOT'
const UPDATE_SPOT= '/spots/UPDATE_SPOT'
const DELETE_SPOT = '/spots/DELETE_SPOT'
//action creators
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS, 
        spots,
    }
};

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
  });

  export const addImagesToSpot = (spotId,imageObj) => ({
      type: ADD_IMAGES_TO_SPOT,
      spotId,
      imageObj,
    });

    export const editSpot = (spot) => ({
        type: UPDATE_SPOT,
        spot
    });

    export const deleteSpot = (spotId) => ({
        type: DELETE_SPOT,
        spotId,
      });
    
    // THUNKS
    export const addImages = (spotId, imageObject) => async (dispatch) => {
        // console.log(imageObject, "IMAGEOBJECT")
        const res = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: {
                'Conent-Type':'application/json',
            },
            body: JSON.stringify(imageObject),
            
            
        });
        if (res.ok){
            const updatedImages = await res.json(); 
            dispatch(addImagesToSpot(spotId,updatedImages));
            return updatedImages;
        }
    }

    export const addSpot = (spot) => async(dispatch) => {
        // console.log(spot, "******")
       const res = await csrfFetch('/api/spots',{
           method: 'POST', 
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(spot),
         }
           );
           if (res.ok){
             const newSpot = await res.json(); 
             dispatch(receiveSpot(newSpot))
             return newSpot;  
       }
    };
export const getAllSpots = () => async(dispatch) => {
    const res = await fetch('/api/spots');
    
    if(res.ok) {
        const spot = await res.json();
        dispatch(loadSpots(spot));
        
        return spot
       
    }
};

export const getAllSpotsOfCurrentUser =() => async(dispatch) => {
    const res = await csrfFetch('/api/spots/current')
       
    if (res.ok){
        const spot = await res.json();
        dispatch(loadSpots(spot));
        return spot
    }
}

export const getSpotDetails = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
  
    if(res.ok) {
      const spot =  await res.json(); 
    //   console.log(spot)
      dispatch(receiveSpot(spot))
      
    } 
  };


  export const deleteASpot = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`api/spots/${spotId}`, {
        method: 'DELETE'
    })
    // console.log(res)
   if( res.ok) {
    // const report = await res.json(); 
    dispatch(deleteSpot(spotId));
    return null; 
   } 
   else {
    const spot = await res.json(); 
    return spot.errors;
   }
  };

  export const updateSpot = (spot, spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
       method: 'PUT',
       headers:{ 'Content-Type': 'application/json'},
       body: JSON.stringify(spot)
     });
    //  console.log(res);
     if (res.ok){
       const spot = await res.json(); 
       dispatch(editSpot(spot))
     } 
    //  else {
    //    if(res.status < 500){
    //      const data = await res.json()
    //      console.log(data, "error data")
    //      // if(data.errors){
    //      //   return data.errors
    //      // }
    //    } 
    //  }
   
   }



export default function spotsReducer (state = {}, action)  {
    //  let newState = {...state}
    switch(action.type) {
        case LOAD_SPOTS:
            const  spotsState = {}; 
            action.spots.Spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        case RECEIVE_SPOT:
            ADD_SPOT:
            
            return { ...state, [action.spot.id]: action.spot };
        
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        
        case ADD_IMAGES_TO_SPOT:
                const { spotId, imageObject} = action;
                // console.log(imageObject,"REDUCER IMAGE OBJECT")
                const spotToUpdate = state[spotId];
                if (spotToUpdate) {
                  const updatedSpot = {
                    ...spotToUpdate,
                    preview: [spotToUpdate.preview,imageObject]
                  };
                  return { ...state, [spotId]: updatedSpot };
                };

            case DELETE_SPOT:
                    const newState = { ...state };
                    delete newState[action.spotId];
                    return newState;
             
        default:
            return state;
    }
}

