package com.mobicomm.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.UserPlanDetail;
import com.mobicomm.app.repository.UserPlanDetailRepository;

@Service
public class UserPlanDetailService {

	@Autowired
    private  UserPlanDetailRepository userPlanDetailRepository;

    public UserPlanDetail saveUserPlanDetail(UserPlanDetail userPlanDetail) {
        return userPlanDetailRepository.save(userPlanDetail);
    }

    public List<UserPlanDetail> getAllUserPlans() {
        return userPlanDetailRepository.findAll();
    }

    public List<UserPlanDetail> getUserPlansByUserId(String userId) {
        return userPlanDetailRepository.findByUserId(userId);
    }
}
