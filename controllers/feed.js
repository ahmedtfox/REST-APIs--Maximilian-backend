const express = require("express");

exports.getPosts = (req, res, next) => {
  const posts = [
    {
      _id: "44455sd5sjyjyjsdsds",
      title: "First Post",
      content: "This is the first post!",
      imageUrl: "images/77.jpg",
      creator: {
        name: "ahmed",
      },
      createdAt: new Date(),
    },
  ];
  res.status(200).json(posts);
};
exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const postCreated = [
    {
      _id: new Date().toISOString(),
      title,
      content,
      imageUrl: "images/77.jpg",
      creator: {
        name: "ahmed",
      },
      createdAt: new Date(),
    },
  ];

  res.status(201).json({
    message: "post created successfully!",
    post: postCreated,
  });
};
