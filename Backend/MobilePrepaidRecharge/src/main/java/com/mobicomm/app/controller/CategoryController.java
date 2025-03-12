package com.mobicomm.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.Category;
import com.mobicomm.app.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	   private CategoryService categoryService;
	
	  @PostMapping
	    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
	        return ResponseEntity.ok(categoryService.addCategory(category));
	    }
	  
	  @GetMapping
	  public ResponseEntity<List<Category>> getAllCategories() {
	  	List<Category> allCategories = categoryService.getAllCategory();
	  	
	  	if(allCategories.isEmpty())
	  	{
	  		return new ResponseEntity<List<Category>>(HttpStatus.NO_CONTENT);
	  	}
	  	else
	  	{
	  		return new ResponseEntity<List<Category>>(allCategories,HttpStatus.OK);
	  	}
	  }
	  
	  @PutMapping("/{categoryId}")
	  public ResponseEntity<Category> putMethodName(@PathVariable String id, @RequestBody Category category) {
	  	//TODO: process PUT request
	  	Category updateExistingCategory = categoryService.updateCategory(id, category);
	  	if(updateExistingCategory != null)
	  	{
	  		return new ResponseEntity<Category>(updateExistingCategory,HttpStatus.OK);
	  	}
	  	else
	  	{
	  		return new ResponseEntity<Category>(HttpStatus.NOT_FOUND);
	  	}
	  }
	  
}
