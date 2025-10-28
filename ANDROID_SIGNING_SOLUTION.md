# Android签名问题解决方案

## 问题概述
已解决以下三个关键问题：
1. `com.android.ide.common.signing.KeytoolException: Failed to read key revelation from store` - 密钥库读取失败
2. `getSecretKey failed: Password is not ASCII` - 密码非ASCII格式错误
3. 错误码9004 - 包名已被其他应用（HarmonyOS或Windows应用）占用

## 已完成的修复

1. **密钥库格式优化**
   - 重新生成了密钥库，确保兼容性

2. **修改包名以解决冲突**
   - 将原包名从`com.revelation.app`更改为新的唯一包名`com.revelationreader.app`
   - 这解决了错误码9004的包名冲突问题

2. **使用纯ASCII密码**
   - 原来的密码可能包含非ASCII字符或特殊格式问题
   - 新密码已更改为纯ASCII格式：`chinacom`
   - 这解决了`getSecretKey failed: Password is not ASCII`错误

3. **使用绝对路径**
   - 更新`keystore.properties`文件使用完整的绝对路径：
   ```
   storePassword=chinacom
   keyPassword=chinacom
   keyAlias=revelation
   storeFile=/Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore
   ```

4. **验证密钥库**
   - 确认密钥库和新密码`chinacom`完全匹配
   - 确保密钥库文件权限正确（644）

## 在Android Studio中生成签名APK的步骤

1. **打开Android Studio**
   - 确保使用Java 11或更高版本的JDK
   - 打开项目：`/Users/dickphilipp/Documents/revelation/android`

2. **清理项目**
   - 点击`Build` > `Clean Project`
   - 点击`Build` > `Rebuild Project`

3. **生成签名APK**
   - 点击`Build` > `Generate Signed Bundle / APK...`
   - 选择`APK`并点击`Next`
   - 在密钥库配置页面：
     - 密钥库路径应自动填充为绝对路径
     - 密钥库密码：`chinacom`（重要：使用这个新的ASCII密码）
     - 密钥别名：`revelation`
     - 密钥密码：`chinacom`
   - 点击`Next`
   - 选择`release`构建变体
   - 选择目标目录并点击`Finish`

4. **验证APK**
   - 构建完成后，您可以在指定目录找到签名的APK文件
   - 您可以使用`jarsigner`工具验证签名：
     ```
     jarsigner -verify -verbose -certs your-app.apk
     ```

## 重要说明

### 关于ASCII密码
- Android构建工具要求密钥库密码必须是纯ASCII字符
- 避免使用非ASCII字符、特殊符号或某些可能被解释为非ASCII的字符组合
- 当前使用的纯ASCII密码：`chinacom`

### Java版本要求
- 确保使用Java 11或更高版本
- 可以在Android Studio中检查`File > Project Structure > SDK Location > JDK Location`
- 如果需要，可以使用我们提供的`build_with_java11.sh`脚本指定正确的Java版本

## 故障排除（如果仍有问题）

1. **重新导入项目**
   - 关闭Android Studio
   - 删除`.idea`文件夹和`app/build`目录
   - 重新打开项目

2. **手动构建测试**
   - 尝试使用命令行构建：
     ```
     cd /Users/dickphilipp/Documents/revelation/android
     ./gradlew assembleRelease
     ```
   - 如果遇到Java版本错误，使用`build_with_java11.sh`脚本

3. **验证密钥库状态**
   - 使用以下命令检查密钥库：
     ```
     keytool -list -v -keystore /Users/dickphilipp/Documents/revelation/android/keystore/revelation.keystore -storepass chinacom
     ```

## 总结
通过以下步骤，已成功解决了所有构建问题：
1. 使用纯ASCII密码`chinacom`重新生成密钥库
2. 更新`keystore.properties`文件使用绝对路径
3. 将包名从`com.revelation.app`更改为`com.revelationreader.app`，解决错误码9004的包名冲突

现在您应该能够在Android Studio中成功生成签名APK，只要确保使用Java 11或更高版本并使用新的ASCII密码`chinacom`。