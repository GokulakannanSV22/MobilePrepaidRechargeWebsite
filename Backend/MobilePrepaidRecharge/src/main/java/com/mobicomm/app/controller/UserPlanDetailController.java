package com.mobicomm.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.UserPlanDetail;
import com.mobicomm.app.service.UserPlanDetailService;

@RestController
@RequestMapping("/user-plans")
public class UserPlanDetailController {

	@Autowired
    private  UserPlanDetailService userPlanDetailService;

    @PostMapping
    public ResponseEntity<UserPlanDetail> saveUserPlan(@RequestBody UserPlanDetail userPlanDetail) {
        return ResponseEntity.ok(userPlanDetailService.saveUserPlanDetail(userPlanDetail));
    }

    @GetMapping
    public ResponseEntity<List<UserPlanDetail>> getAllUserPlans() {
        return ResponseEntity.ok(userPlanDetailService.getAllUserPlans());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserPlanDetail>> getUserPlans(@PathVariable String userId) {
        return ResponseEntity.ok(userPlanDetailService.getUserPlansByUserId(userId));
    }
}
