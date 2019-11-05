import { OpenApiOperation } from './OpenApiOperation';
import { OpenApiParameter } from './OpenApiParameter';
import { OpenApiReference } from './OpenApiReference';
import { OpenApiServer } from './OpenApiServer';

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathItemObject
 */
export interface OpenApiPath {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OpenApiOperation;
    put?: OpenApiOperation;
    post?: OpenApiOperation;
    delete?: OpenApiOperation;
    options?: OpenApiOperation;
    head?: OpenApiOperation;
    patch?: OpenApiOperation;
    trace?: OpenApiOperation;
    servers?: OpenApiServer[];
    parameters?: OpenApiParameter[] | OpenApiReference[];
}