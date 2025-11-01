import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// 读取package.json获取应用名称配置
const packageJsonPath = path.resolve(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// 直接从package.json获取应用名称配置
const appConfig = {
  zh: packageJson.displayName || '',
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
      cacheDir: false,
      // 明确指定入口文件，避免自动扫描licence目录
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    },
    optimizeDeps: {
      force: true, // 强制重新优化依赖
      exclude: ['licence'] // 排除优化licence目录
    },
    server: {
      fs: {
          // 确保 Vite 可以访问 node_modules 中的文件
          allow: ['..'],
          // 忽略licence目录
          deny: ['**/licence/**']
        },
      // 完全忽略licence目录的文件
      watch: {
        ignored: ['**/licence/**']
      }
    },
    define: {
      // 定义构建时可用的全局变量
      'VITE_APP_NAME_ZH': JSON.stringify(appConfig.zh || ''),
      'VITE_APP_NAME_EN': JSON.stringify(appConfig.en || 'Revelation')
    }
  }
})