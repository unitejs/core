/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { ScriptIncludeMode } from "./scriptIncludeMode";
export declare class UniteClientPackage {
    name: string;
    version?: string;
    main?: string;
    mainMinified?: string;
    mainLib?: string[];
    libFile?: string;
    childPackages?: string[];
    testingAdditions?: {
        [id: string]: string;
    };
    preload?: boolean;
    includeMode?: IncludeMode;
    scriptIncludeMode?: ScriptIncludeMode;
    isPackage?: boolean;
    assets?: string[];
    map?: {
        [id: string]: string;
    };
    loaders?: {
        [id: string]: string;
    };
    isModuleLoader?: boolean;
    noScript?: boolean;
    hasOverrides?: boolean;
    isDevDependency?: boolean;
}
