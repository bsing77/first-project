import { useDispatch,useSelector } from "react-redux";
import { getAllSpots
 } from "../../store/spots";
 import { useEffect } from "react";
 import './LandingPage.css'
 import SpotShowCard from "../SpotShowCard";


 function LandingPage () {
    const dispatch = useDispatch(); 
    const spots = useSelector((state) => Object.values(state.spots));
    // console.log(spots); 

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

   
   

    return (
        <div className= 'spot-ul'>
            <ul>
                {spots.map(spot => (
                    <div key={spot.id} className= 'single-spot tootip'>
                        <SpotShowCard spot={spot} />
                    </div>
                ))}
            </ul>
        </div>
            
                
                  
    )
 }

 export default LandingPage;