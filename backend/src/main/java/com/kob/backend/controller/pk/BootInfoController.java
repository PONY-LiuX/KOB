package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

/**
 * @Project： backend
 * @author： PONY
 * @create： 2025-03-27-13:52
 * @describe：
 */

@RestController
@RequestMapping("/pk/")
public class BootInfoController {

    @RequestMapping("getBotInfo/")
    public Map<String,String> getBotInfo(){
        Map<String,String> bot1 = new HashMap<>();
        bot1.put("name","apple");
        bot1.put("rating","1500");
        return bot1;
    }
}
