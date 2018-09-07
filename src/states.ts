import { GalleryItem } from './types';
import { createTaggedVariant } from './typescript-helpers';

export enum StateType {
    Form = 'Form',
    Loading = 'Loading',
    Failed = 'Failed',
    Gallery = 'Gallery',
}

export const form = () => createTaggedVariant(StateType.Form, {});
type Form = ReturnType<typeof form>;

export const loading = ({ query }: { query: string }) =>
    createTaggedVariant(StateType.Loading, {
        query,
    });
type Loading = ReturnType<typeof loading>;

export const failed = () => createTaggedVariant(StateType.Failed, {});
type Failed = ReturnType<typeof failed>;

export const gallery = ({ items }: { items: GalleryItem[] }) =>
    createTaggedVariant(StateType.Gallery, {
        items,
    });
type Gallery = ReturnType<typeof gallery>;

export type State = Form | Loading | Failed | Gallery;
