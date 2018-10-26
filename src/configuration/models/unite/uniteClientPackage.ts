/**
 * Model of Unite Configuration (unite.json) file.
 */
import { IncludeMode } from "./includeMode";
import { ScriptIncludeMode } from "./scriptIncludeMode";
import { UniteClientPackageTranspile } from "./uniteClientPackageTranspile";

export class UniteClientPackage {
    public name: string;
    public version?: string;
    public main?: string;
    public mainMinified?: string;
    public mainLib?: string[];
    public libFile?: string;
    public libExtension?: string;
    public childPackages?: string[];
    public testingAdditions?: { [id: string]: string };
    public preload?: boolean;
    public includeMode?: IncludeMode;
    public scriptIncludeMode?: ScriptIncludeMode;
    public isPackage?: boolean;
    public assets?: string[];
    public map?: { [id: string]: string };
    public loaders?: { [id: string]: string };
    public isModuleLoader?: boolean;
    public noScript?: boolean;
    public transpile?: UniteClientPackageTranspile;
    public hasOverrides?: boolean;
    public isDevDependency?: boolean;
}
