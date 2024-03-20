### 接口1:注册接口



###### 接口功能

> 根据提供信息注册

###### URL

>  http://127.0.0.1:5000/register

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
> | message     | string   | 更多信息                                     |

###### 接口示例

> 地址： http://127.0.0.1:5000/register
>
> post传参：{"hashID":"C4CA4238A0B923820DCC509A6F75849B","identity":"Applicant"}

``` json
{
    "status": 1, 
    "hashID": "C4CA4238A0B923820DCC509A6F75849B", 
    "identity": "Applicant",
    "ETHAccounts": "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", 
    "PrivateKeys": "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1", 
    "message": "\u6ce8\u518c\u6210\u529f"
}
```

### 接口2:登录接口

###### 接口功能

> 检验登录用户

###### URL

>  http://127.0.0.1:5000/login

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

> 地址： http://127.0.0.1:5000/login
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

>  http://127.0.0.1:5000/upload

###### 支持格式

> application/json

###### HTTP请求方式

> POST

###### 请求参数

> | 参数        | 必选 | 类型   | 说明     |
> | ----------- | :--- | :----- | -------- |
> | name        | ture | string | 用户名   |
> | PrivateKeys | ture | string | 用户私钥 |

###### 返回字段

### 接口4:简历查询接口
