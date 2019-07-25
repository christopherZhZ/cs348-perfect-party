import {genFetcher} from "../utils";

export function listEventtype(callback) {
  genFetcher('/eventType/list')(callback);
}

export function addEventtype(eventtype, callback) {
  const body = JSON.stringify(eventtype);
  genFetcher('/eventtype/add', body)(callback);
}

export function updateEventtype(typeid, eventtype, callback) {
  const body = JSON.stringify({
    typeid,
    ...eventtype,
  });
  genFetcher('/eventtype/update', body)(callback);
}

export function deleteEventtype(typeid, callback) {
  const body = JSON.stringify({ typeid });
  genFetcher('/eventtype/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
