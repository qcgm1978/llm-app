#!/bin/bash

# 定义变量 - 使用简单的ASCII密码
KEYSTORE_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore"
BKP_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore.bkp_$(date +%Y%m%d_%H%M%S)"
KEY_ALIAS="revelation"
# 使用纯ASCII密码
KEY_PASSWORD="chinacom"
STORE_PASSWORD="chinacom"
KEYSTORE_PROPERTIES="/Users/dickphilipp/Documents/revelation/android/app/keystore.properties"
PROPERTIES_BKP="/Users/dickphilipp/Documents/revelation/android/app/keystore.properties.bkp_$(date +%Y%m%d_%H%M%S)"

# 备份当前文件
echo "创建备份..."
mv "$KEYSTORE_PATH" "$BKP_PATH"
mv "$KEYSTORE_PROPERTIES" "$PROPERTIES_BKP"

# 生成新的密钥库 - 使用keytool命令并确保正确的参数格式
echo "生成新的密钥库（纯ASCII密码）..."
keytool -genkeypair \-alias "$KEY_ALIAS" \-keyalg RSA \-keysize 2048 \-validity 10000 \-keystore "$KEYSTORE_PATH" \-storepass "$STORE_PASSWORD" \-keypass "$KEY_PASSWORD" \-dname "CN=revelation, OU=development, O=revelation, L=beijing, ST=beijing, C=CN"

# 更新keystore.properties文件
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

# 设置正确的文件权限
echo "设置文件权限..."
chmod 644 "$KEYSTORE_PATH"
chmod 644 "$KEYSTORE_PROPERTIES"

# 输出完成信息
echo ""
echo "✅ 已成功修复ASCII密码问题！"
echo "- 密钥库已使用纯ASCII密码重新生成"
echo "- 新密码: $STORE_PASSWORD"
echo "- keystore.properties文件已更新"
echo ""
echo "请在Android Studio中使用以下凭据："
echo "密钥库密码: $STORE_PASSWORD"
echo "密钥别名: $KEY_ALIAS"
echo "密钥密码: $KEY_PASSWORD"
echo ""
echo "建议：清理项目并重新构建以应用更改。"