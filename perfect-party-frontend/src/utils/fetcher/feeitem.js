import {genFetcher} from "../utils";

export function listPayitemByType(itemtype, callback) {
  const body = JSON.stringify({ itemtype });
  genFetcher('/payitem/listByType', body)(callback);
}

export function addPayitemByType(itemtype, payitem, callback) {
  const body = JSON.stringify({
    itemtype,
    ...payitem,
  });
  genFetcher('/payitem/add', body)(callback);
}

export function updatePayitem(itemid, payitem, callback) {
  const body = JSON.stringify({
    itemid,
    ...payitem,
  });
  genFetcher('/payitem/update', body)(callback);
}

export function deletePayitem(itemid, callback) {
  const body = JSON.stringify({ itemid });
  genFetcher('/payitem/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
