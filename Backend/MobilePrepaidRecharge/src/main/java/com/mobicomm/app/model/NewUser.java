package com.mobicomm.app.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

@Entity
public class NewUser {
	@Id
	private String newUserId;
	private String userName;
	private Date dateOfBirth;
	@Column(unique = true)
	private Long phoneNumber;
	@Column(unique = true)
	private String email;
	@Enumerated(EnumType.STRING)
	private RequestType userRequest;
	@Enumerated(EnumType.STRING)
	private NewUserStatus newUserStatus;
	@Enumerated(EnumType.STRING)
	private Role role = Role.NEW_USER;
}
