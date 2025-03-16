package com.mobicomm.app.controller;

import com.mobicomm.app.model.Admin;
import com.mobicomm.app.repository.AdminRepository;
import com.mobicomm.app.security.JwtUtil;
import com.mobicomm.app.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*") // ✅ Allows frontend to access API
public class AdminController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepository;

    // ✅ LOGIN: Authenticate admin and return JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails adminDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(adminDetails.getUsername(), 60); // ✅ Token valid for 60 minutes

        return ResponseEntity.ok(Map.of("token", token));
    }

    // ✅ REGISTER: Create new admin
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin newAdmin) {
        Optional<Admin> existingAdmin = adminService.getAdminByEmail(newAdmin.getEmail());
        if (existingAdmin.isPresent()) {
            return ResponseEntity.badRequest().body("Admin with this email already exists!");
        }

        Admin savedAdmin = adminService.saveAdmin(newAdmin);
        return ResponseEntity.ok(savedAdmin);
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<?> getAdminDetails(@PathVariable String adminId) {
        Optional<Admin> admin = adminService.getAdminById(adminId);

        if (admin.isPresent()) {
            return ResponseEntity.ok(admin.get()); // ✅ Returns ResponseEntity<Admin>
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found"); // ✅ Returns ResponseEntity<String>
        }
    }

}
