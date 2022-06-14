import type { Model } from '../../../client/interfaces/Model';
import type { OperationResponse } from '../../../client/interfaces/OperationResponse';

const areEqual = (a: Model, b: Model): boolean => {
    const equal = a.type === b.type && a.base === b.base && a.template === b.template;
    if (equal && a.link && b.link) {
        return areEqual(a.link, b.link);
    }
    return equal;
};

const defaultErrorCodes = {
    400: 'BadRequest',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'NotFound',
    500: 'InternalServerError',
    502: 'BadGateway',
    503: 'ServiceUnavailable',
    0: 'NetworkUnknownError',
    1: 'NetworkError',
};

const getErrorOperation = (error: number, type: string): OperationResponse => ({
    in: 'response',
    name: '',
    code: error,
    description: null,
    export: 'reference',
    type: type,
    base: type,
    template: null,
    link: null,
    isDefinition: false,
    isReadOnly: false,
    isRequired: false,
    isNullable: false,
    imports: [type],
    enum: [],
    enums: [],
    properties: [],
});

export const getOperationResults = (operationResponses: OperationResponse[]): OperationResponse[] => {
    const operationResults: OperationResponse[] = [];

    // Filter out success response codes, but skip "204 No Content"
    operationResponses.forEach(operationResponse => {
        const { code } = operationResponse;

        if ((code && code !== 204 && code >= 200 && code < 300) || code === 400) {
            operationResults.push(operationResponse);
        }

        if (operationResults.length) {
            const errorOperations = (
                Object.keys(defaultErrorCodes) as unknown as Array<keyof typeof defaultErrorCodes>
            ).map(errorStatus => getErrorOperation(errorStatus, defaultErrorCodes[errorStatus]));

            operationResults.push(...errorOperations);
        }
    });

    if (!operationResults.length) {
        operationResults.push({
            in: 'response',
            name: '',
            code: 200,
            description: '',
            export: 'generic',
            type: 'void',
            base: 'void',
            template: null,
            link: null,
            isDefinition: false,
            isReadOnly: false,
            isRequired: false,
            isNullable: false,
            imports: [],
            enum: [],
            enums: [],
            properties: [],
        });
    }

    return operationResults.filter((operationResult, index, arr) => {
        return (
            arr.findIndex(item => {
                return areEqual(item, operationResult);
            }) === index
        );
    });
};
