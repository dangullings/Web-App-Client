package com.example.polls.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.PostLoad;
import javax.persistence.Table;

@Entity
@Table(name = "attendance")
@IdClass(Attendance_Id.class)
public class Attendance {
	
	@Id
    private long classDateId;
	
	@Id
    private long studentId;
	
    private boolean firstHour;
    private boolean secondHour;
    
    public Attendance() {
    	
    }
    
	public Attendance(long classDateId, long studentId, boolean firstHour, boolean secondHour) {
		super();
		this.classDateId = classDateId;
		this.studentId = studentId;
		this.firstHour = firstHour;
		this.secondHour = secondHour;
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
	public boolean isFirstHour() {
		return firstHour;
	}
	public void setFirstHour(boolean firstHour) {
		this.firstHour = firstHour;
	}
	public boolean isSecondHour() {
		return secondHour;
	}
	public void setSecondHour(boolean secondHour) {
		this.secondHour = secondHour;
	}
    
}
