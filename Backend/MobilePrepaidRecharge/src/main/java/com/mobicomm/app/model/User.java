package com.mobicomm.app.model;



import jakarta.persistence.Column;
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
public class User {

	@Id
	private String userId;
	private String userName;
	@Column(unique = true)
	private String userEmail;
	@Column(unique = true)
	private Long phoneNumber;
	@Enumerated(EnumType.STRING)
	private Role role = Role.USER;
	 @PrePersist
	    public void setDefaultRole() {
	        if (this.role == null) {
	            this.role = Role.USER;
	        }
	    }
}
