import { useModal } from "../../context/Modal";
  import { useDispatch } from "react-redux";
//   import { deleteASpot } from "../../store/spots";
import { deleteAReview } from "../../store/reviews";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


  function DeleteReviewModal({review}){

    const {closeModal} = useModal;
    const dispatch = useDispatch(); 
    const history = useHistory();
    const handleClick = async (e) => {
        e.preventDefault(); 
        
        return  await dispatch(deleteAReview(review.id))
        .then(closeModal)
        
       

        }
    
        const noClick = () => {
            closeModal(); 
        }
    
console.log(review.id,'DELETETHISREVIEW')
    return (
         <div>
            <h1 className="confirm-delete">Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <button onClick={handleClick} className="button">Yes</button>
            <button onClick={noClick} className="button grey">No</button>
        </div>
    )
  }
  export default DeleteReviewModal;