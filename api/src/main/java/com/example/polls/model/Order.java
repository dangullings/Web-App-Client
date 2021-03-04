package com.example.polls.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
	
	@ManyToOne
	private Student student;
    
    private String firstName;
    private String lastName;
    private LocalDate date;
    private BigDecimal salePrice;
    private String note;
    private boolean isComplete;

    public Order(){

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setDate(java.sql.Date date){
        this.date = date.toLocalDate();
    }

    public void setDate(LocalDate date){
        this.date = date;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNote() { return note; }

    public void setNote(String note) { this.note = note; }

    public boolean isComplete() { return isComplete; }

    public void setComplete(boolean complete) { isComplete = complete; }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

}