import ManageSpotUpdate from "../ManageSpotUpdate"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"


export const UpdateButton =() =>{
    const {spotId} = useParams();
        const history = useHistory();
    const handleClick =(e, ) => {
        e.preventDefault();
       history.push(`/spots/${spotId}/edit`)
    }
    return (
        <div>
        <button className="manage-spot-update-button" onClick={handleClick}>Update</button>
        {/* <ManageSpotUpdate selectedSpot={spot} /> */}
        
        
        </div>
    )
    // {spot && <ManageSpotUpdate selectedSpot={spot}/>}
}

