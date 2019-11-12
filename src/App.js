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
import { LZoom, MousePosition } from 'ol/control';
import { Style, Fill, Stroke } from 'ol/style';
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import { Select } from 'ol/interaction';
import { click, singleClick } from 'ol/events/condition';
import axios from 'axios';


function App() {

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
      controls: [new Zoom(), new MousePosition()],
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        // new VectorLayer({
        //   source: new VectorSource({
        //     url: "./us_outline.json",
        //     format: new GeoJSON()
        //   })
        // }),
        new VectorLayer({
          source: new VectorSource({
            url: "./us_states_outline.json",
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: new Fill({
              color: 'orange'
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

    selectClick.on('select', function (evt) {
      console.log(evt)
      if (evt.selected.length > 0) {
        if (evt.selected[0].values_.LSAD === "" || evt.selected[0].values_.LSAD === "CD") {

          const state = evt.selected[0].values_.STATE
          axios.get(`https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST&for=state:${state}&key=f71397456f83bd9ef4afa2721a6cafb4b3e9d010`).then(res => {
            console.log(res.data)
          })
        } else if (evt.selected[0].values_.LSAD === "County") {
          console.log(evt.selected[0].values_)
          const state = evt.selected[0].values_.STATE
          const county = evt.selected[0].values_.COUNTY

          axios.get(`https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST&for=county:${county}&in=state:${state}&key=f71397456f83bd9ef4afa2721a6cafb4b3e9d010`).then(res => {
            console.log(res.data)
          })
        }
      }

      // setStateCode(state)
    });


  }, []);

  return (
    <div className='App'>
      <div id='map' ></div>
      <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  );
}

export default App;
