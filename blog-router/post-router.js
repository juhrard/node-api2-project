const express = require("express");

const Blog = require("../data/db");

const router = express.Router();

// Middleware

// Post handlers:

// Get All posts:

router.get('/', (req, res) => {
  Blog.find(req.query)
  .then(Blog => {
    res.status(200).json(Blog);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving the posts' });
  });
});

// Get specific post:

router.get('/:id', (req, res) => {
  Blog.findById(req.params.id)
  .then(([post]) => {
    console.log(post)
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The post information could not be retrieved." });
  });
});

// Post a new post:

router.post('/', (req, res) => {
  if (req.body.title && req.body.contents){
    Blog.insert(req.body)
      .then(newPost => {
        Blog.findById(newPost.id)
          .then(([post]) => {
            if (post) {
              res.status(201).json(post);
            } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
});

// Delete a post:

router.delete('/:id', (req, res) => {
  Blog.findById(req.params.id)
    .then(post => {
      Blog.remove(req.params.id)
        .then(response => {
          if (response > 0) {
            res.status(200).json(post);
          } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
          }
        })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The post could not be removed" });
  });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post could not be found" });
    });
});

// Edit a post:

router.put('/:id', (req, res) => {
  const changes = req.body;
  console.log(changes)
    Blog.findById(req.params.id)
    .then(([post]) => {
      if (post) {
        if(changes.title && changes.contents){
          Blog.update(req.params.id, changes)
          .then(update => {
            res.status(200).json(changes);
          })

          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be modified." });
          })
        } else {
          res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post information could not be modified." });
    });
});

// Comment Routing:

// Get a specific post's comments:

router.get('/:id/comments', (req, res) => {
  Blog.findPostComments(req.params.id)
  .then(([post]) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist, or has no comments." });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The post information could not be retrieved." });
  });
});

// Add an endpoint for adding new comment to a post

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comment = { ...req.body, post_id: id };

  if(req.body.text) {
    Blog.findById(id)
      .then(([post]) => {
        if(post) {
          Blog.insertComment(comment)
            .then(inserted => {
              Blog.findCommentById(inserted.id)
                .then(comment => {
                  if (comment) {
                    res.status(201).json(comment);
                  } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                  }
                })
                .catch(error => {
                  console.log(error);
                  res.status(500).json({ error: "There was an error while saving the comment to the database" });
                })
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ error: "There was an error while saving the comment to the database" });
            })
        } else {
          console.log(error);
          res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      })
  } else {
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
  }
});

module.exports = router;