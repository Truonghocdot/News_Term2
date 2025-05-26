package news.app.rss.controller;

import news.app.rss.entity.HistoricWatched;
import news.app.rss.service.HistoricWatchedService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historic-watched")
public class HistoricWatchedController {

    private final HistoricWatchedService service;

    public HistoricWatchedController(HistoricWatchedService service) {
        this.service = service;
    }

    @GetMapping
    public List<HistoricWatched> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public HistoricWatched getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @PostMapping
    public HistoricWatched create(@RequestBody HistoricWatched hw) {
        return service.create(hw);
    }

    @PutMapping("/{id}")
    public HistoricWatched update(@PathVariable Long id, @RequestBody HistoricWatched hw) {
        return service.update(id, hw);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<HistoricWatched> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    @GetMapping("/post/{postId}")
    public List<HistoricWatched> getByPostId(@PathVariable Long postId) {
        return service.getByPostId(postId);
    }
}