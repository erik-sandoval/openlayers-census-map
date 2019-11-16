/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import "./App.scss";
// OpenLayers Imports
import "ol/ol.css";
import React, { useState, useEffect, useRef } from "react";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import { Group } from "ol/layer";
import { OSM } from "ol/source";
import { Zoom, ZoomSlider } from "ol/control";
import LayerSwitcher from "ol-layerswitcher";
import { Style, Fill } from "ol/style";
import { Select } from "ol/interaction";
import axios from "axios";

import {
  usOutline,
  statesOutline,
  congressOutline,
  countiesOutline
} from "./layers";
import "./App.scss";

function App() {
  const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010";
  const baseUrl =
    "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST";

  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const containerRef = useRef();
  const contentRef = useRef();
  const closerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const closer = closerRef.current;

    const selectClick = new Select({
      style: new Style({
        fill: new Fill({
          color: "#3AAED8"
        })
      })
    });

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 100
      }
    });

    // function that's called on x in overlay.
    // sets the overlays position to undefined thus removing overlay from map.
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    const map = new Map({
      target: "map",
      overlays: [overlay],
      controls: [new Zoom(), new ZoomSlider()],
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new Group({
          title: "Census Layers",
          // imported from ./layers
          layers: [usOutline, statesOutline, congressOutline, countiesOutline]
        })
      ],
      view: new View({
        center: [-11159691.474093, 4701565.172793],
        zoom: 5
      })
    });

    // third party library to make a layer legend
    const layerSwitcher = new LayerSwitcher({
      tipLabel: "legend",
      groupSelectStyle: "none"
    });
    map.addControl(layerSwitcher);
    map.addInteraction(selectClick);

    // the select event listens for a feature select
    selectClick.on("select", function(evt) {
      // I am using the coords to set the position of the overlay
      const pixels = evt.mapBrowserEvent.pixel;
      const coords = map.getCoordinateFromPixel(pixels);
      const feature = selectClick.getFeatures();
      // check if the feature exists
      if (feature.array_.length > 0) {
        if (feature.array_[0].values_.NAME) {
          // setting my name state
          setName(feature.array_[0].values_.NAME);
        }
        // lsad shows if it is a congressional district or county
        // since CD only have info for state district I decided to just use state api call
        const lsad = feature.array_[0].values_.LSAD;
        if (lsad === "" || lsad === "CD") {
          const state = feature.array_[0].values_.STATE;
          // api call with dynamic state id
          axios
            .get(`${baseUrl}&for=state:${state}&LAN7&key=${key}`)
            .then(res => {
              // setting response into state to access later on.
              setData(res.data);
            });
        } else if (lsad === "County") {
          // getting feature attributes from geojson file to make api call.
          const state = feature.array_[0].values_.STATE;
          const county = feature.array_[0].values_.COUNTY;
          // api call with dynamic state id and county id
          axios
            .get(`${baseUrl}&for=county:${county}&in=state:${state}&key=${key}`)
            .then(res => {
              // setting response into state to access later on.
              setData(res.data);
            });
        }
      }
      // using the coords I get after getting the pixel location I set my overlay to pop up
      // where I click
      if (evt.selected.length > 0) {
        overlay.setPosition(coords);
      } else {
        overlay.setPosition(undefined);
      }
    });
  }, [setData]);

  // function that returns after census api call
  const DataLoop = () => {
    return (
      <div>
        <h3>{name}</h3>
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Estimate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((censusData, i) =>
              i !== 0 ? (
                <tr key={i}>
                  <td>{censusData[0]}</td> <td>{censusData[2]}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className="App">
      <div id="map"></div>
      <div ref={containerRef} id="popup" className="ol-popup">
        <a
          href="#"
          ref={closerRef}
          id="popup-closer"
          className="ol-popup-closer"
        ></a>
        {/* conditional render if census returns data */}
        <div ref={contentRef} id="popup-content">
          {data ? (
            <div>
              <DataLoop />
            </div>
          ) : (
            "Not enough data for this area to display"
          )}
        </div>
      </div>
      <div className="contact-info">
        <div className="inner-box">
          <h3>Erik Sandoval</h3>
          <a
            href="https://github.com/erik-sandoval/openlayers-census-map"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fab fa-github"></i>Github Repo
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
