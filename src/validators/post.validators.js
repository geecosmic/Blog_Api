import { body } from "express-validator";

const allowedStatus = ["draft", "published"];

export const createPostValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage("Status must be draft or published"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),
];

export const updatePostValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage("Status must be draft or published"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),
];
