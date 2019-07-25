import {genFetcher} from "../utils";

export function getEvent(eventid, callback) {
  const body = JSON.stringify({ eventid });
  genFetcher('/event/get', body)(callback);
}

export function listEvent(callback) {
  genFetcher('/event/list')(callback);
}

export function listHistorical(callback) {
  genFetcher('/event/listHistorical')(callback);
}

export function listFuture(callback) {
  genFetcher('/event/listFuture')(callback);
}

export function listEventBySupplier(supplierid, callback) {
  const body = JSON.stringify({ supplierid });
  genFetcher('/event/listBySupplier', body)(callback);
}

export function makeHistorical(eventid, callback) {
  const body = JSON.stringify({ eventid });
  genFetcher('/event/makeHistorical', body)(callback);
}

export function addEvent(event, callback) {
  const body = JSON.stringify(event);
  genFetcher('/event/add', body)(callback);
}

export function updateEvent(eventid, event, callback) {
  const body = JSON.stringify({
    eventid,
    ...event,
  });
  genFetcher('/event/update', body)(callback);
}

export function cancelEvent(eventid, callback) {
  const body = JSON.stringify({ eventid });
  genFetcher('/event/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
