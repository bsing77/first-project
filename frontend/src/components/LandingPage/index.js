import { useDispatch,useSelector } from "react-redux";
import { getAllSpots
 } from "../../store/spots";
 import { useEffect } from "react";


 function LandingPage () {
    const dispatch = useDispatch(); 
    const spots = useSelector((state) => Object.values(state.spots));
    console.log(spots); 

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch]);

    return (
        <div>
            <ul>
                {spots.map((spot) => (
                    spot.id

                ))}
            </ul>
        </div>
    )
 }

 export default LandingPage;