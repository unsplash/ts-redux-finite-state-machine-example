interface TaggedVariant<T extends string, V> {
    type: T;
    value: V;
}

export const createTaggedVariant = <T extends string, V>(
    type: T,
    value: V,
): TaggedVariant<T, V> => ({
    type,
    value,
});
