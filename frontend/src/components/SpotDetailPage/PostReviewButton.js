import {  useParams,} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllReviews } from '../../store/reviews';
import { getSpotDetails } from '../../store/spots';
import PostReviewFormModal from '../PostReviewFormModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';


export const PostReviewButton =() => {
    const sessionUser = useSelector((state) => state.session.user);
    const spotId = useParams().id;
    
    const [isSessionUser, setIsSessionUser] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch(); 

    useEffect( () => {
        dispatch(getSpotDetails(spotId))
        dispatch(getAllReviews(spotId))
        .then(() => setIsLoaded(true));
    }, [dispatch, spotId,])

    useEffect(() => {
        if( !sessionUser || sessionUser.id === spot.ownerId || reviewId.includes(sessionUser.id)){
            setIsSessionUser(true)
        } else {
            setIsSessionUser(false)
        }
    }, [useSelector,isSessionUser])
    
    const spot = useSelector( state => state.spots[spotId]);
    const reviews = useSelector(state => Object.values(state.reviews))
    const reviewId = reviews.map(review => review.userId)
    console.log(reviewId)
    // console.log(reviews)
    // console.log(spot)
    if(!isLoaded) {
        return <div>Loading...</div>
    }
    if(!spot){
        return <div>Loading ...</div>
    }
    if(!reviews){
        return <div>Loading ...</div>
    }
    

    const userOwner = () => {
       if(sessionUser && sessionUser.id === spot.ownerId || reviewId.includes(sessionUser.id) ){
        return true
       } else {
        return false
       }
    }

    return(
        
        


            <div>
    
                <button className={`post-review-button ${isSessionUser ? 'hidden-gone': ''}` } >
                <OpenModalMenuItem
                  itemText="Post Your Review"
                //   onItemClick={closeMenu}
                  modalComponent={<PostReviewFormModal spot ={spot} />}
                /></button>
                <div>
                <p className={`${isSessionUser ? 'hidden-gone': ''}`}>Be the first to post a review!</p>
                </div>
            </div>

        

        

    
    )
}
