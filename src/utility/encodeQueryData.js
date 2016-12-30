/**
 * EncodeQueryData
 * Usage: EncodeQueryData({id: 1, search: 'key'});
 *
 * @param  Object data  物件資料
 * @return String       e.q. "id=1&search=key"
 */
export default function encodeQueryData(data) {
  return Object.keys(data).map(function(key) {
    return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

/**
 * Get URL Query Data
 * @param  String 'id=1&t=1473175489888'
 * @return Object { id:'1', t:'1473175489888' }
 */
export function getUrlQuery(query=window.location.search.substring(1)) {
  let match,
      pl     = /\+/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
  let urlParams = {};
  while (match = search.exec(query)) urlParams[decode(match[1])] = decode(match[2]);
  return urlParams;
}


export function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

export function randomRocessId() {
  return `${ Date.now() }-${ s4() }${ s4() }`
}
