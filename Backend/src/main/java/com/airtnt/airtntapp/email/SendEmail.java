package com.airtnt.airtntapp.email;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class SendEmail {
    private static final String username = "thuan.leminhthuan.10.2@gmail.com";
    private static final String password = "tqgxcudjgljrhztj";
    private static final String smtpServer = "smtp.gmail.com";

    public static void send(String receipt, String subject, String msg) throws AddressException, MessagingException {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        // properties.put("mail.smtp.starttls.enable", "true"); #587
        properties.put("mail.smtp.ssl.enable", "true"); // #465
        properties.put("mail.smtp.host", smtpServer);
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.ssl.trust", smtpServer);
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        session.setDebug(true);
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receipt));
        message.setSubject(subject);

        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);

        message.setContent(multipart);

        Transport.send(message);
    }
}
