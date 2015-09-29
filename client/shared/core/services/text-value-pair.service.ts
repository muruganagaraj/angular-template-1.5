/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.services {
    export class TextValuePairService {
        public getText<TValue>(pairs: TextValuePair<TValue>[], value: TValue): string {
            if (!pairs || pairs.length === 0) {
                return undefined;
            }
            let match: TextValuePair<TValue> = pairs.find((pair: TextValuePair<TValue>) => pair.value === value);
            return Boolean(match) ? match.text : undefined;
        }

        public getAllTexts<TValue>(pairs: TextValuePair<TValue>[], values: TValue[]): string[] {
            if (!pairs || pairs.length === 0) {
                return [];
            }
            return pairs.reduce((output: string[], pair: TextValuePair<TValue>) => {
                if (values.some((val: TValue) => val === pair.value)) {
                    output.push(pair.text);
                }
                return output;
            }, []);
        }

        public transformToPairs<T>(array: T[], valuePicker: (item: T) => string, textPicker?: (item: T) => string): TextPair[] {
            return (array || []).reduce((results: TextPair[], item: T) => {
                let value: string = valuePicker(item);
                let text: string = Boolean(textPicker) ? textPicker(item) : value;
                if (!results.some((pair: TextPair) => pair.value === value)) {
                    results.push(<TextPair>{
                        text: text,
                        value: value
                    });
                }
                return results;
            }, []);
        }
    }

    sharedModule.service('textValuePairService', TextValuePairService);
}
