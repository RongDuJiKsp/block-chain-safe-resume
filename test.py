#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json

import requests

if __name__ == '__main__':
    host = "http://47.97.255.9:6001"
    url_upload = host + "/api/v0/add"

    files = {
        'file': open(r"C:\Users\zls\Desktop\test.html", mode='rb')
    }
    response = requests.post(url_upload, files=files)
    if response.status_code == 200:
        print('上传成功！')
        data = json.loads(response.text)
        hash_code = data['Hash']
        print(hash_code)

    else:
        hash_code = None

    # 下载
    if hash_code:
        url_download = host + "/api/v0/cat"
        params = {
            'arg': hash_code
        }
        response = requests.post(url_download, params=params)
        print(response.text)