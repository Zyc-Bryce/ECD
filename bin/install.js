#!/usr/bin/env node

/**
 * ECD (Evolutionary Constraint Development) — npx 一键安装脚本
 *
 * 用法:
 *   npx ecd-claude-code
 *
 * 自动在 Claude Code 的 settings.json 中注册 ECD marketplace 并启用插件。
 * 无需管理员权限，不修改任何项目文件，仅编辑 ~/.claude/settings.json。
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

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

// ── main ──────────────────────────────────────────────
function main() {
  const header = `
  ╔══════════════════════════════════════════════╗
  ║     ECD — 演进约束开发                        ║
  ║     Evolutionary Constraint Development       ║
  ╚══════════════════════════════════════════════╝

  一键安装 Claude Code 插件…
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
  │  🎉 ECD 安装完成！                            │
  │                                              │
  │  下一步:                                      │
  │  1. 重启 Claude Code                          │
  │  2. 输入 /ecd 开始使用                         │
  │                                              │
  │  卸载:                                        │
  │  从 settings.json 中删除 ecd-marketplace       │
  │  和 ecd@ecd-marketplace 即可                  │
  │                                              │
  │  文档: https://github.com/Zyc-Bryce/ECD       │
  └──────────────────────────────────────────────┘
  `);
}

main();
