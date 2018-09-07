import { GalleryItem } from './types';
import { createTaggedVariant } from './typescript-helpers';

export enum ActionType {
    Search = 'Search',
    SearchFailure = 'SearchFailure',
    SearchSuccess = 'SearchSuccess',
}

export const search = ({ query }: { query: string }) =>
    createTaggedVariant(ActionType.Search, {
        query,
    });
type Search = ReturnType<typeof search>;

export const searchFailure = () => createTaggedVariant(ActionType.SearchFailure, {});
type SearchFailure = ReturnType<typeof searchFailure>;

export const searchSuccess = ({ items }: { items: GalleryItem[] }) =>
    createTaggedVariant(ActionType.SearchSuccess, {
        items,
    });
type SearchSuccess = ReturnType<typeof searchSuccess>;

export type Action = Search | SearchFailure | SearchSuccess;
