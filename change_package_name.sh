#!/bin/bash

# 定义变量
OLD_PACKAGE="com.revelation.app"
APP_DIR="/Users/dickphilipp/Documents/revelation/android/app"
MANIFEST_FILE="$APP_DIR/src/main/AndroidManifest.xml"
BUILD_GRADLE="$APP_DIR/build.gradle"
JAVA_SRC_DIR="$APP_DIR/src/main/java"
CAPACITOR_CONFIG="/Users/dickphilipp/Documents/revelation/capacitor.config.ts"
PACKAGE_JSON="/Users/dickphilipp/Documents/revelation/package.json"

# 从package.json中读取name字段
if [ -f "$PACKAGE_JSON" ]; then
  # 使用sed提取name字段的值（去掉引号）
  APP_NAME=$(sed -n 's/.*"name":["\s]*\([^"]*\)["\s]*,*/\1/p' "$PACKAGE_JSON")
  echo "从package.json中读取到应用名称: $APP_NAME"
  
  # 将应用名称转换为小写并替换非字母数字字符为下划线
  APP_NAME_SUFFIX=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g')
  
  # 根据应用名称生成新包名
  NEW_PACKAGE="com.revelationreader.app.$APP_NAME_SUFFIX"
  echo "根据应用名称生成新包名: $NEW_PACKAGE"
else
  # 如果无法读取package.json，使用默认包名
  NEW_PACKAGE="com.revelationreader.app"
  echo "未找到package.json，使用默认包名: $NEW_PACKAGE"
fi

# 创建备份
echo "创建配置文件备份..."
mkdir -p "$APP_DIR/backups"
date_str=$(date +%Y%m%d_%H%M%S)
cp "$MANIFEST_FILE" "$APP_DIR/backups/AndroidManifest.xml.$date_str"
cp "$BUILD_GRADLE" "$APP_DIR/backups/build.gradle.$date_str"

# 1. 更新build.gradle中的applicationId和namespace
echo "更新build.gradle中的包名..."
sed -i '' "s/namespace \"$OLD_PACKAGE\"/namespace \"$NEW_PACKAGE\"/g" "$BUILD_GRADLE"
sed -i '' "s/applicationId \"$OLD_PACKAGE\"/applicationId \"$NEW_PACKAGE\"/g" "$BUILD_GRADLE"

# 2. 更新AndroidManifest.xml中可能引用的包名
echo "更新AndroidManifest.xml中的包名引用..."
sed -i '' "s/$OLD_PACKAGE/$NEW_PACKAGE/g" "$MANIFEST_FILE"

# 3. 更新Java文件结构
echo "更新Java文件结构..."
# 创建新的包名目录结构
OLD_PATH=$(echo $OLD_PACKAGE | tr '.' '/')
NEW_PATH=$(echo $NEW_PACKAGE | tr '.' '/')

# 创建新的目录结构
mkdir -p "$JAVA_SRC_DIR/$NEW_PATH"

# 移动MainActivity.java文件到新的目录
echo "移动MainActivity.java文件..."
find "$JAVA_SRC_DIR" -name "MainActivity.java" -exec mv {} "$JAVA_SRC_DIR/$NEW_PATH/" \;

# 如果有其他Java文件也移动
find "$JAVA_SRC_DIR" -type f -name "*.java" -not -path "$JAVA_SRC_DIR/$NEW_PATH/*" -exec mv {} "$JAVA_SRC_DIR/$NEW_PATH/" \;

# 4. 更新Java文件中的包声明
echo "更新Java文件中的包声明..."
find "$JAVA_SRC_DIR/$NEW_PATH" -name "*.java" -exec sed -i '' "s/package $OLD_PACKAGE/package $NEW_PACKAGE/g" {} \;

# 5. 更新capacitor.config.ts（如果存在）
if [ -f "$CAPACITOR_CONFIG" ]; then
echo "更新capacitor.config.ts中的包名..."
sed -i '' "s/$OLD_PACKAGE/$NEW_PACKAGE/g" "$CAPACITOR_CONFIG"
fi

# 6. 清理旧的目录结构
echo "清理旧的目录结构..."
# 从最深层目录开始删除，避免删除当前使用的目录
OLD_DIR_PARTS=(${OLD_PACKAGE//./ })
TEMP_DIR="$JAVA_SRC_DIR"
for (( i=${#OLD_DIR_PARTS[@]}-1; i>=0; i-- )); do
    TEMP_DIR="$TEMP_DIR/${OLD_DIR_PARTS[i]}"
    if [ -d "$TEMP_DIR" ]; then
        rmdir "$TEMP_DIR" 2>/dev/null || echo "跳过删除非空目录: $TEMP_DIR"
    fi
done

# 7. 输出完成信息
echo ""
echo "✅ 包名修改完成！"
echo "- 旧包名: $OLD_PACKAGE"
echo "- 新包名: $NEW_PACKAGE"
echo ""
echo "请执行以下步骤以完成修改："
echo "1. 在Android Studio中清理项目：Build > Clean Project"
echo "2. 重新构建项目：Build > Rebuild Project"
echo "3. 重新生成签名APK"
echo ""
echo "注意：已在$APP_DIR/backups/目录下创建配置文件备份，以防需要恢复。"