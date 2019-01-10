# uni-app 常见问答

用于 uni-app 小助手 回答常见问题

## 依赖工具

[QQPlugin-macOS](https://github.com/TKkk-iOSer/QQPlugin-macOS)

## 配置问题和答案

编辑 config.yml 文件

属性|类型|是否必选|详情
--|--|--|--
questions|Array|否|示例问题（如果写了示例问题，会验证是否能正确匹配）
keys|Array|是|匹配关键字（正则）
answer|String|是|参考答案

### 示例

#### 完整写法

```yml
- 
  questions:
    - 示例问题
  keys:
    - 关键字1
    - 关键字2
  answer: 参考答案
```

#### 精简写法

```yml
-
  - 关键字1
  - 关键字2
  - 参考答案
```

## 编译

当前目录下建立 username 文件可配置当前设备用户名，配置后将直接编译至 QQPlugin-macOS 配置路径

```shell
npm run build
```
