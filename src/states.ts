import { GalleryItem } from './types';

export enum StateType {
    Form = 'Form',
    Loading = 'Loading',
    Failed = 'Failed',
    Gallery = 'Gallery',
}

type Form = { type: StateType.Form };
export const form = (): Form => ({ type: StateType.Form });

type Loading = { type: StateType.Loading; query: string };
export const loading = ({ query }: { query: string }): Loading => ({
    type: StateType.Loading,
    query,
});

type Failed = { type: StateType.Failed };
export const failed = (): Failed => ({ type: StateType.Failed });

type Gallery = { type: StateType.Gallery; items: GalleryItem[] };
export const gallery = ({ items }: { items: GalleryItem[] }): Gallery => ({
    type: StateType.Gallery,
    items,
});

export type State = Form | Loading | Failed | Gallery;
