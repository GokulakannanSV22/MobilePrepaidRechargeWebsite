package com.mobicomm.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Admin {

	@Id
	private String adminId;
	private String email;
	private String password;
	@Enumerated(EnumType.STRING)
	private Role role;
	
	 @PrePersist
	    public void setDefaultRole() {
	        if (this.role == null) {
	            this.role = Role.ADMIN;
	        }
	    }
}
