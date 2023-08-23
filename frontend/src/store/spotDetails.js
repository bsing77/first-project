

const RECEIVE_SPOT = '/spots/RECEIVE_SPOT'

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
  });

  export const getSpotDetails = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)
  console.log(res)
    if(res.ok) {
      const spot =  await res.json(); 
      dispatch(receiveSpot(spot))
    } 
  };

  export default function spotDetailsReducer (state = {}, action)  {
    //  let newState = {...state}
    switch(action.type) {
            case RECEIVE_SPOT:
                return { ...state, [action.spot.id]: action.spot };

            default:
                return state;
    }
}