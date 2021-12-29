package com.airtnt.airtntapp.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.airtnt.entity.Role;
import com.airtnt.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AirtntUserDetails implements UserDetails {
    private static final long serialVersionUID = 1;
    private User user;

    public AirtntUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Role role = user.getRole();
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isStatus();
    }

    public String getFullname() {
        return this.user.getFirstName() + " " + this.user.getLastName();
    }

    public Integer getId() {
        return this.user.getId();
    }

    public String getAvatarPath() {
        return this.user.getAvatarPath();
    }

    public void setFirstName(String firstName) {
        this.user.setFirstName(firstName);
    }

    public void setLastName(String lastName) {
        this.user.setLastName(lastName);
    }

    protected boolean hasRole(String role) {
        // get security context from thread local
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_Admin"))) {
            return true;
        }

        return false;
    }
}
