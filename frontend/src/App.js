import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getAllSpots } from "./store/spots";
import LandingPage from "./components/LandingPage";
import './index.css'
import { getSpotDetails } from "./store/spots";
import SpotDetailPage from "./components/SpotDetailPage";


import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

 

  return (
    <div >
    <Navigation isLoaded= {isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path = '/'>
            <LandingPage />
          </Route>
          <Route path = '/spots/:id'>
          <SpotDetailPage />
          </Route>
    </Switch>
    )}
   </div>
  );
}

export default App;
