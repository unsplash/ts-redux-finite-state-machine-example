import { ofType, unionize, UnionOf } from 'unionize';

import { GalleryItem } from './types';

export const State = unionize({
    Form: ofType<{}>(),
    Loading: ofType<{ query: string }>(),
    Failed: ofType<{}>(),
    Success: ofType<{ items: GalleryItem[] }>(),
});
export type State = UnionOf<typeof State>;
