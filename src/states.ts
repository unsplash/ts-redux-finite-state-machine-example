import { GalleryItem } from './types';
import { createTaggedVariant } from './typescript-helpers';

export enum StateType {
    Form = 'Form',
    Loading = 'Loading',
    Failure = 'Failure',
    Gallery = 'Gallery',
}

export const form = () => createTaggedVariant(StateType.Form, {});
type Form = ReturnType<typeof form>;

export const loading = ({ query }: { query: string }) =>
    createTaggedVariant(StateType.Loading, {
        query,
    });
type Loading = ReturnType<typeof loading>;

export const failure = () => createTaggedVariant(StateType.Failure, {});
type Failure = ReturnType<typeof failure>;

export const gallery = ({ items }: { items: GalleryItem[] }) =>
    createTaggedVariant(StateType.Gallery, {
        items,
    });
type Gallery = ReturnType<typeof gallery>;

export type State = Form | Loading | Failure | Gallery;
