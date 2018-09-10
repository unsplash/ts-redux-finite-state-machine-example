import { GalleryItem } from './types';

export enum ActionType {
    Search = 'Search',
    SearchFailure = 'SearchFailure',
    SearchSuccess = 'SearchSuccess',
}

type Search = { type: ActionType.Search; query: string };
export const search = ({ query }: { query: string }): Search => ({
    type: ActionType.Search,
    query,
});

type SearchFailure = { type: ActionType.SearchFailure };
export const searchFailure = (): SearchFailure => ({ type: ActionType.SearchFailure });

type SearchSuccess = { type: ActionType.SearchSuccess; items: GalleryItem[] };
export const searchSuccess = ({ items }: { items: GalleryItem[] }): SearchSuccess => ({
    type: ActionType.SearchSuccess,
    items,
});

export type Action = Search | SearchFailure | SearchSuccess;
