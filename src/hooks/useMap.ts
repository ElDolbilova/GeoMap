import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";

export const useMap = () => {
	const wmsSource = new TileWMS({
		url: "http://zs.zulugis.ru:6473/ws",
		params: { LAYERS: "example:demo", FORMAT: "image/gif" },
		transition: 0,
		crossOrigin: "anonymous",
	});

	const layer = new TileLayer({
		source: wmsSource,
	});

	const view = new View({
		center: [69.581494, 42.321687],
		zoom: 14,
	});

	return {
		wmsSource,
		layer,
		view,
	};
};
