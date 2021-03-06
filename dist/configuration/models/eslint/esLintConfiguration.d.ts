/**
 * Model of ESLint Configuration (.eslintrc.json) file.
 */
import { EsLintParserOptions } from "./esLintParserOptions";
export declare class EsLintConfiguration {
    parser: string;
    parserOptions: EsLintParserOptions;
    extends: string[];
    env: {
        [id: string]: boolean;
    };
    globals: {
        [id: string]: boolean;
    };
    rules: {
        [id: string]: any;
    };
    plugins: string[];
    settings: {
        [id: string]: any;
    };
}
