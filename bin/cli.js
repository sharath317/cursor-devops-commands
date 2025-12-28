#!/usr/bin/env node

/**
 * cursor-devops-commands CLI
 * DevOps & Git Commands for Cursor IDE
 * Security, Deployment, Git Operations
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '1.0.1';
const CURSOR_DIR = '.cursor';
const COMMANDS_DIR = 'commands';

const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`  ${colors.dim}→${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
};

const BUNDLES = {
    minimal: {
        name: 'Minimal (Git Only)',
        description: 'Essential git and repo management',
        commands: ['git'],
        count: 4,
    },
    standard: {
        name: 'Standard (Git + Security)',
        description: 'Git operations with security audits',
        commands: ['git', 'security'],
        count: 7,
    },
    complete: {
        name: 'Complete (All DevOps)',
        description: 'Full DevOps suite including deployment',
        commands: ['git', 'security', 'deployment'],
        count: 10,
    },
};

function prompt(question, defaultValue = '') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const defaultText = defaultValue ? ` (${defaultValue})` : '';

    return new Promise((resolve) => {
        rl.question(`${question}${defaultText}: `, (answer) => {
            rl.close();
            resolve(answer || defaultValue);
        });
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyCommands(sourceDir, targetDir, categories) {
    let copiedCount = 0;

    categories.forEach((category) => {
        const srcCategoryDir = path.join(sourceDir, category);

        if (fs.existsSync(srcCategoryDir)) {
            const files = fs.readdirSync(srcCategoryDir).filter((f) => f.endsWith('.md'));

            files.forEach((file) => {
                const srcFile = path.join(srcCategoryDir, file);
                const tgtFile = path.join(targetDir, file);

                if (!fs.existsSync(tgtFile)) {
                    fs.copyFileSync(srcFile, tgtFile);
                    log.step(`Installed: ${file}`);
                    copiedCount++;
                } else {
                    log.step(`Exists: ${file} (skipped)`);
                }
            });
        }
    });

    return copiedCount;
}

async function init(flags = {}) {
    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 CURSOR DEVOPS COMMANDS v${VERSION}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
DevOps: Git Operations, Security & Deployment

`);

    const projectDir = process.cwd();
    const cursorDir = path.join(projectDir, CURSOR_DIR);
    const commandsDir = path.join(cursorDir, COMMANDS_DIR);

    log.header('📦 Select Command Bundle');

    Object.entries(BUNDLES).forEach(([key, bundle], idx) => {
        console.log(`  ${idx + 1}. ${colors.bold}${bundle.name}${colors.reset}`);
        console.log(`     ${bundle.description} (${bundle.count} commands)\n`);
    });

    let selectedBundle = 'complete';
    if (!flags.bundle && !flags.yes) {
        const bundleAnswer = await prompt('Select bundle (1-3)', '3');
        selectedBundle = Object.keys(BUNDLES)[parseInt(bundleAnswer, 10) - 1] || 'complete';
    } else if (flags.bundle) {
        selectedBundle = flags.bundle;
    }

    const bundle = BUNDLES[selectedBundle];
    log.success(`Selected: ${bundle.name}`);

    log.header('📥 Installing Commands');

    ensureDir(commandsDir);

    const packageDir = path.dirname(__dirname);
    const packageCommandsDir = path.join(packageDir, 'commands');

    const copiedCount = copyCommands(packageCommandsDir, commandsDir, bundle.commands);

    console.log(`
${colors.bold}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ INSTALLATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Commands installed:${colors.reset} ${copiedCount}
${colors.cyan}Location:${colors.reset}          ${commandsDir}

${colors.bold}Commands Reference:${colors.reset}

  ${colors.cyan}🔀 Git${colors.reset}
  /auto-rebase        Rebase feature branch with conflict resolution
  /suggest-reviewers  Smart reviewer suggestions
  /find-shared        Find shared code dependencies
  /decision-record    Create architecture decision records

  ${colors.cyan}🔒 Security${colors.reset}
  /security-audit     Run security analysis
  /rollback-impact    Assess rollback risk

  ${colors.cyan}🚀 Deployment${colors.reset}
  /post-deploy-check  Post-deployment verification
  /metrics-report     Generate metrics dashboard

${colors.dim}Documentation: https://github.com/sharath317/cursor-devops-commands${colors.reset}
`);
}

async function status() {
    const projectDir = process.cwd();
    const commandsDir = path.join(projectDir, CURSOR_DIR, COMMANDS_DIR);

    if (!fs.existsSync(commandsDir)) {
        log.warn('DevOps Commands not installed. Run: npx cursor-devops-commands');
        process.exit(0);
    }

    const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));

    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DEVOPS COMMANDS STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Version:${colors.reset}  ${VERSION}
${colors.cyan}Commands:${colors.reset} ${commands.length} installed
${colors.cyan}Location:${colors.reset} ${commandsDir}

${colors.bold}Installed Commands:${colors.reset}`);

    commands.forEach((cmd) => {
        console.log(`  - /${cmd.replace('.md', '')}`);
    });

    console.log('');
}

async function listCommands() {
    const packageDir = path.dirname(__dirname);
    const packageCommandsDir = path.join(packageDir, 'commands');

    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 AVAILABLE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);

    const categories = ['git', 'security', 'deployment'];
    const icons = { git: '🔀', security: '🔒', deployment: '🚀' };

    categories.forEach((cat) => {
        const catDir = path.join(packageCommandsDir, cat);
        if (fs.existsSync(catDir)) {
            console.log(`\n${icons[cat]} ${colors.bold}${cat.toUpperCase()}${colors.reset}`);

            const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.md'));
            files.forEach((file) => {
                const name = file.replace('.md', '');
                console.log(`  /${name}`);
            });
        }
    });

    console.log('');
}

function showHelp() {
    console.log(`
${colors.bold}cursor-devops-commands v${VERSION}${colors.reset}

DevOps & Git Commands for Cursor IDE

${colors.bold}Usage:${colors.reset}
  npx cursor-devops-commands [command] [options]

${colors.bold}Commands:${colors.reset}
  init          Install commands (default)
  status        Show current configuration
  list          List all available commands
  help          Show this help

${colors.bold}Options:${colors.reset}
  --bundle      Select bundle (minimal, standard, complete)
  -y, --yes     Non-interactive mode

${colors.bold}Examples:${colors.reset}
  npx cursor-devops-commands                   Interactive install
  npx cursor-devops-commands --bundle complete Install all commands
  npx cursor-devops-commands status            Check installation

${colors.bold}After Installation:${colors.reset}
  /auto-rebase         Rebase with conflict help
  /security-audit      Run security checks
  /post-deploy-check   Verify deployment
  /suggest-reviewers   Get reviewer suggestions

${colors.dim}https://github.com/sharath317/cursor-devops-commands${colors.reset}
`);
}

const args = process.argv.slice(2);
const flags = {};
let command = null;
const skipNextArg = new Set();

args.forEach((arg, idx) => {
    if (arg === '--bundle' && args[idx + 1]) {
        skipNextArg.add(idx + 1);
    }
});

args.forEach((arg, idx) => {
    if (skipNextArg.has(idx)) {
        return;
    } else if (arg === '-y' || arg === '--yes') {
        flags.yes = true;
    } else if (arg === '--bundle' && args[idx + 1]) {
        flags.bundle = args[idx + 1];
    } else if (!arg.startsWith('-') && command === null) {
        command = arg;
    }
});

switch (command) {
    case 'init':
    case null:
        init(flags);
        break;
    case 'status':
        status();
        break;
    case 'list':
        listCommands();
        break;
    case 'help':
    case '-h':
    case '--help':
        showHelp();
        break;
    default:
        log.error(`Unknown command: ${command}`);
        console.log('Run "npx cursor-devops-commands help" for usage');
        process.exit(1);
}
