/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, XYZ, TileArcGISRest } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Zoom, MousePosition, ZoomSlider, LayerSwitcher } from 'ol/control';
import { Style, Fill, Stroke } from 'ol/style';
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import { Select } from 'ol/interaction';
import { click, singleClick } from 'ol/events/condition';
import axios from 'axios';


function App() {

  const [map, setMap] = useState(null)
  const layer = { 0: true, 1: true, 2: true, 3: true }
  // const [uslayer, setUSLayer] = useState(true)
  // const [stateLayer, setStateLayer] = useState(true)
  // const [congLayer, setCongLayer] = useState(true)
  // const [countyLayer, setCountyLayer] = useState(true)

  const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010"
  const baseUrl = "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST"

  useEffect(() => {
    const container = document.getElementById("popup");
    const content = document.getElementById("popup-content");
    const closer = document.getElementById("popup-closer");

    const selectClick = new Select({
      condition: singleClick
    });

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    closer.onclick = function () {
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
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "./us_outline.json",
            format: new GeoJSON()
          }),
          style: new Style({
            stroke: new Stroke({
              color: 'red',
            })
          }),
          zIndex: 10
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "./us_states_outline.json",
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: new Fill({
              color: 'orange',
              opacity: .7
            }),
            stroke: new Stroke({
              color: 'white'
            })
          }),
          maxZoom: 6
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "./us_congressional.json",
            format: new GeoJSON()
          }),
          minZoom: 6,
          maxZoom: 8
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "./us_counties.json",
            format: new GeoJSON()
          }),
          minZoom: 8
        })
      ],
      view: new View({
        center: [-11159691.474093, 4701565.172793],
        zoom: 5
      })
    });

    // map.on("singleclick", function (evt) {
    //   const coordinate = evt.coordinate;
    //   // console.log(evt)
    //   const hdms = toStringHDMS(toLonLat(coordinate));
    //   content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
    //   overlay.setPosition(coordinate);

    // });

    map.addInteraction(selectClick)



    map.on('singleclick', function (evt) {
      // console.log(evt.coordinate)
      // console.log(evt.map)
      // if (evt.selected.length > 0) {
      //   if (evt.selected[0].values_.LSAD === "" || evt.selected[0].values_.LSAD === "CD") {

      //     const state = evt.selected[0].values_.STATE
      //     axios.get(`${baseUrl}&for=state:${state}&key=f71397456f83bd9ef4afa2721a6cafb4b3e9d010`).then(res => {
      //       console.log(res.data)
      //     })
      //   } else if (evt.selected[0].values_.LSAD === "County") {
      //     console.log(evt.selected[0].values_)
      //     const state = evt.selected[0].values_.STATE
      //     const county = evt.selected[0].values_.COUNTY

      //     axios.get(`${baseUrl}&for=county:${county}&in=state:${state}&key=f71397456f83bd9ef4afa2721a6cafb4b3e9d010`).then(res => {
      //       console.log(res.data)
      //     })
      //   }
      // }

      // setStateCode(state)

    });

    setMap(map)

  }, []);


  if (map) {
    console.log(map.getLayers().getArray())
  }

  // const toggleLayer = (e) => {

  //   const layers = map.getLayers().getArray()
  //   layers[e.target.value].state_.visible = false
  //   layers[e.target.value].state_.opacity = 0
  //   console.log(!layer[e.target.value])
  //   console.log(layers)
  // }

  const getCensusData = (evt) => {
    // if (evt.selected.length > 0) {
    //   if (evt.selected[0].values_.LSAD === "" || evt.selected[0].values_.LSAD === "CD") {

    //     const state = evt.selected[0].values_.STATE
    //     axios.get(`${baseUrl}&for=state:${state}&key=${key}`).then(res => {
    //       console.log(res.data)
    //     })
    //   } else if (evt.selected[0].values_.LSAD === "County") {
    //     console.log(evt.selected[0].values_)
    //     const state = evt.selected[0].values_.STATE
    //     const county = evt.selected[0].values_.COUNTY

    //     axios.get(`${baseUrl}&for=county:${county}&in=state:${state}&key=${key}`).then(res => {
    //       console.log(res.data)
    //     })
    //   }
    // }
  }

  return (
    <div className='App'>
      <div id='map' >
        {/* <div className="ui-menu">
          <input value="0" type="checkbox" defaultChecked onClick={toggleLayer} />US Outline<br></br>
          <input value="1" type="checkbox" defaultChecked onClick={toggleLayer} />US States Outline<br></br>
          <input value="2" type="checkbox" defaultChecked onClick={toggleLayer} />US Congressional Outline<br></br>
          <input value="3" type="checkbox" defaultChecked onClick={toggleLayer} />US County Outline<br></br>
        </div> */}
      </div>
      <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>

      </div>
    </div>
  );
}

export default App;
