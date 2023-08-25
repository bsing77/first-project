
import { getSpotDetails } from '../../store/spots';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SpotDetailPage.css'




const   SpotDetailPage = () =>  {
    const spotId = useParams().id;
    const history = useHistory();
    const [goToSpot, setGoToSpot] = useState(spotId);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch(); 
  
  
    useEffect( () => {
        dispatch(getSpotDetails(spotId))
        .then(() => setIsLoaded(true));
    }, [dispatch, spotId])

    
   
       const spot = useSelector( state => state.spots[spotId])
   
    // console.log(spot)

    const previewImage = spot.SpotImages ? spot.SpotImages[0] : '';

    

    const otherImages = spot.SpotImages ? spot.SpotImages.map(image => image.url) : [];
    // console.log(otherImages)
    

    const firstName = spot.Owner ? spot.Owner.firstName : '';
    const lastName = spot.Owner ? spot.Owner.lastName : '';
   
    if(!spot){
        return <div>Loading ...</div>
    }
    
   return (
    <div isLoaded={isLoaded}>
        {isLoaded && (
            
       <div className="spotDetail-outer-div" >
        
        <div className='name-location-div'>
          <h1>{spot.name}</h1>
          <h2 className="location">{spot.city}, {spot.state}, {spot.country} </h2>
        </div>
          <div className='spot-images-div'>
              <div className='preview-image-div'>
                <img className="preview-image" src={previewImage.url} />  
              </div>
              <div className='other-images-div'>
                <div className="other-images-container">
                {otherImages.map(img => 
                    <img src={img}/>)} 
                </div>
              </div>
        </div>
        <div className="hostName-price-div">
            <div className="host-name">
                <h1>Hosted by {firstName} {lastName}</h1>
            </div>
            <div className="description">{spot.description}</div>
            <div className="price-star-rating-reserve-div">
                <p className='price'>${spot.price} night</p>
                
                <p><span>&#9734;</span>{spot.avgStarRating}</p>

                <div className='num-reviews'>{spot.numReviews} reviews</div>

                <div className='button-div'>
                    <button className='button'>Reserve</button>
                </div>
            </div>
        </div>
       </div>
        )}

       </div>
    
    
   )
}


export default SpotDetailPage;