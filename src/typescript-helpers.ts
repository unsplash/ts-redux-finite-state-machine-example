interface TaggedVariant<T extends string, P> {
    type: T;
    payload: P;
}

export const createTaggedVariant = <T extends string, P>(
    type: T,
    payload: P,
): TaggedVariant<T, P> => ({
    type,
    payload,
});
