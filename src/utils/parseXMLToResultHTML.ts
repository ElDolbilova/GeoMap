import { xml2json } from "xml-js";

export const parseXMLToResultHTML = (xmlStr: string) => {
	let result = "";
	const rr = JSON.parse(
		xml2json(xmlStr, {
			compact: true,
			ignoreDeclaration: true,
		})
	);
	if (rr.zwsResponse.ErrorString) {
		result = `${rr.zwsResponse.ErrorString["_text"]}`;
	} else {
		const fields = rr.zwsResponse.SelectElemByXY.Element.Records.Record.Field;
		result = `<p><strong>${rr.zwsResponse.SelectElemByXY.Element.ElemID["_text"]}</strong></p>`;
		for (let i = 0; i < fields.length; i++) {
			result += `<div><strong>${fields[i].UserName["_text"]}</strong> - ${
				fields[i].Value["_text"] ?? " "
			}</div>`;
		}
	}
	return result;
};
