import {genFetcher} from "../utils";

export function addByList(eventid, itemList, callback) {
  const body = JSON.stringify({
    eventid, itemList
  });
  genFetcher('/itemSelectRecord/addByList', body)(callback);
}

export function deleteByEvent(eventid, callback) {
  const body = JSON.stringify({ eventid });
  genFetcher('/itemSelectRecord/deleteByEvent', body)(callback);
}
