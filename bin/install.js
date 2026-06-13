#!/usr/bin/env node

/**
 * ECD (Evolutionary Constraint Development) — npx 一键安装脚本
 *
 * 用法:
 *   npx @zyc-bryce/ecd
 *
 * 自动在 Claude Code 的 settings.json 中注册 ECD marketplace 并启用插件。
 * 无需管理员权限，不修改任何项目文件，仅编辑 ~/.claude/settings.json。
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ── 版本号 ────────────────────────────────────────────
const PKG_VERSION = (() => {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version || 'unknown';
  } catch (_) {
    return 'unknown';
  }
})();

// ── 配置 ──────────────────────────────────────────────
const MARKETPLACE_NAME = 'ecd-marketplace';
const MARKETPLACE_SOURCE = { source: 'github', repo: 'Zyc-Bryce/ECD' };
const PLUGIN_KEY = 'ecd@ecd-marketplace';

// ── helpers ───────────────────────────────────────────
function settingsPath() {
  const home = os.homedir();
  if (process.platform === 'win32') {
    // %USERPROFILE%\.claude\settings.json
    return path.join(home, '.claude', 'settings.json');
  }
  return path.join(home, '.claude', 'settings.json');
}

function readSettings(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) || {};
  } catch (e) {
    console.error('❌ 读取 settings.json 失败:', e.message);
    console.error('   文件路径:', filePath);
    console.error('   请检查文件是否为合法 JSON。');
    process.exit(1);
  }
}

function writeSettings(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ── uninstall ────────────────────────────────────────
function uninstall() {
  const header = `
  ╔══════════════════════════════════════════════╗
  ║     ECD — 卸载                          ║
  ║     Evolutionary Constraint Development       ║
  ╚══════════════════════════════════════════════╝

  正在从 settings.json 中移除 ECD 配置…
  `;
  console.log(header);

  const filePath = settingsPath();
  console.log('  📁 settings.json: %s\n', filePath);

  const settings = readSettings(filePath);

  let changed = false;

  // ── Step 1: 移除 marketplace ──
  if (settings.extraKnownMarketplaces && settings.extraKnownMarketplaces[MARKETPLACE_NAME]) {
    delete settings.extraKnownMarketplaces[MARKETPLACE_NAME];
    if (Object.keys(settings.extraKnownMarketplaces).length === 0) {
      delete settings.extraKnownMarketplaces;
    }
    console.log('  ✅ 已移除 marketplace: ecd-marketplace');
    changed = true;
  } else {
    console.log('  ⏭️  marketplace 不存在，跳过');
  }

  // ── Step 2: 禁用插件 ──
  if (settings.enabledPlugins && settings.enabledPlugins[PLUGIN_KEY]) {
    delete settings.enabledPlugins[PLUGIN_KEY];
    if (Object.keys(settings.enabledPlugins).length === 0) {
      delete settings.enabledPlugins;
    }
    console.log('  ✅ 已禁用插件: ecd@ecd-marketplace');
    changed = true;
  } else {
    console.log('  ⏭️  插件未启用，跳过');
  }

  // ── Step 3: 写入 ──
  if (changed) {
    writeSettings(filePath, settings);
    console.log('\n  💾 已保存 settings.json');
  } else {
    console.log('\n  ℹ️  未找到 ECD 配置，无需操作');
  }

  console.log(`
  ┌──────────────────────────────────────────────┐
  │  🧹 ECD 卸载完成                              │
  │                                              │
  │  重启 Claude Code 后生效                      │
  │                                              │
  │  如需重新安装：                                │
  │  npx @zyc-bryce/ecd                          │
  │                                              │
  │  文档：https://github.com/Zyc-Bryce/ECD       │
  └──────────────────────────────────────────────┘
  `);
}

// ── main ──────────────────────────────────────────────
function main() {
  // ── 卸载模式 ──
  if (process.argv.includes('--uninstall') || process.argv.includes('-u')) {
    uninstall();
    process.exit(0);
  }

  const header = `
  ╔══════════════════════════════════════════════╗
  ║     ECD — 演进约束开发           v${PKG_VERSION}     ║
  ║     Evolutionary Constraint Development       ║
  ╚══════════════════════════════════════════════╝

  正在配置 Claude Code 插件…
  `;
  console.log(header);

  const filePath = settingsPath();
  console.log('  📁 settings.json: %s\n', filePath);

  const settings = readSettings(filePath);

  let changed = false;

  // ── Step 1: 注册 marketplace ──
  if (!settings.extraKnownMarketplaces) {
    settings.extraKnownMarketplaces = {};
  }
  if (!settings.extraKnownMarketplaces[MARKETPLACE_NAME]) {
    settings.extraKnownMarketplaces[MARKETPLACE_NAME] = {
      source: MARKETPLACE_SOURCE,
    };
    console.log('  ✅ 已注册 marketplace: ecd-marketplace (github.com/Zyc-Bryce/ECD)');
    changed = true;
  } else {
    console.log('  ⏭️  marketplace 已存在，跳过');
  }

  // ── Step 2: 启用插件 ──
  if (!settings.enabledPlugins) {
    settings.enabledPlugins = {};
  }
  if (!settings.enabledPlugins[PLUGIN_KEY]) {
    settings.enabledPlugins[PLUGIN_KEY] = true;
    console.log('  ✅ 已启用插件: ecd@ecd-marketplace');
    changed = true;
  } else {
    console.log('  ⏭️  插件已启用，跳过');
  }

  // ── Step 3: 写入 ──
  if (changed) {
    writeSettings(filePath, settings);
    console.log('\n  💾 已保存 settings.json');
  } else {
    console.log('\n  ℹ️  配置已是最新，无需修改');
  }

  // ── 完成信息 ──
  console.log(`
  ┌──────────────────────────────────────────────┐
  │  🎉 ECD v${PKG_VERSION} 配置完成！                   │
  │                                              │
  │  下一步：                                     │
  │  1. 重启 Claude Code                          │
  │  2. 输入 /ecd 开始使用                         │
  │                                              │
  │  验证版本：                                   │
  │  claude plugin list                          │
  │  （查看 ecd@ecd-marketplace 的 Version 字段）  │
  │                                              │
  │  卸载：                                      │
  │  npx @zyc-bryce/ecd --uninstall              │
  │                                              │
  │  文档：https://github.com/Zyc-Bryce/ECD       │
  └──────────────────────────────────────────────┘
  `);
}

main();
