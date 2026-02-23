export declare function readFile(filePath: string): Promise<string>;
export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function dirExists(dirPath: string): Promise<boolean>;
export declare function appendFile(filePath: string, content: string): Promise<void>;
export declare function listFiles(dirPath: string, extensions?: string[]): Promise<string[]>;
export declare function copyFile(src: string, dest: string): Promise<void>;
export declare function deleteFile(filePath: string): Promise<void>;
//# sourceMappingURL=file-ops.d.ts.map