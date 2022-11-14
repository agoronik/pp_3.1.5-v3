package manager.mywebappspringboot.repository;

import manager.mywebappspringboot.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmail(String email);

    @Query("select u from User u join fetch u.roles where u.email = :email")
    Optional<User> findUserByEmail(String email);
}
