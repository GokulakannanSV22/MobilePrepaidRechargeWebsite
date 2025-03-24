package com.mobicomm.app.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.RechargeHistory;
import com.mobicomm.app.service.RechargeHistoryService;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5502")
@RequestMapping("/recharges")
public class RechargeHistoryController {

	@Autowired
    private  RechargeHistoryService rechargeHistoryService;

    @PostMapping
    public ResponseEntity<RechargeHistory> saveRecharge(@RequestBody RechargeHistory rechargeHistory) {
        return ResponseEntity.ok(rechargeHistoryService.saveRechargeHistory(rechargeHistory));
    }

    @GetMapping
    public ResponseEntity<List<RechargeHistory>> getAllRecharges() {
        return ResponseEntity.ok(rechargeHistoryService.getAllRecharges());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RechargeHistory>> getRechargesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(rechargeHistoryService.getRechargesByUserId(userId));
    }

    @GetMapping("/mobile/{mobileNumber}")
    public ResponseEntity<List<RechargeHistory>> getRechargesByMobile(@PathVariable Long mobileNumber) {
        return ResponseEntity.ok(rechargeHistoryService.getRechargesByMobileNumber(mobileNumber));
    }
    
    @PostMapping("/savedetails")
    public ResponseEntity<RechargeHistory> saveRechargeDetail(@RequestBody RechargeHistory savedetail)
    {
        return ResponseEntity.ok(rechargeHistoryService.saveRechargeHistory(savedetail));   
    }
    
}