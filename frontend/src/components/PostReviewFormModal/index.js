import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams, useHistory } from "react-router-dom"
import { addReview } from "../../store/reviews";
import './PostReviewFormModal.css'




function PostReviewFormModal({spot}){
    // const spotId = useParams().id
    const [newReview, setNewReview] = useState(""); 
    const [starRating, setStarRating] = useState(0); 
    const [validationErrors, setValidationErrors] = useState();
    const [isDisabled, setIsDisabled] = useState(true)
    const dispatch = useDispatch(); 
    const history = useHistory();
    const { closeModal } = useModal();

    // console.log(spot.id,'SPOT ID ')
    console.log(newReview, starRating, "IS THIS CHANGING? ")
    useEffect(() => {
        const errors = {}
        if(newReview.length < 10 ){
            errors.numReview= "Reveiw must have more than 10 characters"
            return
        };
        if(starRating < 1){
            errors.starRating="Review must have at least one star"
        }
        setValidationErrors(errors); 
    },[starRating,newReview]);


    useEffect(() => {
        if( newReview.length < 10 || starRating === 0){
            setIsDisabled(true)
        }
       
        else {
            setIsDisabled(false)
        }
    },[starRating,newReview]);



   const onSubmit = async(e) => {
    e.preventDefault();
    setValidationErrors({}); 
    

   try {

       const reviewInfo = {
            review:newReview,
            stars:starRating
        }
        // console.log(reviewInfo," this is my reveiw info")
        return dispatch(addReview(spot.id,reviewInfo))
       .then(closeModal)
   } 

   catch(validationErrors){
    if(validationErrors.length){
        setValidationErrors(validationErrors)
    }
   }

   setNewReview("");
   setStarRating(0);
   setValidationErrors({});

    

   
};

    const handleStarClick =(rating) => {
        setStarRating(rating);
    }

    return (
        <>
            <div className='post-review-outer-div'>
            <h1>How was your stay?</h1>
            <form onSubmit={onSubmit}>
            <textarea  onChange={(e) => setNewReview(e.target.value)} className="textarea" placeholder="Leave your review here"></textarea>
            <div className= 'star-container'>
              {[1,2,3,4,5].map((rating) =>(
                <i
                key={rating}
                className={`fa-regular fa-star ${rating  <= starRating ? 'active':''}`}
                onClick={() => handleStarClick(rating)}
                ></i>
              ))}
                <span>Stars</span>
            </div>
            <button className={`button ${isDisabled ? 'grey': '' }`} disabled={isDisabled} type="submit">Submit Your Review</button>
            </form>
            </div>
        </>
    )
}

export default PostReviewFormModal;