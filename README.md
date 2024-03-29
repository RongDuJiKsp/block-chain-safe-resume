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
 * @property hashID 用户hash
 * @property userName 用户名
 * @property identity 用户身份(Applicant、Recruiter、KeyKeeper)
 */
  interface RegisterReq {
    hashID: string,
    userName: string,
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

#### 2.登录

```
/**
* 登录用户不需要输入用户昵称，数据库将用户地址和用户昵称对应，
* 用户登录时用用户私钥计算用户地址，将地址和昵称一并返回
* webase计算私钥传入的用户昵称暂时使用时间戳 这个字段会被弃用
*/
interface LoginReq {
    privateKeys: string;
    hashID: string;
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
 * @property hash 上传文件时ipfs返回的hash
 */
 interface ChangeNickRes extends BaseRes{
    newName: string;
 }
```



#### 4.文件上传

```
/**
*上传这块请求我是这么想的前端直接把文件传给后端不需要做什么操作，后端和合约交互把文件内容加密后上传到ipfs并返回hash
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
    var hashID = '123';  //hashID示例
    fetch('http://127.0.0.1:5000/UploadReq?hashID=' + hashID, {
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



#### 5.文件下载

```
 /**
 * @interface DownloadFileReq
 * @property fileHash 文件的ipfs上对应的hash 文件的mime类型和文件名由客户端与区块链直接交互得到
 */
  interface DownloadFileReq {
    fileHash: string;
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

#### 6.求职者简历展示

```
 /**
 * 这是一个提供给Recruiter用户查看所有ap简历的接口
 * @interface GetFileMesReq
 * @property hashID Recruiter用户身份标识
 */
  interface GetFileMesReq {
    hashID: string;
 }


 /**
 * @interface GetFileMesRes
 * @extends BaseRes
 * @property putTime 简历上传时间(从1970年1月1日00:00:00 UTC到现在的秒数)
 * @property downloadtimes 简历下载次数
 */
interface GetFileMesRes extends BaseRes {
    putTime: int;
    downloadtimes: int;
 }
```



#### 7.待授权请求查看



