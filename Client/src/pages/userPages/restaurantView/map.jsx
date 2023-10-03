
import React, { useEffect, useRef, useState } from 'react'
import Map, { GeolocateControl, Popup, Layer, Marker, Source } from "react-map-gl";
import LoadingPage from '../../../loading';
import axios from 'axios';
// import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

function MapComponent(props) {
    const [location, setLocation] = useState({})
    const [userLocation, setUserLocation] = useState({})
    const [distance, setDistance] = useState(null)
    const [map, setMap] = useState(null);
    const [reload, setReload] = useState(false)
    // const [popup, setPopup] = useState(null)

    const [isLoading, setIsLoading] = useState(true);

    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not available.");
        }

        if (props?.location) {
            setLocation({
                longitude: props?.location?.longitude,
                latitude: props?.location?.latitude
            });
        }

        setIsLoading(false);

    }, [props, reload]);



    const getDirections = async () => {
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${location.longitude},${location.latitude}.json`,

                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );

            const directionsData = response.data;
            const distance = (directionsData?.routes[0]?.distance) / 1000
            setDistance(distance)

            // Process the directions data and display it on the map
            // You can use the data to draw a route or show turn-by-turn directions
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };




    const showPopUp = async (e) => {
        if (distance === null) {
            await getDirections()
        } else {
            setDistance(null)
        }
        setReload(!reload)
    }



    return (
        <div className="w-full p-10 h-96">
            {isLoading ? (
                <LoadingPage type={'balls'} color={'#4d88ff'} />
            ) : (
                location.longitude && location.latitude && (
                    <div className='shadow-2xl h-full'>
                        <Map
                            ref={(map) => setMap(map)}
                            mapboxAccessToken={accessToken}
                            initialViewState={{
                                longitude: location.longitude,
                                latitude: location.latitude,
                                zoom: 5
                            }}


                            onClick={showPopUp}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            style={{ boxShadow: '0px 1px 10px 1px ', borderRadius: '20px' }}
                        >


                            <GeolocateControl
                                positionOptions={{ enableHighAccuracy: true }}
                                trackUserLocation={true}
                                longitude={userLocation.longitude}
                                latitude={userLocation.latitude}
                                style={{ borderRadius: '20px' }}
                            />
                            <Marker
                                color='red'
                                longitude={location?.longitude}
                                latitude={location?.latitude}
                                onClick={showPopUp}

                            >
                                {distance != null ? (
                                    <div className='bg-white w-full h-full p-2 text-xs'>
                                        <small>Distance:{distance.toFixed(2)}  km</small>
                                    </div>
                                ) : null}
                            </Marker>



                            {/* 
                            <Marker
                                longitude={userLocation.longitude}
                                latitude={userLocation.latitude}
                            /> */}

                        </Map>
                        {/* <button onClick={getDirections} className='bg-red-800 '>Get Directions</button> */}
                    </div>
                )
            )}
        </div>
    )
}
export default MapComponent
