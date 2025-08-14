package com.smartmockdata.api.config;

import com.smartmockdata.api.model.Book;
import com.smartmockdata.api.model.Category;
import com.smartmockdata.api.model.User;
import com.smartmockdata.api.repository.BookRepository;
import com.smartmockdata.api.repository.CategoryRepository;
import com.smartmockdata.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        if (userRepository.count() == 0) {
            User adminUser = new User("admin", "admin@example.com", passwordEncoder.encode("admin123"));
            adminUser.setRole(User.Role.ADMIN);
            userRepository.save(adminUser);

            User regularUser = new User("user", "user@example.com", passwordEncoder.encode("user123"));
            userRepository.save(regularUser);
        }

        // Create sample categories
        if (categoryRepository.count() == 0) {
            Category fiction = new Category("Fiction");
            fiction.setDescription("Fictional literature and novels");
            categoryRepository.save(fiction);

            Category nonFiction = new Category("Non-Fiction");
            nonFiction.setDescription("Non-fictional books and educational content");
            categoryRepository.save(nonFiction);

            Category science = new Category("Science");
            science.setDescription("Scientific books and research");
            categoryRepository.save(science);
        }

        // Create sample books
        if (bookRepository.count() == 0) {
            Category fiction = categoryRepository.findByName("Fiction").orElse(null);
            Category nonFiction = categoryRepository.findByName("Non-Fiction").orElse(null);

            if (fiction != null) {
                Book book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald");
                book1.setDescription("A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.");
                book1.setCategory(fiction);
                book1.setPublished(true);
                bookRepository.save(book1);

                Book book2 = new Book("To Kill a Mockingbird", "Harper Lee");
                book2.setDescription("The story of young Scout Finch and her father Atticus in a racially divided Alabama town.");
                book2.setCategory(fiction);
                book2.setPublished(true);
                bookRepository.save(book2);
            }

            if (nonFiction != null) {
                Book book3 = new Book("Sapiens", "Yuval Noah Harari");
                book3.setDescription("A brief history of humankind from ancient humans to the present day.");
                book3.setCategory(nonFiction);
                book3.setPublished(true);
                bookRepository.save(book3);
            }
        }
    }
} 