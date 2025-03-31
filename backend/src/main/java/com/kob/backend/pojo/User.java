package com.kob.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Project： backend
 * @author： PONY
 * @create： 2025-03-30-22:20
 * @describe：
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private  Integer id;
    private String username;
    private  String password;



}
