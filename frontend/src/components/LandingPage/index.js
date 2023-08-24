import { useDispatch,useSelector } from "react-redux";
import { getAllSpots
 } from "../../store/spots";
 import { useEffect } from "react";
 import './LandingPage.css'
//  import SpotShowCard from "../SpotShowCard";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";


 function LandingPage () {
    const dispatch = useDispatch(); 
    const spots = useSelector((state) => Object.values(state.spots));
    // console.log(spots); 

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

    const history = useHistory()
//    const handleClick = () => {
//     history.push(`/spots/${spot.id}`)
   

    return (
        <div className= 'spot-ul'>
            <ul className = 'spot-group'>
                {spots.map(spot => (
                    <Link to= {`/spots/${spot.id}`}className='spot-link tooltip' data-tooltip={spot.name}>
                        <div key ={spot.id} className='spotItem'>
                    <div className='image-div'>
                    <img className ="spot-preview-image" src ={spot.preview}></img>
                    </div>
                    <div className="spot-details">
                    <p >{spot.city}, {spot.state}</p>
                    <p className='avg-star-rating'><span>&#9734;</span>{spot.avgStarRating ? spot.avgStarRating : 'New'}</p>
                    <p >${spot.price}.00 night</p>
                    </div>
                    </div>
                    </Link>
                ))}
            </ul>
        </div>
            
                
                  
    )
 }

 export default LandingPage;