package manager.mywebappspringboot.controller;

import manager.mywebappspringboot.model.User;
import manager.mywebappspringboot.repository.RoleRepository;
import manager.mywebappspringboot.repository.UserRepository;
import manager.mywebappspringboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class ApiController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/all")
    @ResponseBody
    public List<User> allUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<User> findUserById(@PathVariable(value = "id") long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()) {
            return ResponseEntity.ok().body(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public String delete(@PathVariable(value = "id") long id) {
        userRepository.deleteById(id);
        return "ok";
    }

    @PutMapping("/{id}")
    @ResponseBody
    public String saveUser(@Validated @RequestBody User user, @PathVariable(value = "id") long id) {
        user.setId(id);
        userRepository.save(user);
        return "ok";
    }

    @PostMapping("")
    @ResponseBody
    public ResponseEntity newUser(@Validated @RequestBody User user) {
        userRepository.save(user);
        //return "ok";
        return ResponseEntity.ok("User is valid");
    }
}
