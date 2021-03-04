package com.example.polls.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

@Entity
@Table(name = "class_sessions")
public class ClassSession {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	long id;
	
    String location;
    String startDate;
    String endDate;
    
    String title;
    String ageRange;
    String rankRange;
    String description;
    String days;
    BigDecimal price;

    public ClassSession(){

    }

    public ClassSession(String location, String startDate, String endDate) {
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    @PrePersist
    private void prePersistFunction(){
    	this.startDate = startDate.substring(0, 10);
    	this.endDate = endDate.substring(0, 10);
    }
    
    @PreUpdate
    public void preUpdateFunction(){
    	this.startDate = startDate.substring(0, 10);
    	this.endDate = endDate.substring(0, 10);
    }
    
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    
    public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAgeRange() {
		return ageRange;
	}

	public void setAgeRange(String ageRange) {
		this.ageRange = ageRange;
	}

	public String getRankRange() {
		return rankRange;
	}

	public void setRankRange(String rankRange) {
		this.rankRange = rankRange;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getDays() {
		return days;
	}

	public void setDays(String days) {
		this.days = days;
	}

	@PostLoad
	private void postLoadFunction(){
	    System.out.println("loaded class session "+this.location);
	}
}