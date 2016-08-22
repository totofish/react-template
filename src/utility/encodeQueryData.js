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
