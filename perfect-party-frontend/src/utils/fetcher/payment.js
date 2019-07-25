import {genFetcher} from "../utils";

export function listPayment(callback) {
  genFetcher('/payment/list')(callback);
}

// -------- callback usage: function(data) => {...} --------
