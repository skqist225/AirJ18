package com.airtnt.airtntapp.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import com.airtnt.entity.Role;
import com.airtnt.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1;

	private User user;
	private Collection<? extends GrantedAuthority> authorities;

	public UserDetailsImpl(User user, Collection<? extends GrantedAuthority> authorities) {
		this.user = user;
		this.authorities = authorities;
	}

	public static UserDetailsImpl build(User user) {
		Role role = user.getRole();
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

		return new UserDetailsImpl(user, authorities);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.authorities;
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

	@Override
	public int hashCode() {
		return Objects.hash(authorities, user);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UserDetailsImpl other = (UserDetailsImpl) obj;
		return Objects.equals(authorities, other.authorities) && Objects.equals(user, other.user);
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
