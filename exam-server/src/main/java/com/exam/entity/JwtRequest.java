package com.exam.entity;

public class JwtRequest {

    String username;
    String password;


    public JwtRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public JwtRequest() {

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String email) {
        this.username = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
