package com.kob.backend.controller.pk;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Project： backend
 * @author： PONY
 * @create： 2025-03-27-13:38
 * @describe：
 */

@Controller
@RequestMapping("/pk/")
public class IndexController {

    @RequestMapping("index/")
    public String index(){
        return "pk/index.html";
    }
}
