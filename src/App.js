/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import { Group } from 'ol/layer'
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Zoom, ZoomSlider } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher'
import { Style, Fill, Stroke } from 'ol/style';

import { Select } from 'ol/interaction';

import axios from 'axios';



function App() {

  const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010"
  const baseUrl = "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST"

  const [data, setData] = useState(null)
  const [name, setName] = useState("")
  const containerRef = useRef()
  const contentRef = useRef()
  const closerRef = useRef()

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    const closer = closerRef.current

    const selectClick = new Select({
      style: new Style({
        fill: new Fill({
          color: '#3AAED8'
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
        new Group({
          title: 'Census Layers',
          layers: [
            new VectorLayer({
              title: 'United States',
              source: new VectorSource({
                url: "./us_outline.json",
                format: new GeoJSON()
              }),
              style: new Style({
                stroke: new Stroke({
                  color: 'black',
                  width: 2
                })
              }),
              zIndex: 10
            }),
            new VectorLayer({
              title: "US States",
              opacity: .7,
              source: new VectorSource({
                url: "./us_states_outline.json",
                format: new GeoJSON(),
              }),
              style: new Style({
                fill: new Fill({
                  color: 'orange',
                }),
                stroke: new Stroke({
                  color: '#B0FF92'
                })
              }),
              maxZoom: 6
            }),
            new VectorLayer({
              title: "US Congressional",
              source: new VectorSource({
                url: "./us_congressional.json",
                format: new GeoJSON()
              }),
              minZoom: 6,
              maxZoom: 8,
              style: new Style({
                fill: new Fill({
                  color: "purple"
                }),
                stroke: new Stroke({
                  color: 'orange',
                  width: 3
                })
              }),
              opacity: .7,
            }),
            new VectorLayer({
              title: "US Counties",
              source: new VectorSource({
                url: "./us_counties.json",
                format: new GeoJSON()
              }),
              style: new Style({
                fill: new Fill({
                  color: "red"
                }),
                stroke: new Stroke({
                  color: 'white',
                  width: 3
                })
              }),
              opacity: .7,
              minZoom: 8
            })
          ]
        })],
      view: new View({
        center: [-11159691.474093, 4701565.172793],
        zoom: 5
      })
    });

    const layerSwitcher = new LayerSwitcher({
      tipLabel: 'legend',
      groupSelectStyle: 'none',
    });

    map.addControl(layerSwitcher);
    map.addInteraction(selectClick)

    selectClick.on('select', function (evt) {
      // content.innerText = ""
      const pixels = evt.mapBrowserEvent.pixel
      const coords = map.getCoordinateFromPixel(pixels)
      const feature = selectClick.getFeatures()
      if (feature.array_.length > 0) {
        if (feature.array_[0].values_.NAME) {
          setName(feature.array_[0].values_.NAME)
        }
        const lsad = feature.array_[0].values_.LSAD
        if (lsad === "" || lsad === "CD") {
          const state = feature.array_[0].values_.STATE
          axios.get(`${baseUrl}&for=state:${state}&key=${key}`).then(res => {
            setData(res.data)
          })
        } else if (lsad === "County") {
          const state = feature.array_[0].values_.STATE
          const county = feature.array_[0].values_.COUNTY
          axios.get(`${baseUrl}&for=county:${county}&in=state:${state}&key=${key}`).then(res => {
            setData(res.data)
          })
        }
      }
      overlay.setPosition(coords)
    })

  }, [setData]);


  const DataLoop = () => {
    return <div>
      <h3>{name}</h3>
      <table>
        <tr>
          <th>Language</th>
          <th>Estimate</th>
        </tr>
        {data.map((censusData, i) => (

          i !== 0 ? <tr><td>{censusData[0]}</td> <td>{censusData[2]}</td></tr> : null

        ))}
      </table>
    </div>
  }
  return (
    <div className='App'>
      <div id='map' >
      </div>
      <div ref={containerRef} id="popup" className="ol-popup">
        <a href="#" ref={closerRef} id="popup-closer" className="ol-popup-closer"></a>
        <div ref={contentRef} id="popup-content">{data ? <div><DataLoop /></div> : "Not enough data for this area to display"}</div>
      </div>
      <div className="contact-info">
        <div className="inner-box">
          <h3>Erik Sandoval</h3>
          <a href="https://github.com/erik-sandoval/arcgis-census-map" rel="noopener noreferrer" target="_blank"><i class="fab fa-github"></i>Github Repo</a>
        </div>
      </div>
    </div>
  );
}

export default App;
