
import { getSpotDetails } from "../../store/spotDetails";
import { Link, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';



const   SpotDetailPage = () =>  {
    const spotId = useParams().id;
    const history = useHistory();
    
    const dispatch = useDispatch(); 
  
  const spotDetails = useSelector(state => state.spotDetails);
     
    console.log(spotDetails)
  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  },[dispatch, spotId])

    // console.log(spots); 
const spot = spotDetails[spotId] || null; 
   return (
       <div>
          {spot ? (
        <div>
          <h2>{spot.name}</h2>
          {/* Display other spot details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
       
   )
}


export default SpotDetailPage;