import { message } from "antd/lib/index";

export const STAT_SUCCESS = 'SUCCESS';
export const STAT_FAIL = 'FAIL';

export const PAYITEM_TYPE_LIST = [
  'host','food','decors','entertainment','other'
];

export function isEmptyOrSpaces(str){
  if (typeof(str) !== 'string') return str === undefined || str === null;
  return str === undefined || str === null || str === '' || str.trim() === '';
}

export function upper1st(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseDateStr(dateStr) {
  return dateStr && dateStr.split('T')[0];
}

export function getItemBy(property, val, list) {
  let item = null;
  list.some(i => {
    if (i[property] === val) {
      item = i;
    }
    return i[property] === val;
  });
  return item;
};

export function ObjSetAll(obj, val) {
  return Object.keys(obj).forEach(k => obj[k] = val);
}

export function interceptErr(status, successNext) {
  if (status !== STAT_SUCCESS) {
    message.error(`Internal server error: ${status}`);
  } else {
    successNext();
  }
}

export function genFetcher(url, body) {
  const fetcher = callback => {
    // fetch(`http://localhost:3001${url}`, {
    fetch(`/api${url}`, {
      method: 'POST',
      body,
      headers: {
        "Content-Type": "application/json",
        mode:"no-cors",
      }
    }).then(response => {
      // console.log('response =>',response);// .
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then(callback)
      .catch(err => {
        console.log('[!]caught err: ', err);
      });
  };
  return fetcher;
};

export function requiredRule(title) {
  return [
    {
      required: true,
      message: `Please enter ${title}!`,
    },
  ];
}


const rdonly_types = new Set([
  'offeredtype',
]);
const num_types = new Set([
  'itemprice','numinvitees'
]);
const select_type = new Set([
  'venueName', 'typeName'
]);
export function dataIndexToInputType(dataIndex) {
  if (rdonly_types.has(dataIndex)) return 'rdonly';
  if (num_types.has(dataIndex)) return 'num';
  if (select_type.has(dataIndex)) return 'select';
  return 'text';
}
