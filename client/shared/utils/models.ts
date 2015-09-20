type Resources = any;
type Dictionary = any;
type StringEnum = any;

interface TextValuePair<TValue> {
    text: string;
    value: TValue;
}

type TextPair = TextValuePair<string>;
type TextNumberPair = TextValuePair<number>;

enum SortOrder {
    ascending,
    descending
}
