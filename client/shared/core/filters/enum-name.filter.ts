/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.filters {
    sharedModule.filter('enumName', () => {
        let cache: Dictionary = {};

        function getEnumObject(enumTypeName: string): any {
            let enumObject: any = cache[enumTypeName];
            if (!enumObject) {
                let parts: string[] = enumTypeName.split('.');
                enumObject = parts.reduce((accumulate: any, part: string): any => accumulate[part], this);
                cache[enumTypeName] = enumObject;
            }
            return enumObject;
        }

        return (enumValue: any, enumTypeName: string): string => {
            let enumObject: any = getEnumObject(enumTypeName);
            return enumObject[enumValue];
        };
    });
}
