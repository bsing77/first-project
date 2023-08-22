

const LOAD_SPOTS = '/spots/LOAD_SPOTS'

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS, 
        spots,
    }
}
// THUNKS
export const getAllSpots = () => async(dispatch) => {
    const res = await fetch('/api/spots');
    console.log(res)
    if(res.ok) {
        const spot = await res.json();
        dispatch(loadSpots(spot));
        
        return spot
       
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
            return spotsState

            default:
                return state;
    }
}

