
import "./App.scss";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from 'ol/style';

export const usOutline = new VectorLayer({
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
})

export const statesOutline = new VectorLayer({
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
})

export const congressOutline = new VectorLayer({
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
})

export const countiesOutline = new VectorLayer({
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

export default usOutline