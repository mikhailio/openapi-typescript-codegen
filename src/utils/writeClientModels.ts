import { resolve } from 'path';

import type { Model } from '../client/interfaces/Model';
import type { HttpClient } from '../HttpClient';
import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { formatCode as f } from './formatCode';
import { formatIndentation as i } from './formatIndentation';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useUnionTypes Use union types instead of enums
 * @param indent Indentation options (4, 2 or tab)
 */
export const writeClientModels = async (
    models: Model[],
    templates: Templates,
    outputPath: string,
    httpClient: HttpClient,
    useUnionTypes: boolean,
    indent: Indent
): Promise<void> => {
    for (const model of models) {
        const file = resolve(outputPath, `${model.name}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            httpClient,
            useUnionTypes,
        });
        await writeFile(file, i(f(templateResult), indent));
    }

    await writeFile(
        resolve(outputPath, 'Unauthorized.ts'),
        i(
            templates.core.unauthorizedErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'Forbidden.ts'),
        i(
            templates.core.forbiddenErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'NotFound.ts'),
        i(
            templates.core.notFoundErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'InternalServerError.ts'),
        i(
            templates.core.internalServerErrorErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'BadGateway.ts'),
        i(
            templates.core.badGatewayErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'ServiceUnavailable.ts'),
        i(
            templates.core.serviceUnavailableErrorsModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'NetworkUnknownError.ts'),
        i(
            templates.core.networkUnknownErrorModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'NetworkError.ts'),
        i(
            templates.core.networkErrorModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );

    await writeFile(
        resolve(outputPath, 'BadRequest.ts'),
        i(
            templates.core.badRequestErrorModel({
                httpClient,
                useUnionTypes,
            }),
            indent
        )
    );
};
