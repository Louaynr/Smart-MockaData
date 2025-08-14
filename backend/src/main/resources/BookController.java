package com.smartmockdata.api.controller;

import com.smartmockdata.api.model.Book;
import com.smartmockdata.api.repository.BookRepository;
import com.smartmockdata.api.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/books")
public class BookController {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        // If categoryId is provided, set the category
        if (book.getCategory() != null && book.getCategory().getId() != null) {
            categoryRepository.findById(book.getCategory().getId())
                    .ifPresent(book::setCategory);
        }
        
        Book savedBook = bookRepository.save(book);
        return ResponseEntity.ok(savedBook);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        book.setId(id);
        
        // If categoryId is provided, set the category
        if (book.getCategory() != null && book.getCategory().getId() != null) {
            categoryRepository.findById(book.getCategory().getId())
                    .ifPresent(book::setCategory);
        }
        
        Book updatedBook = bookRepository.save(book);
        return ResponseEntity.ok(updatedBook);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam(required = false) String title,
                                                  @RequestParam(required = false) String author) {
        List<Book> books;
        if (title != null && !title.isEmpty()) {
            books = bookRepository.findByTitleContainingIgnoreCase(title);
        } else if (author != null && !author.isEmpty()) {
            books = bookRepository.findByAuthorContainingIgnoreCase(author);
        } else {
            books = bookRepository.findAll();
        }
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/search/query")
    public ResponseEntity<List<Book>> searchBooksByQuery(@RequestParam String q) {
        List<Book> books = bookRepository.searchBooks(q);
        return ResponseEntity.ok(books);
    }
} 