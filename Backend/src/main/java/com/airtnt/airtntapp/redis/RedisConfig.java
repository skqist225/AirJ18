package com.airtnt.airtntapp.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
// import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
// import org.springframework.data.redis.core.RedisTemplate;
// import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
// import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
// import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.lambdaworks.redis.RedisClient;
import com.lambdaworks.redis.RedisConnection;
import com.lambdaworks.redis.RedisURI;

@Configuration
// @EnableRedisRepositories
public class RedisConfig {

    @Bean
    public RedisClient connectionFactory() {
        RedisClient redisClient = new RedisClient(RedisURI.create("redis://@localhost:6379"));
        // RedisConnection<String, Object> connection = redisClient.connect();
        return redisClient;
    }

    // @Bean
    // public RedisConnection<String, Object> redisTemplate() {

    // // RedisTemplate<String, Object> template = new RedisTemplate<>();
    // // template.setConnectionFactory(connectionFactory());
    // // template.setKeySerializer(new StringRedisSerializer());
    // // template.setHashKeySerializer(new StringRedisSerializer());
    // // template.setHashKeySerializer(new JdkSerializationRedisSerializer());
    // // template.setValueSerializer(new JdkSerializationRedisSerializer());
    // template.setEnableTransactionSupport(true);
    // template.afterPropertiesSet();
    // return template;
    // }
}