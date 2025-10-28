#!/bin/bash

# 脚本用于重新生成密钥库并更新配置

# 设置变量
KEYSTORE_PATH="/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore"
PROPERTIES_PATH="/Users/dickphilipp/Documents/revelation/android/app/keystore.properties"
KEY_ALIAS="revelation"
KEY_PASSWORD="china.com"
STORE_PASSWORD="china.com"
VALIDITY_DAYS=10000

# 确保keystore目录存在
mkdir -p $(dirname $KEYSTORE_PATH)

# 删除旧的密钥库文件（如果存在）
if [ -f $KEYSTORE_PATH ]; then
    rm $KEYSTORE_PATH
    echo "已删除旧的密钥库文件"
fi

# 生成新的密钥库
keytool -genkeypair -v \
    -keystore $KEYSTORE_PATH \
    -alias $KEY_ALIAS \
    -keyalg RSA \
    -keysize 2048 \
    -validity $VALIDITY_DAYS \
    -storepass $STORE_PASSWORD \
    -keypass $KEY_PASSWORD \
    -dname "CN=revelation, OU=development, O=revelation, L=beijing, ST=beijing, C=CN"

# 验证密钥库
if [ -f $KEYSTORE_PATH ]; then
    echo "\n密钥库生成成功，正在验证..."
    keytool -list -v -keystore $KEYSTORE_PATH -storepass $STORE_PASSWORD -keypass $KEY_PASSWORD
else
    echo "密钥库生成失败"
    exit 1
fi

# 备份旧的配置文件
if [ -f $PROPERTIES_PATH ]; then
    cp $PROPERTIES_PATH $PROPERTIES_PATH.bak
    echo "已备份旧的配置文件"
fi

# 更新keystore.properties文件
cat > $PROPERTIES_PATH << EOF
storePassword=$STORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=$KEY_ALIAS
storeFile=../keystore/revelation.keystore
EOF

# 显示配置内容
cat $PROPERTIES_PATH

# 设置正确的文件权限
chmod 644 $KEYSTORE_PATH
chmod 644 $PROPERTIES_PATH

echo "\n密钥库和配置已成功更新！请尝试在Android Studio中重新构建项目。"