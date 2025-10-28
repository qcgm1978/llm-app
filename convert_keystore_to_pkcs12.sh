#!/bin/bash

# 定义变量
KEYSTORE_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore"
BACKUP_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore.backup"
PKCS12_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.p12"
KEY_ALIAS="revelation"
KEY_PASSWORD="china.com"
STORE_PASSWORD="china.com"
KEYSTORE_PROPERTIES="/Users/dickphilipp/Documents/revelation/android/app/keystore.properties"

# 备份当前密钥库
echo "备份当前密钥库..."
mv "$KEYSTORE_PATH" "$BACKUP_PATH"

# 将JKS格式转换为PKCS12格式
echo "将密钥库从JKS格式转换为PKCS12格式..."
keytool -importkeystore -srckeystore "$BACKUP_PATH" -destkeystore "$PKCS12_PATH" -deststoretype PKCS12 -srcalias "$KEY_ALIAS" -srcstorepass "$STORE_PASSWORD" -deststorepass "$STORE_PASSWORD" -destkeypass "$KEY_PASSWORD"

# 重命名PKCS12密钥库为原来的名称
echo "重命名PKCS12密钥库..."
mv "$PKCS12_PATH" "$KEYSTORE_PATH"

# 更新keystore.properties文件使用绝对路径
echo "更新keystore.properties文件..."
cat > "$KEYSTORE_PROPERTIES" << EOL
storePassword=$STORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=$KEY_ALIAS
storeFile=$KEYSTORE_PATH
EOL

# 验证新密钥库
echo "验证新密钥库..."
keytool -list -v -keystore "$KEYSTORE_PATH" -storepass "$STORE_PASSWORD"

# 设置文件权限
echo "设置文件权限..."
chmod 644 "$KEYSTORE_PATH"
chmod 644 "$KEYSTORE_PROPERTIES"

# 输出完成信息
echo ""
echo "密钥库格式转换完成！"
echo "- 密钥库已从JKS格式转换为PKCS12格式"
echo "- keystore.properties已更新为使用绝对路径"
echo "- 请在Android Studio中清理项目并重新构建"
echo "- 构建时可能需要重新输入密码: $STORE_PASSWORD"