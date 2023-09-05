  import { useModal } from "../../context/Modal";
  import { useDispatch } from "react-redux";
  import { deleteASpot } from "../../store/spots";


  function DeleteSpotModal({spot}){

    const {closeModal} = useModal;
    const dispatch = useDispatch(); 
    const handleClick = (e) => {
        e.preventDefault(); 
        
        return dispatch(deleteASpot(spot.id))
        .then(closeModal)

        }
    
        const noClick = (e) => {
            e.preventDefault(e);
            return (closeModal)
        }
    

    return (
         <div>
            <h1 className="confirm-delete">Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleClick} className="button">Yes</button>
            <button onClick={noClick} className="button grey">No</button>
        </div>
    )
  }
  export default DeleteSpotModal;