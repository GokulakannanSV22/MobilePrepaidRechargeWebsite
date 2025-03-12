package com.mobicomm.app.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Category {

	@Id
	private String categoryId;
	private String categoryName;
	private String categoryDescription;
	
	@Enumerated(EnumType.STRING)
	private Status categoryStatus;
	
	@JsonIgnore
	@OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
	List<Plan> plans;
}
