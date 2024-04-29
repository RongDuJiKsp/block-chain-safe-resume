package com.xtu.leotan.safecv.watermark;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@ConfigurationProperties(prefix = "webase")
@Component
@Getter
@Setter
public class WeBaseConfiguration {

    private Integer groupId = 1;
    private String url = "http://localhost:5001/WeBASE-Node-Manager/transaction/transInfo/";;

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
