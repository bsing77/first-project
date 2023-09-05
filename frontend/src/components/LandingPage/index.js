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
const  formatNumber = (number) => {
    // Ensure the number is rounded to the nearest tenth
    const roundedNumber = Math.round(number * 10) / 10;
    
    // Use Number.toFixed(1) to format with one decimal place
    return roundedNumber.toFixed(1);
  }

    return (
        <div className='outer-spot-div'>
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
                    
                    <p className='avg-star-rating'><i class="fa-solid fa-star" style={{color: "#d4ce11"}}></i>{spot.avgStarRating ? formatNumber(spot.avgStarRating) : 'New'}</p>
                    </div>
                    <div className='spot-price-night-div'>
                    <p className='spot-price'>${spot.price}.00 </p><span className='spot-night'> night</span> </div>
                    </div>
                    </div>
                    </Link>
                ))}
            </ul>
        </div>
        </div>
            
                
                  
    )
 }

 export default LandingPage;