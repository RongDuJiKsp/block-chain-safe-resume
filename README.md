所有响应体的基类

```
 /**
 * @interface BaseRes 所有响应体的基类  也就是所有响应体都继承自该响应体
 * @property {number} status 响应状态码 0为失败响应 1为正常响应
 * @property {string} message 响应信息，当为正常响应时可以为空字符串
 */
  interface BaseRes {
    status: number;
    message: string;
 }
```



#### 1.注册

```
 /**
 * @interface RegisterReq 注册的请求体
 * @property userName 用户名
 * @property identity 用户身份(Applicant、Recruiter、KeyKeeper)
 */
  interface RegisterReq {
    identity: string
 }


 /**
 * @interface RegisterRes 注册的响应体
 * @extends BaseRes
 * @property {string} address 用户对应address
 * @property {string} privateKeys 用户注册的私钥
 * @property {number} S 用户注册得到的 S Key
 * @property {number} P 用户注册得到的 P Key
 * @property {number[]} M 用户注册得到的子密钥M
 * @property {number[]} X 用户注册得到的子密钥X
 */
  interface RegisterRes extends BaseRes {
    address: string,
    privateKeys: string,
    S: number,
    P: number,
    M: number[],
    X: number[],
 }
```

示例:`{"identity":"Applicant"}`

#### 2.登录

```
/**
* 登录用户不需要输入用户昵称，数据库将用户地址和用户昵称对应，
* 用户登录时用用户私钥计算用户地址，将地址和昵称一并返回
* webase计算私钥传入的用户昵称暂时使用时间戳 这个字段会被弃用
*/
interface LoginReq {
    privateKeys: string;
    identity: UserIdentityEnum;
}

/**
 * @interface LoginRes 登录接口
 * @extends BaseRes
 * @property address 用户私钥对应的地址
 * @property username 用户昵称
 */
  interface LoginRes extends BaseRes {
    address: string;
    username: string;
}

```



#### 3.用户名更改

```
 /**
 * @interface ChangeNameReq 更改用户昵称的请求
 * @property oldName 用户将要改的名字
 * @property newName 用户的新名字
 * @property identity 用户身份信息
 * @property privateKey 用户的私钥 在后端计算为用户的地址然后读写数据库更改昵称
 */
 interface ChangeNickReq {
    oldName: string;
    newName: string;
    identity: string;
    privateKey: string;
 }

 /**
 * @interface ChangeNameRes 更改用户昵称的响应体
 * @extends BaseRes
 * @property newName 用户新名字
 */
 interface ChangeNickRes extends BaseRes{
    newName: string;
 }
```



#### 4.kk得到所有待保管秘密份额的ap用户

```
 /**
 * @interface GetNeedSaveReq
 * @property KKAddress kk用户地址(登陆时已经返回)
 */
  interface GetNeedSaveReq {
    KKAddress: string;
 }


 /**
 * @interface GetNeedSaveRes
 * @property userName 用户名
 * @property address 用户地址
 * @property remainingAmount 剩余秘密份额数量(每个kk最多保管同一个用户的秘密份额1分、份)
 */
interface GetNeedSaveRes extends BaseRe{
    list:[[userName,address,remainingAmount],[...,...,...]]
}
```

示例:`{"KKAddress":"0xdd5d634fd9737fbad195ec5216eecde4b7f943ca"}`

#### 5.kk秘密份额保管申请

```
 /**
 * @interface SavePartReq
 * @property userName 待保管人的名称(接口6查询时已经返回)
 * @property address  待保管人的地址(接口6查询时已经返回)
 * @property KKAddress kk的地址(接口2登录时已经返回)
 */
  interface SavePartReq {
    userName: string;
    address: string;
    KKAddress: string;
 }

 /**
 * @interface SavePartRes
 * @extends BaseRes
 * @property i kk保管该用户的第几份秘密份额
 * @property x 秘密份额x
 * @property m 秘密份额m
 * @property p p
 */
interface SavePartRes extends BaseRes {
    i: int;
    x: int;
    m: int;
    p: int;
}
```

#### 6.kk查看已经保管的秘密份额

```
 /**
 * @interface GetSaveReq
 * @property KKAddress kk用户地址(登陆时已经返回)
 */
  interface GetSaveReq {
    KKAddress: string;
 }


 /**
 * @interface GetNeedSaveRes
 * @property userName 用户名
 * @property address 用户地址
 * @property KKAddress kk地址(无所谓的有没有的)
 */
interface GetNeedSaveRes extends BaseRe{
    list:[[userName,address,KKAddress],[...,...,...]]
}
```

示例:`{"KKAddress":"0xa522fe242f4cc2b31ae035e6b433a3cbf48d5afc"}`

#### 7.re查看所有可申请查看简历的ap用户

```
 /**
 * @interface GetResumeReq
 * @property ReAddress re用户地址(登陆时已经返回)
 */
  interface GetResumeReq {
    ReAddress: string;
 }


 /**
 * @interface GetResumeRes
 * @property userName 用户名
 * @property address 用户地址
 * @property putTime 简历上传时间(从1970年1月1日00:00:00 UTC到现在的秒数)
 * @property downloadtimes 简历下载次数
 */
interface GetResumeReq extends BaseRe{
    list: [[userName,address,putTime,downloadtimes],[...,...,...]]
}
```

#### 8.re请求授权查看简历

```
 /**
 * @interface RecAuthorizeReq
 * @property ApUserName ap用户名
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户地址
 */
  interface RecAuthorizeReq {
    ApUserName: string;
    ApAddress: string;
    ReAddress: string;
 }

 /**
 * @interface RecAuthorizeRes
 * @extends BaseRes
 */
interface RecAuthorizeRes extends BaseRes {
}
```

#### 9.re查看自己申请查看的简历状态

```
 /**
 * @interface RecAlreadyAuthorizeReq
 * @property ReAddress re用户地址(登陆时已经返回)
 */
  interface RecAlreadyAuthorizeReq {
    ReAddress: string;
 }


 /**
 * @interface RecAlreadyAuthorizeRes
 * @property ApUserName ap用户名
 * @property ApAddress ap用户地址
 * @property ReAddress re用户自己的地址(忽略就好)
 * @property ststus 申请状态(int型,0表示在申请中,1表示申请成功)
 * @property keyNum 如果申请通过会显示获得的秘密份额个数,当秘密份额>=3时可以通过接口14获得简历信息。如果申请状态为0则该字段为0无实际意义
 */
interface RecAlreadyAuthorizeRes extends BaseRes{
    list:[[ApUserName,ApAddress,ReAddress,ststus,keyNum],[...,...,...]]
}
```

#### 10.re下载简历

```
 /**
 * @interface DownloadFileReq
 * @property fileHash 文件的ipfs上对应的hash 文件的mime类型和文件名由客户端与区块链直接交互得到
 * @property ApUserName 要被下载的ap用户名
 * @property ReUserName 下载者re用户名
 */
  interface DownloadFileReq {
    fileHash: string;
    ApUserName: string;
    ReUserName: string;
 }

 /**
 * @interface DownloadRes
 * @extends BaseRes
 * @property base64 二进制文件的base64编码
 */
interface DownloadRes extends BaseRes {
    base64: string;
}
```

#### 11.ap查看所有的简历申请请求

```
 /**
 * @interface GetRequestReq
 * @property ApAddress ap用户地址(登陆时已经返回)
 */
  interface GetRequestReq {
    ApAddress: string;
 }


 /**
 * @interface GetRequestRes
 * @property ApUserName ap用户名(忽略就好)
 * @property ApAddress ap用户自己的地址(忽略就好)
 * @property ReUserName re用户的用户名
 * @property ReAddress re用户的地址
 * @property ststus 申请状态(int型,0表示在申请中,1表示ap已经同意申请)
 */
interface GetRequestRes extends BaseRe{
    list: [[ApUserName,ApAddress,ReUserName,ReAddress,ststus],[...,...,...]]
}
```

#### 12.ap用户授权相应re查看自己的简历(分同意或不同意两种情况)

```
 /**
 * @interface ApAuthorizeReq
 * @property status int型,0表示不同意申请,1表示同意申请
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户地址
 */
  interface ApAuthorizeReq {
    status: int;
    ApAddress: string;
    ReAddress: string;
 }

 /**
 * @interface ApAuthorizeRes
 * @extends BaseRes
 */
interface ApAuthorizeRes extends BaseRes {
}
```

#### 13.ap用户上传简历

```
/**
*后端和合约交互,然后把加密文件上传到ipfs并返回hash
*请求的时候需要get传参userName和address
*/

 /**
 * @interface UploadRes 上传文件的响应体
 * @extends BaseRes
 * @property hash 上传文件时ipfs返回的hash
 */
  interface UploadRes extends BaseRes {
    hash: string;
 }
```

上传html代码示例

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
    var userName = 'dIvPOeE6RW2r'
    var address = '0xa5b2718b5111c89d6d464ca3d1aef041a1334905';  //address示例
    fetch('http://127.0.0.1:5000/UploadReq?address=' + address+'&userName='+userName, {
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

#### 14.获取加密简历文件的对称密钥s、文件名、文件类型、文件hash

```
 /**
 * @interface GetFileMesReq
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户的地址
 */
  interface GetFileMesReq {
    ApAddress: string;
    ReAddress: string;
 }

 /**
 * @interface GetFileMesRes
 * @extends BaseRes
 * @property s 对称密钥s
 * @property fileName 文件名
 * @property fileType 文件类型
 * @property fileHash 文件hash
 */
interface GetFileMesRes extends BaseRes {
    s: int;
    fileName: string;
    fileType: string;
    fileHash: string;
}
```

#### 15.ap查看自己简历的被下载记录

```
 /**
 * @interface GetDownloadHisReq
 * @property ApUserName ap用户名(登陆时已经返回)
 */
  interface GetDownloadHisReq {
    ApUserName: string;
 }


 /**
 * @interface GetDownloadHisRes
 * @property ApUserName ap用户名(忽略就好)
 * @property ReUserName re用户的用户名
 * @property downloadtime 被下载时间戳
interface GetDownloadHisRes extends BaseRe{
    list: [[ApUserName,ReUserName,downloadtime],[...,...,...]]
}
```

#### 16.re模糊查找ap

```
 /**
 * @interface SearchApReq
 * @property partApUserName ap用户名部分
 */
  interface SearchApReq {
    partApUserName: string;
 }

 /**
 * @interface SearchApRes
 * @property ApUserName ap用户名 string
 * @property ApAddress ap用户地址 string 
interface GetDownloadHisRes extends BaseRe{
	list: [[ApUserName,ApAddress],[...,...,...]]
}
```



#### 17.提示kk上传密钥

```
 /**
 * 列出所有需要kk上传密钥的用户
 * @interface RemindKKReq
 * @property KKAddress kk地址登录时已经返回
 */
  interface RemindKKReq {
    KKAddress: string;
 }

 /**
 * @interface RemindKKRes
 * @property ApUserName ap用户名 string
 * @property KKAddress kk地址(忽略即可)
 * @property time 上传密钥请求发出时间戳 int 
interface RemindKKRes extends BaseRe{
	list: [[ApUserName,KKAddress,time],[...,...,...]]
}
```

#### 18.ap查看简历其他信息(下载总次数，上传时间)

```
 /**
 * @interface GetMoreFileMesReq
 * @property ApAddress ap用户地址
 */
  interface GetMoreFileMesReq {
    ApAddress: string;
 }


 /**
 * @interface GetMoreFileMesRes
 * @property userName ap用户名
 * @property putTime 简历最近一次上传时间戳 int
 * @property downloadtimes 简历被下载总次数
interface GetMoreFileMesRes extends BaseRe{
    userName: string
    putTime: int
    downloadtimes: int
}
```

#### 19.kk上传密钥

```
 /**
 * kk上传密钥
 * @interface UploadKeyReq
 * @property KKAddress kk地址登录时已经返回
 * @property ApUserName Ap用户名
 * @property i 下标i,上传的是第几份份额
 * @property x  对应x
 * @property m  对应m
 */
  interface UploadKeyReq {
    KKAddress: string
    ApUserName: string
    i: int
    x: int
    m: int
 }

 /**
 * @interface UploadKeyRes
 */
interface UploadKeyRes extends BaseRe{
}
```
