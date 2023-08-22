import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getAllSpots } from "./store/spots";


import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(()=> {
    dispatch(getAllSpots())
  },[]);

  return (
    <>
    <Navigation isLoaded= {isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path = '/'>
            <h1>home page</h1>
          </Route>
    </Switch>
    )}
   </>
  );
}

export default App;
