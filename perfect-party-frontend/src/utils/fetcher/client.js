import {genFetcher} from "../utils";

export function listClient(callback) {
  genFetcher('/client/list')(callback);
}

export function listClientBySearch(criteria, callback) {
  const body = JSON.stringify({
    fname: criteria.fname || null,
    lname: criteria.lname || null,
    email: criteria.email || null,
  });
  genFetcher('/client/listByFname', body)(callback);
}

export function addClient(client, callback) {
  const body = JSON.stringify(client);
  genFetcher('/client/add', body)(callback);
}

export function updateClient(clientid, client, callback) {
  const body = JSON.stringify({
    clientid,
    ...client,
  });
  genFetcher('/client/update', body)(callback);
}

export function deleteClient(clientid, callback) {
  const body = JSON.stringify({ clientid });
  genFetcher('/client/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
