

const LOAD_SPOT_IMAGES = '/spot-images/LOAD_SPOT_IMAGES'
const RECEIVE_SPOT_IMAGE = '/spot-images/RECEIVE_SPOT_IMAGE'
const ADD_SPOT_IMAGE = '/spot-images/ADD_SPOT_IMAGE'
//action creators
const loadSpotImages = (images) => {
    return {
        type: LOAD_SPOT_IMAGES, 
        images,
    }
};

export const receiveSpotImage = (image) => ({
    type: RECEIVE_SPOT_IMAGE,
    image,
  });
 export const addSpotImage = (image) => async(dispatch) => {
    const res = await fetch('/api/spot-images/new',{
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot),
      }
        );
        if (res.ok){
          const report = await res.json(); 
          dispatch(receiveSpot(spot))
          return report;  
    }
 }

// THUNKS
export const getAllSpots = () => async(dispatch) => {
    const res = await fetch('/api/spots');
    
    if(res.ok) {
        const spot = await res.json();
        dispatch(loadSpots(spot));
        
        return spot
       
    }
};