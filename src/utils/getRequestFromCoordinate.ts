import type { Coordinate } from "ol/coordinate";

export const getRequestFromCoordinate = (coordinate:Coordinate, scale:number)=>{
  return  `<?xml version="1.0" encoding="UTF-8"?>
            <zulu-server service='zws' version='1.0.0'>
            <Command><SelectElemByXY>
            <Layer>example:demo</Layer>
            <X>${coordinate[1]}</X>
            <Y>${coordinate[0]}</Y>
            <Scale>${scale}</Scale>
            <CRS>'EPSG:4326'</CRS>
            </SelectElemByXY></Command>
            </zulu-server>`;
}