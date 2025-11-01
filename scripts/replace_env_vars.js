#!/usr/bin/env node
// 构建后脚本，用于替换public目录下HTML文件中的环境变量和Android strings.xml

import fs from 'fs';
import path from 'path';

// 从package.json获取应用名称配置
function getAppConfig() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    // 转换package.json中的name字段为合适的Android包名格式
    // 将连字符替换为点，并添加com前缀
    const packageName = `com.${packageJson.name.replace(/-/g, '.')}`;
    
    const config = {
      zh: packageJson.displayName || '',
      en: packageJson.name.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '',
      packageName: packageName
    };
    
    console.log('Successfully parsed app names from package.json:', config);
    return config;
  } catch (error) {
    console.error('Failed to read package.json:', error);
    
    // 备用方案：尝试从config.ts获取
    try {
      const configPath = path.resolve(process.cwd(), 'config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      const zhRegex = /zh:\s*["']([^"]+)["']/;
      const enRegex = /en:\s*["']([^"]+)["']/;
      
      const zhMatch = configContent.match(zhRegex);
      const enMatch = configContent.match(enRegex);
      
      if (zhMatch || enMatch) {
        const config = {
          zh: zhMatch ? zhMatch[1] : '',
          en: enMatch ? enMatch[1] : 'Revelation',
          packageName: 'com.revelation.app' // 默认包名作为备用
        };
        console.log('Fallback: Successfully parsed appNames from config.ts:', config);
        return config;
      }
    } catch (configError) {
      console.warn('Failed to read config.ts as fallback');
    }
  }
  
  return { zh: '', en: '', packageName: 'com.revelation.app' };
}

// 更新Android Java文件中的包声明
function updateJavaPackageDeclarations(appConfig) {
  try {
    const newPackageName = 'com.revelationreader.app.infinite_read';
    const oldPackageName = 'com.revelationreader.app';
    
    // 需要更新的Java文件列表
    const javaFiles = [
      path.resolve(process.cwd(), 'android/app/src/main/java/com/revelationreader/app/_infinite_read__/MainActivity.java'),
      path.resolve(process.cwd(), 'android/app/src/main/java/com/revelationreader/app/_infinite_read__/SettingsActivity.java')
    ];
    
    javaFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // 更新包声明
        if (content.includes(`package ${oldPackageName};`)) {
          content = content.replace(`package ${oldPackageName};`, `package ${newPackageName};`);
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Successfully updated package declaration in ${filePath}`);
        }
      }
    });
  } catch (error) {
    console.error('Failed to update Java package declarations:', error);
  }
}

// 更新Android strings.xml文件
function updateAndroidStringsXml(appConfig) {
  try {
    const stringsXmlPath = path.resolve(process.cwd(), 'android/app/src/main/res/values/strings.xml');
    
    if (!fs.existsSync(stringsXmlPath)) {
      console.warn(`Android strings.xml not found at ${stringsXmlPath}`);
      return;
    }
    
    let content = fs.readFileSync(stringsXmlPath, 'utf-8');
    
    // 更新应用名称
    if (appConfig.zh) {
      content = content.replace(/<string name="app_name">[^<]+<\/string>/, `<string name="app_name">${appConfig.zh}</string>`);
      content = content.replace(/<string name="title_activity_main">[^<]+<\/string>/, `<string name="title_activity_main">${appConfig.zh}</string>`);
    }
    
    // 更新package_name和custom_url_scheme，基于package.json中的name字段
    if (appConfig.packageName) {
      const packageName = appConfig.packageName;
      content = content.replace(/<string name="package_name">[^<]+<\/string>/, `<string name="package_name">${packageName}</string>`);
      content = content.replace(/<string name="custom_url_scheme">[^<]+<\/string>/, `<string name="custom_url_scheme">${packageName}</string>`);
      console.log(`Successfully updated Android strings.xml with package name: ${packageName}`);
    }
    
    fs.writeFileSync(stringsXmlPath, content, 'utf-8');
    console.log(`Successfully updated Android strings.xml with app name: ${appConfig.zh}`);
  } catch (error) {
    console.error('Failed to update Android strings.xml:', error);
  }
}

// 替换文件中的环境变量
function replaceEnvVars(filePath, appConfig) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 替换环境变量
    content = content.replace(/%VITE_APP_NAME_ZH%/g, appConfig.zh);
    content = content.replace(/%VITE_APP_NAME_EN%/g, appConfig.en);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Successfully replaced env vars in ${filePath}`);
  } catch (error) {
    console.error(`Failed to replace env vars in ${filePath}:`, error);
  }
}

// 主函数
function main() {
  const appConfig = getAppConfig();
  const distDir = path.resolve(process.cwd(), 'dist');
  
  // 更新Android Java文件中的包声明
  updateJavaPackageDeclarations(appConfig);
  
  // 更新Android strings.xml文件
  updateAndroidStringsXml(appConfig);
  
  // 需要处理的HTML文件列表
  const htmlFiles = ['download.html', 'privacy.html', 'contact.html'];
  
  htmlFiles.forEach(fileName => {
    const filePath = path.join(distDir, fileName);
    if (fs.existsSync(filePath)) {
      replaceEnvVars(filePath, appConfig);
    }
  });
  
  console.log('Environment variable replacement and Android strings update completed.');
}

main();
