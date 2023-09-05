
import { getSpotDetails } from '../../store/spots';
import {  useParams, useHistory} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllReviews } from '../../store/reviews';
import { PostReviewButton } from './PostReviewButton';
import './SpotDetailPage.css'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
// import DeleteReviewModal from './DeleteReviewModal';
import { DeleteReviewButton } from './DeleteReviewButton';


const   SpotDetailPage = () =>  {
    const spotId = useParams().id;
    console.log(spotId,"from sotDEtail page")
    const sessionUser = useSelector((state) => state.session.user);

    const [isSessionUser, setIsSessionUser] = useState(true)
    
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch(); 
   
  const history = useHistory();
  
    useEffect( () => {
        dispatch(getSpotDetails(spotId))
        dispatch(getAllReviews(spotId))
        .then(() => setIsLoaded(true));
    }, [dispatch, spotId,])

    // useEffect(() => {
    //     if(!sessionUser || sessionUser.id === )
    // })
    const formatNumber =(number) => {
        // Ensure the number is rounded to the nearest tenth
        const roundedNumber = Math.round(number * 10) / 10;
        
        // Use Number.toFixed(1) to format with one decimal place
        return roundedNumber.toFixed(1);
      }

    
   const handleClick = () => {
    return alert("Feature coming soon")
   }
    
    const spot = useSelector( state => state.spots[spotId]);
    const reviews = useSelector(state => Object.values(state.reviews))
    console.log(reviews, "REVIEWS")
    // console.log(spot)

    if(!isLoaded) {
        return <div>Loading...</div>
    }
    if(!spot){
        return <div>Loading ...</div>
    }
    // if(!reviews){
    //     return <div>Loading ...</div>
    // }


    // const review = reviews.map( rev => rev.review ? rev.review: '')
    // console.log(review)
            
    const previewImage = spot.SpotImages ? spot.SpotImages[0] : '';
      
    const userOwner = (owner) => {
        if(owner === spot.ownerId){
            return true
        } else {
            return false
        }
    }
    // const preview = spot.SpotImages ? spot.SpotImages[0] : ''
    const otherImages = spot.SpotImages ? spot.SpotImages.map(image => image.url) : [];
    // console.log(otherImages)
    

    const firstName = spot.Owner ? spot.Owner.firstName : '';
    const lastName = spot.Owner ? spot.Owner.lastName : '';


//      const apiDateString = reviews.createdAt
//  const apiDate = new Date(apiDateString);
 
//  const options = { year: 'numeric', month: 'long' };
//  const formattedDate = apiDate.toLocaleDateString('en-US', options);
 
 const  dateFormat = (date) => {
    const apiDate = new Date(date); 
    const options ={year: 'numeric', month: 'long'}
    const formattedDate = apiDate.toLocaleDateString('en-Us', options)
    return formattedDate;

}   

const manageClick =() => {
    history.push('/manage-spots');

}
   
   
   return (
    
            
       <div className="spotDetail-outer-div" >
        <div className='inner-outer-div'>
        
        <div className='name-location-div'>
          <h1>{spot.name}</h1>
          <h2 className="location">{spot.city}, {spot.state}, {spot.country} </h2>
        </div>
          <div className='spot-images-div'>
              <div className='preview-image-div'>
                <img className="preview-image" src={previewImage.url} alt='preview' />  
              </div>
              <div className='other-images-div'>
                <div className="other-images-container" >
                {otherImages.map(img => 
                <div className='other-image-div'>
                    <img className='other-images' key={img.id} alt='url' src={img}/> </div>)} 
                    {/* make sure that img is defined  */}
                </div>
              </div>
        </div>
        <div className="hostName-price-div">
            <div className="host-name">
                <h1 className="host">Hosted by {firstName} {lastName}</h1>
            <div className="description">{spot.description}</div>
            </div>
            <div className='price-star-rating-reserve-outer-div'>
            <div className="price-star-rating-reserve-div">
                <div className='price-star-rating-div'>
                    <div className='line-up-div'>
                        <div className='price-night-div'>
                <p className='price'>${spot.price} </p><span className="night">night</span></div>
                
                <p className={`star`}><i class="fa-solid fa-star" style={{color: "#d4ce11"}}></i>{spot.avgStarRating ? formatNumber(spot.avgStarRating) : 'New'}</p>

                <p className={`num-reviews ${spot.numReviews === 0 ? 'hidden': ''}`}>{spot.numReviews} reviews</p>
                </div>
                </div>

                <div className='button-div'>
                    <button className='button' onClick={handleClick}>Reserve</button>
                </div>
                </div>
            </div>
        </div>
        

        <div className='reviews-outer-div'>
                <div className='reviews-container'>
                <div className='avg-star'>
                    <div className='avgstar-numreviews-div'>
                    <p className="review-avg-star-rating"><i class="fa-solid fa-star" style={{color: "#d4ce11"}}></i>{spot.avgStarRating ? formatNumber(spot.avgStarRating) : 'New'}
                    </p>
                    <p className={`${spot.numReviews === 0 ? 'hidden': 'review-num' } `}>{spot.numReviews}reviews</p>
                    </div>
                    <div className={`post-review-button-div ` }>
                       <PostReviewButton  spot={spot}/>
                    </div>
                    </div>
                    { reviews && reviews.length > 0
                    
                 
                    ? (
                          
                        <div className='review-item-div'>
                    
                    <div className='review-list'>
                        {reviews.map(review => (
                        <div key={review}>
                            { review &&review.User ? (
                        <>
                       <p className="review-first-name" >{review.User.firstName}</p>
                       <div className='date-outer-div'>
                       <p className ="date-div">{dateFormat(review.createdAt)}</p></div>
                       <div className='review-outer-div'>
                       
                       <p className="review-div">{review.review}</p></div></>
                           ): ""}
                       <div ><DeleteReviewButton review ={review} /></div>
                       </div>
                       ))}
                       </div>
                    </div>    
                    ) : 
                    <div className='first-review-div'>
                        {/* <p>Be the first to post a review!</p> */}
                        </div>
                    }
                </div>
                </div>
                </div>
       </div>
        

     
    
    
   )
}


export default SpotDetailPage;