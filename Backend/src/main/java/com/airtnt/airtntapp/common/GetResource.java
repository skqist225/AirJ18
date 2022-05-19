package com.airtnt.airtntapp.common;

import java.io.FileNotFoundException;

import org.springframework.util.ResourceUtils;

public class GetResource {
    public static String getResourceAsFile(String relativeFilePath) throws FileNotFoundException {
        return ResourceUtils.getURL("classpath:" + relativeFilePath).getFile();
    }
}
