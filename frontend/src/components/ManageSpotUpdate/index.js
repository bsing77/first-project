  

import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
// import './CreateNewSpotForm.css';
import {addImages, addSpot, getSpotDetails} from "../../store/spots";
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"




function ManageSpotUpdate() {
const {spotId} = useParams();
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewObj, setPreviewObj] = useState({});  
  const [otherImages, setOtherImages] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false)
 
//   useEffect(() => {
//     if(previewUrl){
//         setPreviewObj({url:{previewUrl}, preview:"true"})
//     } else return 
//   },[previewObj,previewUrl])
useEffect(() => {
    dispatch(getSpotDetails(spotId))
    .then(() => {
        setIsLoaded(true)
    },[dispatch,spotId])
})

const selectedSpot = useSelector(state => state.spots[spotId])

  const history= useHistory(); 
    // console.log(previewObj)

    useEffect(() => {
        if(previewUrl){
            setPreviewObj({url:{previewUrl}, preview: 'true'});
        } else {
            setPreviewObj({url: 'null', preview: 'true'})
        }
    },[setPreviewUrl, previewUrl])
  useEffect(() => {
      const formErrors = {};
      
      if(!country){
          formErrors.country ='Country is required'
        }
        
        if(!address){
            formErrors.address ="Address is required"
        }
        if(!city){
            formErrors.city ='City is required'   
        }
        if(!state) {
            formErrors.state ='State is required'
            return;
        }
        if(!lat) {
            formErrors.lat = 'Latitude is required'   
        }
        if(!lng){    
            formErrors.lng ='Longitude is required'
            
        }
        if(description.length < 30) {
            formErrors.description = 'Description needs a minimum of 30 characters'   
        }
        if(!name){
            formErrors.name = 'Name is required'
            
        } 
        if(!price){
            formErrors.price ='Price is required'
            return;
        }
        if(!previewUrl){
            formErrors.preview ='Preview Image is required'
            
        }
        if(!previewUrl.endsWith('.png') || !previewUrl.endsWith('.jpg') || !previewUrl.endsWith('.jpeg')) {
            formErrors.previewUrl = 'Image URL must end in .png, .jpg or .jpeg'
            return;
        }
        setErrors(formErrors);
    },[country,address,city,state,lat,lng,name,description,previewUrl, price,otherImages])
    


    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setErrors({});
        
        
        
        
        try {
            
            const newSpotInfo = {
                country,
                address,
                city,
                state,
                lat,
                lng,
                name,
                description, 
                price, };
                
               const imageObj = {
                preview: true,
                url: previewUrl
               }

                
                
                // otherImages: otherImages.filter((imageUrl) => imageUrl.trim() !== ''),
            
            // console.log(imageObj,"IMAGEOBJ");
            const newSpot =  await dispatch(addSpot(newSpotInfo))
            .then( (newSpot) => {
                
                dispatch(addImages(newSpot.id, imageObj));
                history.push(`/spots/${newSpot.id}`)
                
            })
            
            
            
            
        }
        
        
        
        catch (errors) {
           if(errors.length){
            setErrors(errors)
           }
        }
        
        setCountry("");
        setAddress("");
        setCity("");
        setState("");
        setLat("");
        setLng("");
        setName("");
        setDescription("");
        setPrice("");
        setPreviewUrl("");
        setOtherImages(["", "", "", ""]);
        setErrors({});
    };
    
    return (
        <div className="outermost-div" >
        
      <div className='create-new-spot-outer-div'>
        <div className='header-div'>
            <h1 className='header-1'>Update your Spot</h1>
            <div className='header-paragraph'>
                <h2>Where's your place loacated?</h2>
                <p className="">Guests will only get your exact address once they booked a reservation</p>
            </div>
        </div>
      <form className="form-start" onSubmit={handleSubmit} >
        <div className= 'outer-form-div'>
        <div className='spot-location-div'>

        <label>
        Country 
          <input
            type="text"
            defaultValue={selectedSpot?.country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="Country"
            />
        </label>
        {errors.country && (<p className='errors'>{errors.country}</p>)}
        <label>
         Street Address
          <input
            type="text"
            defaultValue={selectedSpot?.address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Address"
            />
        </label>
        {errors.address && (<p className="errors">{errors.address}</p>)}
        <label>
         City
          <input
            type="text"
            defaultValue={selectedSpot?.city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="City"
            />
        </label>
        {errors.city && (<p>{errors.city}</p>)}
        <label>
         State
          <input
            type="text"
            defaultValue={selectedSpot?.state}
            onChange={(e) => setState(e.target.value)}
            required
            placeholder="State"
            />
        </label>
        {errors.state && (<p>{errors.state}</p>)}
        <label>
        Latitude
          <input
            
            defaultValue={selectedSpot?.lat}
            onChange={(e) => setLat(e.target.value)}
            required
            placeholder="Latitude"
            />
        </label>
        {errors.lat && (<p>{errors.lat}</p>)}
        <label>
         Longitude
          <input
            
            defaultValue={selectedSpot?.lng}
            onChange={(e) => setLng(e.target.value)}
            required
            placeholder="Longitude"
            />
        </label>
        {errors.lng && (<p>{errors.lng}</p>)}
        </div>
        <div className="description-div">
            <div className='description-header-div'><h2>Describe your place to guests</h2>
            <p>Mention the best features of your space , any special amenities like fast wifi or parking , and what you love about the neighborhood.</p>
            <input
            type = "text"
            defaultValue={selectedSpot?.description}
            onChange = {(e) => setDescription(e.target.value)}
            required
            placeholder="Please write at least 30 characters"></input>
            {errors.description && (<p>{errors.description}</p>)}
            </div>
        </div>
        <div className="title-div">
            <div className='title-header-div'>
                <h2>Create a title for your spot</h2>
                <p>catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input 
                type = 'text'
                defaultValue = {selectedSpot?.name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name of your spot"></input>
                 {errors.name && (<p>{errors.name}</p>)}
            </div>
        </div>
        <div className='price-div'>
            <div className ='price-header-div'>
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <span>$</span><input 
               defaultValue = {selectedSpot?.price}
               onChange={(e) => setPrice(e.target.value)}
               required
               placeholder="price per night (USD)"></input>
                 {errors.price && (<p>{errors.price}</p>)}
            </div>
        </div>
        <div className="image-div">
            <div className="image-header-div">
                <h2>Liven up your spot with photos</h2>
                <p>submit a link to at least one phot to publish your spot</p>
                </div>
                <div>
                <input 
                defaultValue = {selectedSpot?.previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                required
                placeholder="Preview Image URL"></input>
                 {errors.previewUrl && (<p>{errors.preview}</p>)}
            {/* {[1,2,3,4].map((index) => (
                <input 
                key={index}
                placeholder={`Image URL ${index}`}
                value={otherImages[index -1]|| ''}
                onChange = { (e) => {
                    const updatedImages = [...otherImages];
                    updatedImages[index -1] = e.target.value;
                    setOtherImages(updatedImages);
                }}
                />
                
                ))} */}
            </div>
        </div>
        <div className="create-button-div">

       <button className="create-button">Create a Spot</button>
      </div>
        </div>
      </form>
      </div>
      
    </div>
  );
            }

  export default ManageSpotUpdate;