### 接口1:注册接口



###### 接口功能

> 根据提供信息注册

###### URL

>  http://47.97.255.9:5100/register

###### 支持格式

> application/json

###### HTTP请求方式

> POST

###### 请求参数

> | 参数     | 必选 | 类型   | 说明         |
> | :------- | :--- | :----- | ------------ |
> | username | ture | string | 注册用户名   |
> | hashID   | ture | string | 注册的hashID |
> | identity | true | string | 三种身份     |

###### 返回字段

正常返回

> | 返回字段    | 字段类型 | 说明                                         |
> | :---------- | :------- | :------------------------------------------- |
> | status      | int      | 0表示注册失败1表示注册成功                   |
> | username    | string   | 注册用户名                                   |
> | hashID      | string   | 注册成功返回hashID(返不返回应该都没什么问题) |
> | identity    | string   | 身份信息(三种)                               |
> | ETHAccounts | string   | ETH账户名(无需显示)                          |
> | PublicKeys  | string   | 公钥，将保存在数据库中                       |
> | PrivateKeys | string   | 私钥，将不保存在数据库中需要用户自己保管     |
> | S           | int      | S                                            |
> | P           | int      | P                                            |
> | M           | array    | M                                            |
> | X           | array    | X                                            |
> | message     | string   | 更多信息                                     |

###### 接口示例

> 地址： http://47.97.255.9:5100/register
>
> post传参：{"username":"whoami","hashID":"C4CA4238A0B923820DCC509A6F75849BQ","identity":"Applicant"}

``` json
{"status": 1, "username": "whoami", "hashID": "C4CA4238A0B923820DCC509A6F75849Ba", "identity": "Applicant", "ETHAccounts": "0xf80c771de9a9c2d9df5153acdc70048e944fa644", "PublicKeys": "6b5d2b0b1a408131af3a6bae0a0cc8653a8767b617bdf6088df9a497438d22d7014b7994dc72821da5d62f3a6db9f257b8b801782f8f19aa18b6d4a9513e6a81", "PrivateKeys": "YjZhMTU3NzVjMWE0MzU1NjFmYjFmZGMzYjU3MDQ4YWM2NTZlNjNkMzY2MGJjMjBmZTczODI1YTcxYWM1YmE4ZQ==", "S": 9488793770, "P": 15866148707, "M": [13406072982287, 21967254832489, 51569067649471, 79385932834037, 148803683241373], "X": [10697115756588, 16576427298182, 7688175423398, 22853390775325, 106399001934740], "message": "\u6ce8\u518c\u6210\u529f"}
```

### 接口2:登录接口

###### 接口功能

> 检验登录用户

###### URL

>  http://47.97.255.9:5100/login

###### 支持格式

> application/json

###### HTTP请求方式

> POST

###### 请求参数

> | 参数        | 必选 | 类型   | 说明         |
> | ----------- | :--- | :----- | ------------ |
> | name        | ture | string | 用户名       |
> | PrivateKeys | ture | string | 用户私钥     |
> | identity    | true | string | 用户身份信息 |

###### 返回字段

正常返回

> | 返回字段 | 字段类型 | 说明                       |
> | :------- | :------- | :------------------------- |
> | status   | int      | 0表示登录失败1表示登录成功 |
> | username | string   | 用户名                     |

###### 接口示例

> 地址： http://47.97.255.9:5100/login
>
> post传参：{"PrivateKeys":"0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d","identity":"Applicant"}

``` json
{
    "status": 1
}
```

### 接口3:简历上传接口

###### 接口功能

> 上传用户简历

###### URL

>  http://47.97.255.9:5100/upload

###### 支持格式

> multipart/form-data

###### HTTP请求方式

> POST

###### 请求参数

> | 参数 | 必选 | 类型   | 说明   |
> | ---- | :--- | :----- | ------ |
> | name | ture | string | 文件名 |

###### 返回字段



> | 返回字段 | 字段类型 | 说明                       |
> | :------- | :------- | :------------------------- |
> | status   | int      | 0表示上传失败1表示上传成功 |
> | hash     | string   | ipfs上传返回的hash         |

###### 接口示例:类似前端代码即可调用上传

```html
<!DOCTYPE html>
<html>
<body>

<h2>File Upload</h2>

<input type="file" id="fileToUpload">

<button onclick="uploadFile()">Upload</button>

<script>
function uploadFile() {
    var input = document.getElementById('fileToUpload');
    var file = input.files[0];
    var formData = new FormData();

    formData.append('file', file);

    fetch('http://47.97.255.9:5100/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
</script>

</body>
</html>

```



### 接口4:简历信息查询接口

###### 接口功能

> 查询有关简历的简单信息

###### URL

>  http://47.97.255.9:5100/getFileMessage

###### 支持格式

> application/json

###### HTTP请求方式

> POST

###### 请求参数

> | 参数   | 必选 | 类型   | 说明         |
> | ------ | :--- | :----- | ------------ |
> | hashID | ture | string | 用户名hashID |

###### 返回字段

正常返回

> | 返回字段      | 字段类型 | 说明                       |
> | :------------ | :------- | :------------------------- |
> | status        | int      | 0表示登录失败1表示登录成功 |
> | putTime       | string   | 简历上传最新时间           |
> | downloadtimes | string   | 简历被下载次数             |
