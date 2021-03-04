package com.example.polls;

import java.util.ArrayList;
import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

@SpringBootApplication
@EntityScan(basePackageClasses = { 
		PollsApplication.class,
		Jsr310JpaConverters.class 
})
public class PollsApplication {

	public static ArrayList<String> Ranks = new ArrayList<String>();
	
	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}

	public static void main(String[] args) {
		createRankArray();
		SpringApplication.run(PollsApplication.class, args);
	}
	
	private static void createRankArray(){
        Ranks.add("Gold Stripe");
        Ranks.add("Gold Belt");
        Ranks.add("Green Stripe");
        Ranks.add("Green Belt");
        Ranks.add("Purple Stripe");
        Ranks.add("Purple Belt");
        Ranks.add("Brown Stripe");
        Ranks.add("Brown Belt");
        Ranks.add("Red Stripe");
        Ranks.add("Red Belt");
        Ranks.add("1st Degree");
        Ranks.add("1st of 2nd");
        Ranks.add("2nd Degree");
        Ranks.add("1st of 3rd");
        Ranks.add("2nd of 3rd");
        Ranks.add("3rd Degree");
        Ranks.add("1st of 4th");
        Ranks.add("2nd of 4th");
        Ranks.add("3rd of 4th");
        Ranks.add("4th Degree");
        Ranks.add("1st of 5th");
        Ranks.add("2nd of 5th");
        Ranks.add("3rd of 5th");
        Ranks.add("4th of 5th");
        Ranks.add("5th Degree");
    }
}