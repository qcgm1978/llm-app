#!/bin/bash

# 生成新的签名密钥库脚本
# 使用方法：chmod +x generate_new_keystore.sh && ./generate_new_keystore.sh

# 设置密钥库文件路径
KEYSTORE_PATH="android/keystore/revelation.keystore"
# 设置keystore.properties文件路径
PROPERTIES_PATH="android/app/keystore.properties"

# 提示用户输入密钥库密码
read -p "请输入新的密钥库密码: " -s KEYSTORE_PASSWORD
echo
read -p "请再次输入密钥库密码以确认: " -s KEYSTORE_PASSWORD_CONFIRM
echo

# 验证密码一致性
if [ "$KEYSTORE_PASSWORD" != "$KEYSTORE_PASSWORD_CONFIRM" ]; then
  echo "错误：两次输入的密码不一致！"
  exit 1
fi

# 提示用户输入密钥密码
read -p "请输入密钥密码(可与密钥库密码相同): " -s KEY_PASSWORD
echo
read -p "请再次输入密钥密码以确认: " -s KEY_PASSWORD_CONFIRM
echo

# 验证密钥密码一致性
if [ "$KEY_PASSWORD" != "$KEY_PASSWORD_CONFIRM" ]; then
  echo "错误：两次输入的密钥密码不一致！"
  exit 1
fi

# 生成新的密钥库
keytool -genkey -v -keystore "$KEYSTORE_PATH" -alias revelation -keyalg RSA -keysize 2048 -validity 10000

# 更新keystore.properties文件
cat > "$PROPERTIES_PATH" << EOL
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=revelation
storeFile=../keystore/revelation.keystore
EOL

echo "\n密钥库生成成功！keystore.properties文件已更新。"
echo "现在可以尝试重新构建应用：cd android && ./gradlew assembleRelease"