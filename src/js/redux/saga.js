import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

// Acitons
import * as actionTypes from "./actionTypes";
import * as actions from "./actions";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
  yield takeLatest(actionTypes.API_CALL_REQUEST, searchSaga);
}

// function that makes the api request and returns a Promise for response
function fetchData({q, type, limit}) {
  return axios({
    method: "get",
    url: `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=${limit}`
  });
}

// worker saga: makes the api call when watcher saga sees the action
function* searchSaga(action) {
  try {
    const { data } = yield call(fetchData, action.payload);
    const items = data[action.payload.type + 's'].items;

    // dispatch a success action
    yield put(actions.fetchDataSuccess(items));

  } catch (error) {
    // dispatch a failure action
    yield put(actions.fetchDataFailure(error));
  }
}