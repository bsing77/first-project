import { useDispatch,useSelector } from "react-redux";

 import { useEffect, useState } from "react";
 import { getAllSpotsOfCurrentUser } from "../../store/spots";
 import { useHistory, useParams } from "react-router-dom/";
//  import SpotShowCard from "../SpotShowCard";

import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ManageSpotUpdate from "../ManageSpotUpdate";
import DeleteSpotModal from "./DeleteSpotModal";
import './ManageSpotsPage.css'
import { UpdateButton } from "./UdateButton";




function MangageSpotsPage (){
    const [spotId, setSpotId] =useState('');
    const [selectedSpot, setSelectedSpot] = useState(null);
    const dispatch = useDispatch(); 
    const spots = useSelector((state) => Object.values(state.spots));
    // console.log(spots); 
    const history = useHistory(); 

    // console.log(selectedSpot,'THIS IS THE SPOT')

    useEffect(() => {
        dispatch(getAllSpotsOfCurrentUser())
    }, [dispatch]);

    const handleButtonClick = (event) => {
        event.preventDefault();
       
      
    }
    const handleUpdateClick = (e) => {
        e.preventDefault();
        history.push(`/spots/${spotId}/edit`)
    }
   

    const newSpotHandleClick=() => {
        history.push('/spots/new')
      }
    console.log(selectedSpot,"THIS IS THE SPOT")
    return (
        <div className='outer-spot-div'>
            <div className="manage-spot-inner-div">
            <div className="manage-spot-title">
                <h1>Manage Your Spots</h1>
            </div>
            <div>
                <button 
                onClick={newSpotHandleClick}className="manage-a-new-spot-button">Create a New Spot</button>
            </div>
        <div className= 'spot-ul'>
            <ul className = 'spot-group'>
                {spots.map(spot => (
                   
                    <Link to= {`/spots/${spot.id}`}className='spot-link tooltip' data-tooltip={spot.name} key = {spot.id}>
                        <div key ={spot.id} className='spotItem'>
                    <div className='image-div'>
                    <img className ="spot-preview-image" src ={spot.preview}></img>
                    </div>
                    <div className="spot-details">
                        <div classname="spot-location-star-div">
                    <p className='spot-location' >{spot.city}, {spot.state}</p>
                    
                    <p className='avg-star-rating'><i class="fa-solid fa-star" style={{color: "#d4ce11"}}></i>{spot.avgStarRating ? spot.avgStarRating : 'New'}</p>
                    </div>
                    <div className='spot-price-night-div'>
                    <p className='spot-price'>${spot.price}.00 </p><span className='spot-night'> night</span> </div>
                    </div>
                    <div className='update-delete-buttons'>
                   <Link to = {`spots/${spot.id}/edit`}> <button className="manage-spot-update-button" onClick={handleButtonClick}>
                    Update 
                    </button></Link> 
                    {/* <UpdateButton onClick={handleButtonClick}spot={spot} /> */}
                    <button className="manage-spot-delete-button" onClick={ handleButtonClick}> <OpenModalMenuItem
                  itemText="Delete"
                //   onItemClick={closeMenu}
                  modalComponent={<DeleteSpotModal spot ={spot} />}/></button>
                    </div>
                    </div>
                    </Link>
                ))}
            </ul>
            </div>
        </div>
          </div>              
                
    //      {selectedSpot && <ManageSpotUpdate selectedSpot={selectedSpot} />}    
        
    // </div>
    )
}

export default MangageSpotsPage;