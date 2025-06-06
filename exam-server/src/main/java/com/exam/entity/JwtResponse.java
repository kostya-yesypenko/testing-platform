package com.exam.entity;

import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
	
	private UserDetails user;
    private String token;

    
    public JwtResponse() {
    }

}
