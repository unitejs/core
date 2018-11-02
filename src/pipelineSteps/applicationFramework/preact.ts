/**
 * Pipeline step to generate scaffolding for Preact application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { TsLintConfiguration } from "../../configuration/models/tslint/tsLintConfiguration";
import { TypeDocConfiguration } from "../../configuration/models/typeDoc/typeDocConfiguration";
import { TypeScriptConfiguration } from "../../configuration/models/typeScript/typeScriptConfiguration";
import { UniteClientPackage } from "../../configuration/models/unite/uniteClientPackage";
import { UniteClientPackageTranspile } from "../../configuration/models/unite/uniteClientPackageTranspile";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UnitePackageRouteConfiguration } from "../../configuration/models/unitePackages/unitePackageRouteConfiguration";
import { JavaScriptConfiguration } from "../../configuration/models/vscode/javaScriptConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { TemplateHelper } from "../../helpers/templateHelper";
import { IApplicationFramework } from "../../interfaces/IApplicationFramework";
import { SharedAppFramework } from "../sharedAppFramework";

export class Preact extends SharedAppFramework implements IApplicationFramework {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.applicationFramework, "Preact");
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);

            ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "tsx",
                                  super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

            ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "jsx",
                                  super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        }

        return 0;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(
            [
                "@babel/plugin-transform-react-jsx",
                "@babel/plugin-proposal-decorators",
                "@babel/plugin-proposal-class-properties"
            ],
            mainCondition && super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));
        engineVariables.toggleDevDependency(["eslint-plugin-react", "babel-eslint"], mainCondition && super.condition(uniteConfiguration.linter, "ESLint"));

        engineVariables.toggleDevDependency(["unitejs-protractor-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));
        engineVariables.toggleDevDependency(["unitejs-webdriver-plugin"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        const isTranspiled = super.condition(uniteConfiguration.moduleType, "AMD") || super.condition(uniteConfiguration.moduleType, "SystemJS");
        const preactPackage: UniteClientPackage = {
            name: "preact",
            main: "dist/preact.dev.js",
            mainMinified: "dist/preact.min.js"
        };

        const preactRouterPackage: UniteClientPackage = {
            name: "preact-router",
            main: "dist/preact-router.js",
            mainMinified: "dist/preact-router.js"
        };

        if (isTranspiled) {
            preactPackage.main = "dist/preact.js";
            preactPackage.mainMinified = undefined;
            preactPackage.transpile = new UniteClientPackageTranspile();
            preactPackage.transpile.alias = "preact-transpiled";
            preactPackage.transpile.language = "JavaScript";
            preactPackage.transpile.sources = ["dist/preact.mjs"];

            preactRouterPackage.main = "dist/preact-router.es.js";
            preactRouterPackage.mainMinified = undefined;
            preactRouterPackage.transpile = new UniteClientPackageTranspile();
            preactRouterPackage.transpile.alias = "preact-router-transpiled";
            preactRouterPackage.transpile.language = "JavaScript";
            preactRouterPackage.transpile.sources = ["dist/preact-router.es.js"];
        }

        engineVariables.toggleClientPackage("preact", preactPackage, mainCondition);
        engineVariables.toggleClientPackage("preact-router", preactRouterPackage, mainCondition);

        engineVariables.toggleClientPackage("require-css", {
            name: "require-css",
            main: "css.js",
            map: { css: "require-css" }
        },
                                            mainCondition && super.condition(uniteConfiguration.bundler, "RequireJS"));

        engineVariables.toggleClientPackage("systemjs-plugin-css", {
            name: "systemjs-plugin-css",
            main: "css.js",
            map: { css: "systemjs-plugin-css" },
            loaders: { "*.css": "css" }
        },
                                            mainCondition &&
            (super.condition(uniteConfiguration.bundler, "Browserify") ||
                super.condition(uniteConfiguration.bundler, "SystemJSBuilder") ||
                super.condition(uniteConfiguration.bundler, "Webpack")));

        if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp") && super.condition(uniteConfiguration.bundler, "RequireJS")) {
            super.createLoaderTypeMapReplacement(engineVariables, "css", "css");
        }

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration, "parser", "babel-eslint", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.parserOptions.ecmaFeatures, "jsx", true, mainCondition);
            ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", mainCondition);
            ArrayHelper.addRemove(esLintConfiguration.plugins, "react", mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
            ObjectHelper.addRemove(esLintConfiguration.settings, "react", { pragma: "h" }, mainCondition);
        }

        const tsLintConfiguration = engineVariables.getConfiguration<TsLintConfiguration>("TSLint");
        if (tsLintConfiguration) {
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
            ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
        }

        const babelConfiguration = engineVariables.getConfiguration<BabelConfiguration>("Babel");
        if (babelConfiguration) {
            ArrayHelper.addRemove(babelConfiguration.plugins, ["@babel/plugin-proposal-decorators", { legacy: true }], mainCondition,
                                  (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
            ArrayHelper.addRemove(babelConfiguration.plugins, ["@babel/plugin-proposal-class-properties", { loose: true }], mainCondition,
                                  (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
            ArrayHelper.addRemove(babelConfiguration.plugins, ["@babel/plugin-transform-react-jsx", { pragma: "h" }], mainCondition,
                                  (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.package, "unitejs-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-webdriver-plugin", mainCondition);
        }

        const typeScriptConfiguration = engineVariables.getConfiguration<TypeScriptConfiguration>("TypeScript");
        if (typeScriptConfiguration) {
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsxFactory", "h", mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "esModuleInterop", true, mainCondition);
        }

        const javaScriptConfiguration = engineVariables.getConfiguration<JavaScriptConfiguration>("JavaScript");
        if (javaScriptConfiguration) {
            ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
        }

        const typeDocConfiguration = engineVariables.getConfiguration<TypeDocConfiguration>("TypeDoc");
        if (typeDocConfiguration) {
            ObjectHelper.addRemove(typeDocConfiguration, "jsx", "react", mainCondition);
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";

            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                `app${sourceExtension}x`,
                `child/child${sourceExtension}x`,
                `bootstrapper${sourceExtension}`
            ],
                                                   false);

            if (ret === 0) {
                ret = await super.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, [`child/child`]);
            }

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
            }

            if (ret === 0) {
                ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
            }

            return ret;
        } else {
            return 0;
        }
    }

    public async insertRoutes(logger: ILogger,
                              fileSystem: IFileSystem,
                              uniteConfiguration: UniteConfiguration,
                              engineVariables: EngineVariables,
                              routes: { [id: string]: UnitePackageRouteConfiguration }): Promise<number> {
        const sourceExtension = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? ".tsx" : ".jsx";
        const bracketSpacing = super.condition(uniteConfiguration.sourceLanguage, "TypeScript") ? " " : "";

        let routerItems: string[] = [];
        const importItems: string[] = [];
        const routeItems: string[] = [];
        let navigationLinks: string[] = [];

        const keys = Object.keys(routes || {});
        for (let i = 0; i < keys.length; i++) {
            const route = routes[keys[i]];

            const words = TemplateHelper.generateWords(route.moduleType);
            const human = TemplateHelper.createHuman(words);

            importItems.push(`import {${bracketSpacing}${route.moduleType}${bracketSpacing}} from "${route.modulePath}";`);
            routerItems.push(`<${route.moduleType} path={basePath + "${keys[i]}"} />`);
            routeItems.push(`/${keys[i]}`);
            navigationLinks.push(`&nbsp;<Link href={basePath + "${keys[i]}"}>${human}</Link>`);
        }

        const remainingInserts: { [id: string]: string[] } = {};

        const ret = await super.insertContent(logger,
                                              fileSystem,
                                              engineVariables,
                                              `app${sourceExtension}`,
                                              (srcContent) => {
                let content = srcContent;

                const importsRemaining = super.insertReplaceImports(content, importItems);
                content = importsRemaining.content;
                remainingInserts.imports = importsRemaining.remaining;

                const routerRegEx = /(<Router.*>)(\s*)([\s|\S]*?)((\s*)<\/Router>)/;
                const routerResults = routerRegEx.exec(content);
                if (routerResults && routerResults.length > 4) {
                    const currentRouters = routerResults[3].trim();

                    routerItems = routerItems.filter(ri => currentRouters.replace(/\s/g, "")
                                                                         .indexOf(ri.replace(/\s/g, "")) < 0);

                    if (routerItems.length > 0) {
                        const routerStart = routerResults[1];
                        const routerNewline = routerResults[2];
                        const routerEnd = routerResults[4];

                        let replaceRouters = `${routerNewline}${currentRouters}${routerNewline}`;
                        replaceRouters += `${routerItems.map(ri => ri.replace(/\n/g, routerNewline))
                                                                     .join(`${routerNewline}`)}`;
                        content = content.replace(routerResults[0], `${routerStart}${replaceRouters}${routerEnd}`);
                    }
                } else {
                    remainingInserts.router = routerItems;
                }

                const navigationRegEx = /(<nav.*>)(\s*)([\s|\S]*?)((\s*)<\/nav>)/;
                const navigationResults = navigationRegEx.exec(content);
                if (navigationResults && navigationResults.length > 4) {
                    const currentLinks = navigationResults[3].trim();

                    navigationLinks = navigationLinks.filter(ri => currentLinks.replace(/\s/g, "")
                                                                               .indexOf(ri.replace(/\s/g, "")) < 0);

                    if (navigationLinks.length > 0) {
                        const navigationStart = navigationResults[1];
                        const navigationNewline = navigationResults[2];
                        const navigationEnd = navigationResults[4];

                        let replaceRouters = `${navigationNewline}${currentLinks}${navigationNewline}`;
                        replaceRouters += `${navigationLinks.map(ri => ri.replace(/\n/g, navigationNewline))
                                                                         .join(`${navigationNewline}`)}`;
                        content = content.replace(navigationResults[0], `${navigationStart}${replaceRouters}${navigationEnd}`);
                    }
                } else {
                    remainingInserts.navigationLinks = navigationLinks;
                }

                return content;
            });

        if (ret === 0) {
            super.insertCompletion(logger, remainingInserts, routeItems);
        }

        return ret;
    }
}
