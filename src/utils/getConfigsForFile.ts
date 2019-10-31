import * as path from 'path';
import Config from '../types/config/Config';
import NormalizedPath from '../types/NormalizedPath';
import normalizePath from './normalizePath';
import getAllConfigs from './getAllConfigs';

// Returns an array of all the configs that apply to a given file
export default function getConfigsForFile(filePath: NormalizedPath): Config[] {
    return getConfigsForFolder(path.dirname(filePath));
}

export function getConfigsForFolder(dirPath: string): Config[] {
    let allConfigs = getAllConfigs();
    let configsForDir: Config[] = [];

    let pathSegments = normalizePath(dirPath).split(path.sep);
    while (pathSegments.length) {
        let dirPath = pathSegments.join(path.sep);
        if (allConfigs[dirPath]) {
            configsForDir.push(allConfigs[dirPath]);
        }

        pathSegments.pop();
    }

    return configsForDir;

}