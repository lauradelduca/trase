/* eslint-disable camelcase */
import { getURLFromParams, GET_TOP_NODES_URL } from 'utils/getURLFromParams';

export const EXPLORE__SET_TOP_COUNTRIES = 'EXPLORE__SET_TOP_COUNTRIES';
export const EXPLORE__SET_TOP_EXPORTERS = 'EXPLORE__SET_TOP_EXPORTERS';
export const EXPLORE__SET_TOP_NODES_LOADING = 'EXPLORE__SET_TOP_NODES_LOADING';
export const EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE = 'EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE';

export const getTopNodesKey = (ctx, col, start, end) =>
  ctx && col && start && end ? `CTX${ctx}_COL${col}_START${start}_END${end}` : null;

export const setExploreTopNodes = columnType => (dispatch, getState) => {
  if (!columnType) return null;

  const state = getState();
  const { selectedContext } = state.app;
  let columnId; let type;

  switch (columnType) {
    case 'exporter':
      type = EXPLORE__SET_TOP_EXPORTERS;
      columnId = selectedContext.worldMap.exporterColumnId;
      break;
    case 'country':
      type = EXPLORE__SET_TOP_COUNTRIES;
      columnId = selectedContext.worldMap.countryColumnId;
      break;
    default:
      columnId = null;
      type = null;
      break;
  }

  if (!columnType || !type) {
    console.warn(
      `Column type set to ${columnType} but no matching column id was found on context data.`
    );
    return null;
  }

  const {
    selectedYears: [start_year, end_year]
  } = state.app;
  const { topNodes } = state.explore;
  const params = {
    start_year,
    end_year,
    column_id: columnId,
    context_id: selectedContext.id
  };
  const topNodesKey = getTopNodesKey(selectedContext.id, columnType, start_year, end_year);
  if (!topNodes[topNodesKey]) {
    dispatch({
      type: EXPLORE__SET_TOP_NODES_LOADING,
      payload: { topNodesKey, loading: true }
    });
  }
  const url = getURLFromParams(GET_TOP_NODES_URL, params);
  return (
    !topNodes[topNodesKey] &&
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(res =>
        dispatch({
          type,
          payload: {
            topNodesKey,
            data: res.data,
            country: selectedContext.countryName
          }
        })
      )
      .catch(error => console.error(error))
  );
};

export const setSelectedTableColumnType = columnType => ({
  type: EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE,
  payload: { columnType }
});

export const setExploreTopNodesLoading = loading => ({
  type: EXPLORE__SET_TOP_NODES_LOADING,
  payload: { loading }
});
