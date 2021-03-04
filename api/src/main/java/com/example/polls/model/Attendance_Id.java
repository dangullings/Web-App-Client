package com.example.polls.model;

import java.io.Serializable;

import javax.persistence.Id;

public class Attendance_Id implements Serializable {

	private long classDateId;
	
    private long studentId;
 
    public Attendance_Id() {
		
	}

	public long getClassDateId() {
		return classDateId;
	}

	public void setClassDateId(long classDateId) {
		this.classDateId = classDateId;
	}

	public long getStudentId() {
		return studentId;
	}

	public void setStudentId(long studentId) {
		this.studentId = studentId;
	}
 
}