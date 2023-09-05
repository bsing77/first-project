import {  useParams,} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllReviews } from '../../store/reviews';
import { getSpotDetails } from '../../store/spots';
import PostReviewFormModal from '../PostReviewFormModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal';


export const DeleteReviewButton =({review}) => {
    const sessionUser = useSelector((state) => state.session.user);
    
    
    const [isSessionUser, setIsSessionUser] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch(); 
    // const reviewId = review.id
console.log(review.id,"REVIEWID")
    // useEffect( () => {
    //     dispatch(getSpotDetails(spotId))
    //     dispatch(getAllReviews(spotId))
    //     .then(() => setIsLoaded(true));
    // }, [dispatch, spotId,])
    console.log(sessionUser,"SESSIONUSER")
    useEffect(() => {
        if( sessionUser && sessionUser.id === review.userId ){
            setIsSessionUser(true)
        } else {
            setIsSessionUser(false)
        }
    }, [useSelector,isSessionUser])

    // const spot = useSelector( state => state.spots[spotId]);
    // const reviews = useSelector(state => Object.values(state.reviews))
    // console.log(reviews)
    // console.log(spot)
        // const reviewId = reviews.map(review => review.userId)
    //     console.log(reviewId)
    // if(!isLoaded) {
    //     return <div>Loading...</div>
    // }
    // if(!spot){
    //     return <div>Loading ...</div>
    // }
    

    // const userOwner = () => {
    //    if(sessionUser && sessionUser.id === spot.ownerId || reviewId.includes(sessionUser.id) ){
    //     return true
    //    } else {
    //     return false
    //    }
    // }

    return(
        
        


            <div>
    
                <button className={`review-delete-button ${isSessionUser ? '': 'hidden'}` } >
                <OpenModalMenuItem
                  itemText="Delete"
                //   onItemClick={closeMenu}
                  modalComponent={<DeleteReviewModal review ={review} />}
                /></button>
            </div>

        

        

    
    )
}