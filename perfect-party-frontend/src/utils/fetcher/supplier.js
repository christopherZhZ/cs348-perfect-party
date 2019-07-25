import {genFetcher} from "../utils";

export function listSupplier(callback) {
  genFetcher('/supplier/list')(callback);
}

export function listSupplierByType(offeredtype, callback) {
  const body = JSON.stringify({
    offeredtype,
    name: null
  });
  genFetcher('/supplier/listBySearch', body)(callback);
}

export function addSupplier(supplier, callback) {
  const body = JSON.stringify(supplier);
  genFetcher('/supplier/add', body)(callback);
}

export function updateSupplier(supplierid, supplier, callback) {
  const body = JSON.stringify({
    supplierid,
    ...supplier,
  });
  genFetcher('/supplier/update', body)(callback);
}

export function deleteSupplier(supplierid, callback) {
  const body = JSON.stringify({ supplierid });
  genFetcher('/supplier/delete', body)(callback);
}

// -------- callback: function(data) => {...} --------
