import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// 读取package.json获取应用名称配置
const packageJsonPath = path.resolve(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// 直接从package.json获取应用名称配置
const appConfig = {
  zh: packageJson.displayName || '启示路',
  en: packageJson.name.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Revelation'
}

// 设置环境变量，这样Vite的HTML插件可以正确替换HTML文件中的变量
process.env.VITE_APP_NAME_ZH = appConfig.zh
process.env.VITE_APP_NAME_EN = appConfig.en

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '', 
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      cacheDir: false 
    },
    optimizeDeps: {
      force: true // 强制重新优化依赖
    },
    server: {
      fs: {
        // 确保 Vite 可以访问 node_modules 中的文件
        allow: ['..']
      }
    },
    define: {
      // 定义构建时可用的全局变量
      'VITE_APP_NAME_ZH': JSON.stringify(appConfig.zh || '启示路'),
      'VITE_APP_NAME_EN': JSON.stringify(appConfig.en || 'Revelation')
    }
  }
})