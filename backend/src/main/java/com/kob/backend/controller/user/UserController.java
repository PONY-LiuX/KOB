package com.kob.backend.controller.user;

import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Project： backend
 * @author： PONY
 * @create： 2025-03-30-22:11
 * @describe：
 */
@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    @GetMapping("/user/all")
    public List<User> getAll(){
        return userMapper.selectList(null);
    }
    @GetMapping("/user/{userId}")
    public User getUser(@PathVariable int userId){
        return userMapper.selectById(userId);
    }

    @GetMapping("/user/add/{userId}/{username}/{passwd}")
    public String addUser(
            @PathVariable int userId,
            @PathVariable String username,
            @PathVariable String passwd
    ){
        if(passwd.length() < 6){
            return "密码太短";
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodePassword = passwordEncoder.encode(passwd);
        User user = new User(userId,username,encodePassword);
        userMapper.insert(user);
        return "Successful!!";
    }

    @GetMapping("/user/delete/{userId}")
    public String deleteUser(@PathVariable int userId){

        userMapper.deleteById(userId);
        return "Delete successfully";
    }
}
