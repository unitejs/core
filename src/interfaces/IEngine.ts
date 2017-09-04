/**
 * Interface for main engine.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

export interface IEngine {
    version(): string;

    initialise(logger: ILogger, fileSystem: IFileSystem): Promise<number>;

    configure(packageName: string | undefined | null,
              title: string | undefined | null,
              license: string | undefined | null,
              sourceLanguage: string | undefined | null,
              moduleType: string | undefined | null,
              bundler: string | undefined | null,
              unitTestRunner: string | undefined | null,
              unitTestFramework: string | undefined | null,
              unitTestEngine: string | undefined | null,
              e2eTestRunner: string | undefined | null,
              e2eTestFramework: string | undefined | null,
              linter: string | undefined | null,
              cssPre: string | undefined | null,
              cssPost: string | undefined | null,
              packageManager: string | undefined | null,
              applicationFramework: string | undefined | null,
              force: boolean | undefined | null,
              outputDirectory: string | undefined | null): Promise<number>;

    clientPackage(operation: string | undefined | null,
                  packageName: string | undefined | null,
                  version: string | undefined | null,
                  preload: boolean | undefined,
                  includeMode: string | undefined | null,
                  scriptIncludeMode: string | undefined | null,
                  main: string | undefined | null,
                  mainMinified: string | undefined | null,
                  testingAdditions: string | undefined | null,
                  isPackage: boolean | undefined,
                  assets: string | undefined | null,
                  map: string | undefined | null,
                  loaders: string | undefined | null,
                  noScript: boolean | undefined,
                  packageManager: string | undefined | null,
                  outputDirectory: string | undefined | null): Promise<number>;

    buildConfiguration(operation: string | undefined | null,
                       configurationName: string | undefined | null,
                       bundle: boolean | undefined,
                       minify: boolean | undefined,
                       sourcemaps: boolean | undefined,
                       outputDirectory: string | undefined | null): Promise<number>;

    platform(operation: string | undefined | null,
             platformName: string | undefined | null,
             outputDirectory: string | undefined | null): Promise<number>;
}
