"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE_FILE = exports.CONTEXT_FILE = exports.RUNLOG_FILE = exports.PLAN_FILE = exports.SPEC_FILE = exports.CONFIG_FILE = exports.PILOT_DIR = void 0;
exports.getPilotDir = getPilotDir;
exports.getPilotFilePath = getPilotFilePath;
exports.ensurePilotDir = ensurePilotDir;
exports.pilotDirExists = pilotDirExists;
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.initPilotDir = initPilotDir;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const config_js_1 = require("../types/config.js");
exports.PILOT_DIR = '.pilot';
exports.CONFIG_FILE = 'config.json';
exports.SPEC_FILE = 'spec.md';
exports.PLAN_FILE = 'plan.md';
exports.RUNLOG_FILE = 'runlog.md';
exports.CONTEXT_FILE = 'context.md';
exports.STATE_FILE = 'state.json';
function getPilotDir(cwd) {
    return path.join(cwd, exports.PILOT_DIR);
}
function getPilotFilePath(cwd, filename) {
    return path.join(getPilotDir(cwd), filename);
}
async function ensurePilotDir(cwd) {
    const pilotDir = getPilotDir(cwd);
    await fs.mkdir(pilotDir, { recursive: true });
    return pilotDir;
}
async function pilotDirExists(cwd) {
    try {
        const stat = await fs.stat(getPilotDir(cwd));
        return stat.isDirectory();
    }
    catch {
        return false;
    }
}
async function loadConfig(cwd) {
    const configPath = getPilotFilePath(cwd, exports.CONFIG_FILE);
    try {
        const content = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(content);
        return { ...config_js_1.DEFAULT_CONFIG, ...config };
    }
    catch {
        return config_js_1.DEFAULT_CONFIG;
    }
}
async function saveConfig(cwd, config) {
    const pilotDir = await ensurePilotDir(cwd);
    const configPath = path.join(pilotDir, exports.CONFIG_FILE);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
async function initPilotDir(cwd) {
    const pilotDir = await ensurePilotDir(cwd);
    const configPath = path.join(pilotDir, exports.CONFIG_FILE);
    try {
        await fs.access(configPath);
    }
    catch {
        await fs.writeFile(configPath, JSON.stringify(config_js_1.DEFAULT_CONFIG, null, 2), 'utf-8');
    }
    const files = [exports.SPEC_FILE, exports.PLAN_FILE, exports.RUNLOG_FILE, exports.CONTEXT_FILE];
    for (const file of files) {
        const filePath = path.join(pilotDir, file);
        try {
            await fs.access(filePath);
        }
        catch {
            await fs.writeFile(filePath, '', 'utf-8');
        }
    }
    return pilotDir;
}
//# sourceMappingURL=pilot-dir.js.map