import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Mark from '@mui/icons-material/AddLocationAlt';
import Star from '@mui/icons-material/Star';
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';

function App() {
  const [currentUsername, setCurrentUsername] = useState(localStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [star, setStar] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [viewport, setViewport] = useState({
    longitude: 16,
    latitude:47 ,
    zoom: 14
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

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: latitude, longitude: longitude });
  };

  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoibm9vYmNvZGVyLS02OSIsImEiOiJjbHhucWw2eXYwNXMzMmlzZTJxMWlpYzU3In0.PSqrHeMboZjLykHWNEG3RA"
      initialViewState={viewport}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker longitude={p.longitude} latitude={p.latitude} anchor="bottom" >
            <Mark
              style={{
                fontSize: viewport.zoom * 7,
                color: "slateblue",
                cursor: "pointer"
              }}
              onClick={() => handleMarkerClick(p._id, p.latitude, p.longitude)}
            />
          </Marker>
          {p._id === currentPlaceId && showPopup && (
            <Popup
              longitude={p.longitude}
              latitude={p.latitude}
              anchor="top"
              onClose={() => setShowPopup(false)}
              closeOnClick={false}
            >
              <div className='card'>
                <label>Title</label>
                <h4 className='place'>{p.title}</h4>
                <label>Review</label>
                <p className='desc'>{p.description}</p>
                <label>Rating</label>
                <div className='stars'>
                  {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>Information</label>
                <span className='username'>Created By <b>{p.username}</b></span>
                <span className='date'>{p.createdAt}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
}

export default App;
