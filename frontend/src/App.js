import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import './index.css'

import SpotDetailPage from "./components/SpotDetailPage";


import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import CreateNewSpotForm from "./components/CreateNewSpotForm";
import MangageSpotsPage from "./components/ManageSpotsPage";
import ManageSpotUpdate from './components/ManageSpotUpdate'
import { getAllSpots } from "./store/spots";
// import NewSpotForm from "./components/NewSpotForm";
// import EditSpotForm from "./components/EditSpotForm";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(getAllSpots());
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // const spotId = 2
  // useEffect(() => {
  //   dispatch(getAllReviews(spotId))
  // },[dispatch])

 

  return (
    <div >
    <Navigation isLoaded= {isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path = '/'>
            <LandingPage />
          </Route>
          <Route path = '/spots/new'>
          <CreateNewSpotForm  />
          </Route>
          <Route path = '/spots/:id'>
          <SpotDetailPage />
          </Route>
          <Route path='/manage-spots'>
            <MangageSpotsPage />
          </Route>
          <Route path ="/spots/:spotId/edit">
            <ManageSpotUpdate/>
          </Route>
          
         
         
    </Switch>
    )}
   </div>
  );
}

export default App;
