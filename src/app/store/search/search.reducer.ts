import {
  Action } from '../Action';
import {
  SearchActions } from './search.actions';
import {
  SelectOption } from '../../shared/types';

import {
  IRestoreSearch } from './IRestoreSearch';

import {
  initSearchData,
  ISearchData,
  searchDataReducer } from './searchData.reducer';

import {
  initSearchOptions,
  ISearchOptions,
  searchOptionsReducer } from './searchOptions.reducer';


export interface ISearchState {
  data?: ISearchData,
  options?: ISearchOptions,
}

export const searchReducer = (state: ISearchState = {}, action: Action): ISearchState => {
  return Object.assign({}, state, {
    data: searchDataReducer(state.data, action),
    options: searchOptionsReducer(state.options, action)
  });
}
