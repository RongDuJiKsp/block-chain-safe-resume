package com.xtu.leotan.safecv.ipfs;

import io.ipfs.api.IPFS;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class IpfsConfig {

    @Value("${ipfs.multiaddr}")
    private String multiaddr;

    @Bean
    public IPFS ipfs() throws IOException {
        IPFS ipfs = new IPFS(multiaddr);
        ipfs.refs.local();
        return ipfs; // 这里需要替换为你的IPFS节点的地址
    }
}
