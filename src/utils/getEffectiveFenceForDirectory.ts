import RawConfig from "../types/rawConfig/RawConfig";
import { getConfigsForFolder } from "./getConfigsForFile";
import { posix } from "path";

// We don't want to introduce Windows-style paths into the JSON
const { resolve, relative, dirname } = posix;

export default function getEffectiveFenceForDirectory(
  dirPath: string
): RawConfig {
  const collectedConfigs = getConfigsForFolder(dirPath);

  return {
    tags: [
      ...new Set<string>(flattenArray(collectedConfigs.map(({ tags }) => tags)))
    ],
    exports: flattenArray(
      collectedConfigs.map(({ exports, path }) =>
        exports
          .map(({ modules, accessibleTo }) => ({
            modules: relative(dirPath, resolve(dirname(path), modules)),
            accessibleTo
          }))
          .filter(({ modules }) => !/^\.\./.test(modules))
      )
    ),
    dependencies: flattenArray(collectedConfigs.map(({ dependencies }) => dependencies)),
    imports:  flattenArray(
        collectedConfigs.map(({ imports, path }) =>
        imports
            .map(importDependency => /^\./.test(importDependency) ? relative(dirPath, resolve(dirname(path), importDependency)) : importDependency)
        )
      ),
  };
}

// This function can be replaced by Array.prototype.flatten() once Node v12 is the minimum supported version
function flattenArray<T>(array: T[][]): T[] {
  return array.reduce((acc, entry) => acc.concat(...entry), [] as T[]);
}
