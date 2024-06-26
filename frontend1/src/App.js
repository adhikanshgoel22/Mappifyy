import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Mark from '@mui/icons-material/AddLocationAlt';
import Star from '@mui/icons-material/Star';
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';
import Register from './components/Register';
import Login from './components/Login'; // Correct import

function App() {
  const myStorage=window.localStorage
  const [currentUsername, setCurrentUsername] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // Initialize as false
  const [viewport, setViewport] = useState({
    longitude: 16,
    latitude: 47,
    zoom: 3
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      description,
      rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude
    };
    try {
      const res = await axios.post("http://localhost:8080/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      setTitle("");
      setRating(0);
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude, longitude });
  };

  const handleLogout=()=>{
    myStorage.removeItem("user");
    setCurrentUsername(null);
  }
  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      latitude: lat,
      longitude: lng
    });
  };

  return (
    <div>
      <Map
        mapboxAccessToken="pk.eyJ1Ijoibm9vYmNvZGVyLS02OSIsImEiOiJjbHhucWw2eXYwNXMzMmlzZTJxMWlpYzU3In0.PSqrHeMboZjLykHWNEG3RA"
        initialViewState={viewport}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={(evt) => setViewport(evt.viewState)}
        onDblClick={handleAddClick}
        transitionDuration="2000"
        doubleClickZoom={false} // Disable double click zoom
      >
        {pins.map((p) => (
          <React.Fragment key={p._id}>
            <Marker 
              longitude={p.longitude} 
              latitude={p.latitude} 
              anchor="bottom"
            >
              <Mark
                style={{
                  fontSize: viewport.zoom * 7,
                  color: p.username === currentUsername ? "tomato" : "slateblue",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(p._id, p.latitude, p.longitude)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.longitude}
                latitude={p.latitude}
                closeButton={true}
                closeOnClick={false}
                anchor="top"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Title</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.description}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill().map((_, i) => (
                      <Star key={i} className="star" />
                    ))}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created By <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.longitude}
            latitude={newPlace.latitude}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                  placeholder='Enter a title' 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} 
                />
                <label>Review</label>
                <textarea 
                  placeholder='Tell us something!' 
                  className='review-class'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label>Rating</label>
                <select 
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className='button logout' onClick={handleLogout}>Logout</button>
        ) : (
          <div className='buttons'>
            <button className='button login' onClick={() => setShowLogin(true)}>Login</button>
            <button className='button register' onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register  setShowRegister={setShowRegister}/>}
        {showLogin && <Login  setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername}/>}
      </Map>
    </div>
  );
}

export default App;
