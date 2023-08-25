

const LOAD_SPOTS = '/spots/LOAD_SPOTS'
const RECEIVE_SPOT = '/spots/RECEIVE_SPOT'

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
// THUNKS
export const getAllSpots = () => async(dispatch) => {
    const res = await fetch('/api/spots');
    
    if(res.ok) {
        const spot = await res.json();
        dispatch(loadSpots(spot));
        
        return spot
       
    }
};

export const getSpotDetails = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
  
    if(res.ok) {
      const spot =  await res.json(); 
      console.log(spot)
      dispatch(receiveSpot(spot))
      
    } 
  };

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
                return { ...state, [action.spot.id]: action.spot };

            default:
                return state;
    }
}

