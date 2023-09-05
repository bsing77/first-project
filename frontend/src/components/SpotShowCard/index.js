import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import './SpotShowCard.css'

const SpotShowCard = ({spot}) => {
    const {city,state,avgStarRating,price,preview} = spot

    const history = useHistory()
   const handleClick = () => {
    history.push(`/spots/${spot.id}`)
   }
    return (
        <div  onClick={handleClick} className="tooltip" data-tooltip={spot.name}>
        <img className ="spot-preview-image" src ={preview}></img>
        <p>{city}, {state}</p>
        <p><span>&#9734;</span>{avgStarRating}</p>
        <p>${price}.00 night</p>
        </div>
    )
}
export default SpotShowCard;