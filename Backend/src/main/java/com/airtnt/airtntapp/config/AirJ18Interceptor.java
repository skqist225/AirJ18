package com.airtnt.airtntapp.config;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.airtnt.airtntapp.cookie.CookieProcess;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.User;

// import org.apache.tomcat.util.http.fileupload.RequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AirJ18Interceptor implements HandlerInterceptor {
    @Autowired
    private CookieProcess cookieProcess;

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object object) throws Exception {
        // Cookie[] cookies = request.getCookies();
        // String cookie = null;
        // User user = null;
        // if (cookies != null)
        // for (Cookie c : cookies) {
        // if (c.getName().equals("user")) {
        // System.out.println(c.getValue());
        // cookie = c.getValue();
        // // break;
        // }
        // }

        // String userEmail = cookieProcess.readCookie(cookie);
        // user = userService.getByEmail(userEmail);
        // // user = authenticate.getLoggedInUser(cookie);
        // // System.out.println(user.toString());

        // System.out.println("is user != null" + user);
        // if (user == null) {
        // // ObjectMapper mapper = new ObjectMapper();
        // // StandardJSONResponse<String> standardJSONResponse = new
        // // StandardJSONResponse<String>();
        // // standardJSONResponse.setData(null);
        // // standardJSONResponse.setError(new ErrorJSONResponse(401, "user not
        // // authenticated"));
        // // standardJSONResponse.setSuccess(false);

        // //
        // response.getWriter().print(mapper.writeValueAsString(standardJSONResponse));
        // // response.getWriter().print("asd");
        // // response.setStatus(401);
        // // response.setContentType("application/json; charset=UTF-8");
        // // return reject()
        // return false;
        // }
        // // request.getServletContext().setAttribute("user", user);

        return true;
    }
}
