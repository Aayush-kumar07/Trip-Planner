import React, { useState, useEffect } from "react";
import Loader from "./Loader";

// Home component which contain the city and destination input and search button
function Home() {
  const [city, setCity] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response1, setResponse] = useState([]); // State for storing response

  //Function to fetch all the cities from the api using fetch api post method.
  const fetchCities = async (country) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: country,
          }),
        }
      );
      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  // It is use to manage side effect by passing the country name in the function to fetch the cities of a particular country.
  useEffect(() => {
    const getCities = async () => {
      const countries = ["India", "Thailand", "switzerland"]; // country names
      let allCities = [];

      for (let country of countries) {
        const countryCities = await fetchCities(country);
        allCities = allCities.concat(countryCities);
      }

      setCities(allCities);
    };
    // Calling the function
    getCities();
  }, []);

  //Performing Post method using fetch api to send the city name and destination to the backend for processing.
  const handleSubmit = async () => {
    setResponse([]); // Clear previous response
    setLoading(true);
    console.log("City:", city);
    console.log("Destination Type:", destinationType);
    let val = { city, destinationType };
    try {
      const response = await fetch("http://localhost:8000/api/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(val),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      const data=await JSON.parse(res)
      console.log(data);
      setResponse(data);
      console.log(response1)
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop the loader after fetching data
    }
  };
  // Writing JSX to render the HTML components

  return (
    <div className="Box">
      <h1>Plan your next adventure</h1>
      <div className="container">
        <div className="form-group">
          {/* First input tag */}
          <input
            type="text"
            list="cities"
            placeholder="Select city"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
          />
          <datalist id="cities">
            {cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          {/* Second input tag */}
          <textarea
            rows={5}
            value={destinationType}
            onChange={(e) => setDestinationType(e.target.value)}
            placeholder="What are you looking for..."
            style={{"width": "500px", "resize": "none"}}
          ></textarea>
        </div>
        <button onClick={handleSubmit}>Search</button>
      </div>
      {loading && <Loader />}
      {/* This will render the response in the UI -> */}
      {response1.length > 0 && (
        <div id="resp">
          {response1.map((item, index) => (
            <div key={index}>
              <p><strong>{`${index + 1}. ${item.name}`}</strong></p>
              <ul>
                <li><strong>Description:</strong> {item.description}</li>
                <li><strong>Address:</strong> {item.address}</li>
                <li><strong>Timing:</strong> {item.timing}</li>
                <li><strong>Speciality:</strong> {item.speciality}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
