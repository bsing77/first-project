import { csrfFetch } from "./csrf";

  const LOAD_REVIEWS = '/reviews/LOAD_REVEIWS'
  const RECEIVE_REVIEW = '/reviews/RECEIVE_REVIEW';
  const DELETE_REVIEW = '/reveiws/DELETE_REVIEW'


  // Action Creators

  const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS, 
        reviews,
    }
};

export const receiveReview = (spotId,review) => ({
    type: RECEIVE_REVIEW,
    spotId,
    review,
  });

  export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId,
  });

//Thunks

export const getAllReviews = (spotId) => async(dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    
    if(res.ok) {
        const review = await res.json();
        dispatch(loadReviews(review));
        // console.log(review)
        return review
       
    }
};

export const deleteAReview = (reviewId) => async(dispatch) => {
    // console.log(reviewId,"REDUCER REVIEW ID")
   const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    // console.log(res)
   if( res.ok) {
    // const report = await res.json(); 
    dispatch(deleteReview(reviewId));
    return null; 
   } 
   else {
    const spot = await res.json(); 
    return spot.errors;
   }
  };


export const addReview = (spotId,review) => async(dispatch) => {
    console.log(review, "******")
   const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
       method: 'POST', 
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(review),
     }
       );
       if (res.ok){
         const newReview = await res.json(); 

         dispatch(receiveReview(newReview))
         return newReview;  
   }
};

//Reducer
export default function reveiwsReducer (state = {}, action)  {
    //  let newState = {...state}
    switch(action.type) {
        case LOAD_REVIEWS:
            const  reviewState = {}; 
            action.reviews.Reviews.forEach((review) => {
                reviewState[review.id] = review;
            });
            return reviewState;

            case RECEIVE_REVIEW:
               
                const{spotId, review} = action
                return { ...state, [spotId]:review};

                case DELETE_REVIEW:
                    const newState = { ...state };
                    delete newState[action.reviewId];
                    return newState;
            default: 
            return state;
        }
    }