package com.airtnt.airtntapp.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDTO {
	private int resetPasswordCode;
	private String email;
	private String newPassword;
	private String confirmNewPassword;
}
