package com.example.polls.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

@Entity
@Table(name = "class_dates")
public class ClassDate {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	long id;
	
	//@ManyToOne
    //private ClassSession classSession;
	
    private String location;
    private String title;
    private String date;
    private String startTime, endTime;
    private int month, year;
    private long sessionId;
    private boolean secondHour;

    public ClassDate(){
       
    }

    //public ClassSession getClassSession() {
	//	return classSession;
	//}

	//public void setClassSession(ClassSession classSession) {
	//	this.classSession = classSession;
	//}

    @PostLoad
    public void logUserLoad() {
       System.out.println("month"+date);
    }
    
	public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean hasSecondHour() {
        return secondHour;
    }

    public void setSecondHour(boolean secondHour) {
        this.secondHour = secondHour;
    }

    @PrePersist
    private void prePersistFunction(){
    	this.date = date.substring(0, 10);
    }
    
    @PreUpdate
    public void preUpdateFunction(){
    	this.date = date.substring(0, 10);
    }

    public void setDate(String date){
        this.date = date;
    }

    public String getDate() {
        return date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

	public long getSessionId() {
		return sessionId;
	}

	public void setSessionId(long sessionId) {
		this.sessionId = sessionId;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public boolean isSecondHour() {
		return secondHour;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
    
}