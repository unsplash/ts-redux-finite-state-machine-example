import { ofType, unionize, UnionOf } from 'unionize';

import { GalleryItem } from './types';

export type SearchAction = { query: string };

export const Action = unionize(
    {
        Search: ofType<SearchAction>(),
        SearchFailure: ofType<{}>(),
        SearchSuccess: ofType<{ items: GalleryItem[] }>(),
    },
    // Tag must be `type` to conform to expected Redux action type.
    { tag: 'type' },
);
export type Action = UnionOf<typeof Action>;
