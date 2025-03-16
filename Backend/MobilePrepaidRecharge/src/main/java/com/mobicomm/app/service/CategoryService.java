package com.mobicomm.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.Admin;
import com.mobicomm.app.model.Category;
import com.mobicomm.app.model.Plan;
import com.mobicomm.app.model.Status;
import com.mobicomm.app.repository.CategoryRepository;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepo;
	
	private String generateCategoryId() {
		Optional<Category> lastCategory = categoryRepo.findTopByOrderByCategoryIdDesc();

        if (lastCategory.isPresent()) {
            String lastId = lastCategory.get().getCategoryId();
            int lastNumber = Integer.parseInt(lastId.substring(6)); // Extract numeric part after "mc_pl_"
            int newNumber = lastNumber + 1;
            return String.format("mc_ct_%04d", newNumber); // Pad with leading zeros to 4 digits
        } else {
            return "mc_ct_0001"; // Initial ID with 4-digit padding
        }
	}
	
	public Category addCategory(Category category)
	{
		category.setCategoryId(generateCategoryId());
		return categoryRepo.save(category);
	}
	public List<Category> getAllCategory()
	{
		return categoryRepo.findAll();
	}
	public Category updateCategory(String categoryId,Category category)
	{
		Optional<Category> existingCategory = categoryRepo.findById(categoryId);
		if(existingCategory.isPresent())
		{
			Category updateExistingCategory = existingCategory.get();
			updateExistingCategory.setCategoryName(category.getCategoryName());
			updateExistingCategory.setCategoryDescription(category.getCategoryDescription());
			updateExistingCategory.setCategoryStatus(category.getCategoryStatus());
			updateExistingCategory.setPlans(category.getPlans());
			return categoryRepo.save(updateExistingCategory);
		}
		else
		{
			throw new RuntimeException("Category With ID: "+categoryId+" Not Found");
		}
	}
	public Category deactivateCategoryById(String categoryId)
	{
		Optional<Category> activeCategory = categoryRepo.findById(categoryId);
		if(activeCategory.isPresent())
		{
			if(activeCategory.get().getCategoryStatus() == Status.STATUS_INACTIVE)
			{
				throw new RuntimeException("Category with category id : "+ categoryId + " is already INACTIVE");
			}
			else
			{
				Category deactivateCategory = activeCategory.get();
				deactivateCategory.setCategoryStatus(Status.STATUS_INACTIVE);
				List<Plan> categoryPlans = deactivateCategory.getPlans();
				for(Plan plan : categoryPlans)
				{
					plan.setPlanStatus(Status.STATUS_INACTIVE);
				}
				return categoryRepo.save(deactivateCategory);
			}
		}
		else
		{
			throw new RuntimeException("category with category id : "+ categoryId + " Not found");
		}
	}
	public Category activateCategoryById(String categoryId)
	{
		Optional<Category> inactiveCategory = categoryRepo.findById(categoryId);
		if(inactiveCategory.isPresent())
		{
		if(inactiveCategory.get().getCategoryStatus() == Status.STATUS_ACTIVE)
		{
			throw new RuntimeException("Category with category id : " + categoryId +"is already ACTIVE");
		}
		else
		{
			Category activateCategory = inactiveCategory.get();
			activateCategory.setCategoryStatus(Status.STATUS_ACTIVE);
			List<Plan> categoryPlans = activateCategory.getPlans();
			for(Plan plan : categoryPlans)
			{
				plan.setPlanStatus(Status.STATUS_ACTIVE);
			}
			return categoryRepo.save(activateCategory);
		}
		}
		else
		{
			throw new RuntimeException("Category with category id : "+ categoryId + "  Not found");
		}
	}
	public Optional<Category> getCategoryById(String categoryId)
	{
		Optional<Category> getCategory = categoryRepo.findById(categoryId);
		if(getCategory.isPresent())
		{
			return getCategory;
		}
		else
		{
			throw new RuntimeException("Category with Category id : "+categoryId+"Not found");
		}
	}
	
}
