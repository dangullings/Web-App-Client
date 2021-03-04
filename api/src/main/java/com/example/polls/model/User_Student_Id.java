package com.example.polls.model;

import java.io.Serializable;

import javax.persistence.Id;

public class User_Student_Id implements Serializable {

	private long userId;
	
    private long studentId;
 
    public User_Student_Id() {
		
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getStudentId() {
		return studentId;
	}

	public void setStudentId(long studentId) {
		this.studentId = studentId;
	}
 
}