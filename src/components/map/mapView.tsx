import { Map, Overlay } from "ol";
import { useGeographic } from "ol/proj";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { getRequestFromCoordinate } from "../../utils/getRequestFromCoordinate";
import { parseXMLToResultHTML } from "../../utils/parseXMLToResultHTML";
import { useMap } from "../../hooks/useMap";

export const MapView = () => {
	useGeographic();
	const { layer, view } = useMap();

	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<Map | null>(null);
	const [overlay, setOverlay] = useState<Overlay | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const intialMap = new Map({
			target: mapRef.current ?? undefined,
			layers: [layer],
			view: view,
		});

		setMap(intialMap);

		const initialOverlay = new Overlay({
			element: popupRef.current ?? undefined,
			autoPan: {
				animation: {
					duration: 250,
				},
			},
		});
		setOverlay(initialOverlay);

		return () => intialMap.setTarget(undefined);

	}, []);

	const handleClose = useCallback(() => {
		if (overlay) {
			overlay.setPosition(undefined);
		}
		if (popupRef?.current) {
			popupRef.current.getElementsByClassName(
				"popup-content"
			)[0].innerHTML = ``;
		}

		return false;
	}, [overlay]);

	useEffect(() => {
		if (!map || !overlay) return;

		map.addOverlay(overlay);
		map.on("singleclick", function (evt) {
			const coordinate = evt.coordinate;
			const scale =
				(2 * 3.1415926535 * 6378137.0) /
				(256 * (1 << (map.getView().getZoom() ?? 1)));

			const request = getRequestFromCoordinate(coordinate, scale);
			const xhr = new XMLHttpRequest();
			let result = "";
			xhr.open("POST", "http://zs.zulugis.ru:6473/zws", true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					result = parseXMLToResultHTML(xhr.responseText);
					if (popupRef.current) {
						popupRef.current.getElementsByClassName(
							"popup-content"
						)[0].innerHTML = `<div>${result}</div>`;
					}
				}
			};

			xhr.send(request);
			overlay.setPosition(coordinate);
		});


	}, [map, overlay]);

	return (
		<>
			<div
				ref={mapRef}
				style={{ width: "100%", height: "100vh" }}
			/>

			<div
				ref={popupRef}
				className={styles.ol_popup}
			>
				<a
					href='#'
					id='popup-closer'
					className={styles.ol_popup_closer}
					onClick={handleClose}
				></a>
				<div className='popup-content'></div>
			</div>
		</>
	);
};
