package com.airtnt.airtntapp.host;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.json.JSONObject;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

@RestController
@RequestMapping("/become-a-host/")
public class HostRestController {

    private final String STATIC_PATH = "src/main/resources/static/room_images/";

    @Autowired
    private RoomService roomService;

    @PostMapping("upload-room-photos")
    public String uploadRoomPhotos(@ModelAttribute PhotoDTO payload)
            throws IOException {
        String uploadDir = "";

        if (payload.getRoomId() != null) {
            uploadDir = STATIC_PATH + payload.getHost() + "/" + payload.getRoomId();
            FileUploadUtil.cleanDir(uploadDir);
        } else
            uploadDir = STATIC_PATH + payload.getHost();

        for (MultipartFile multipartFile : payload.getPhotos()) {
            if (!multipartFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            }
        }

        JSONObject object = new JSONObject();
        object.put("status", "success");
        object.put("username", payload.getHost());

        return object.toString();
    }

    @PostMapping("update/upload-room-photos")
    public String updatedUploadRoomPhotos(
            @ModelAttribute PhotoDTO payload) throws IOException {
        String uploadDir = STATIC_PATH + payload.getHost() + "/" + payload.getRoomId();
        FileUploadUtil.cleanDir(uploadDir);

        Set<Image> newImages = new HashSet<>();
        for (MultipartFile multipartFile : payload.getPhotos()) {
            if (!multipartFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                newImages.add(new Image(fileName));
                FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            }
        }
        // do not assign new set // get new set and push it to old set
        Room room = roomService.getRoomById(Integer.parseInt(payload.getRoomId()));
        room.getImages().clear();
        for (Image i : newImages) {
            room.getImages().add(i);
        }

        try {
            roomService.save(room);
            return new JSONObject().put("status", "success").toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return new JSONObject().put("status", "fail").toString();
    }

    @PostMapping("get-upload-photos")
    public String getUploadPhoto(@ModelAttribute GetPhoto payload) {
        String userName = payload.getUsername();
        String[] roomImages = payload.getRoomImages();

        String uploadDir = "";

        if (payload.getFolderno() != null) {
            uploadDir = STATIC_PATH + userName + "/" + payload.getFolderno();
        } else
            uploadDir = STATIC_PATH + userName;

        List<MultipartFile> multipartFiles = new ArrayList<>();

        String contentType = "text/plain";
        Path path = Paths.get(uploadDir);
        for (String image : roomImages) {
            Path fullPath = path.resolve(image);
            String originalFileName = image;
            String fileName = image;

            byte[] content = null;
            try {
                content = Files.readAllBytes(fullPath);
                MultipartFile result = new MockMultipartFile(fileName, originalFileName, contentType, content);
                multipartFiles.add(result);
            } catch (final IOException e) {
            }
        }
        JSONObject object = new JSONObject();
        object.put("status", "success");
        object.put("roomImages", multipartFiles);

        return object.toString();
    }
}
