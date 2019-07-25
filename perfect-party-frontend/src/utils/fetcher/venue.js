import {genFetcher} from "../utils";

export function listVenue(callback) {
  genFetcher('/venue/list')(callback);
}

export function addVenue(venue, callback) {
  const body = JSON.stringify(venue);
  genFetcher('/venue/add', body)(callback);
}

export function updateVenue(venueid, venue, callback) {
  const body = JSON.stringify({
    venueid,
    ...venue,
  });
  genFetcher('/venue/update', body)(callback);
}

export function deleteVenue(venueid, callback) {
  const body = JSON.stringify({ venueid });
  genFetcher('/venue/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
