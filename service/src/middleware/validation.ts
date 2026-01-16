import Joi from "joi";

export const validateCreateUser = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    dob: Joi.date().iso().max("now").required().messages({
      "date.base": "Date of birth must be a valid date",
      "date.max": "Date of birth cannot be in the future",
      "any.required": "Date of birth is required",
    }),
    weight: Joi.number().positive().min(1).max(1000).required().messages({
      "number.base": "Weight must be a number",
      "number.positive": "Weight must be a positive number",
      "number.min": "Weight must be at least 1 kg",
      "number.max": "Weight must not exceed 1000 kg",
      "any.required": "Weight is required",
    }),
    height: Joi.number().positive().min(50).max(300).required().messages({
      "number.base": "Height must be a number",
      "number.positive": "Height must be a positive number",
      "number.min": "Height must be at least 50 cm",
      "number.max": "Height must not exceed 300 cm",
      "any.required": "Height is required",
    }),
    profile_pic: Joi.string().uri().optional().allow("").messages({
      "string.uri": "Profile picture must be a valid URL",
    }),
    profile_pic_public_id: Joi.string().optional().allow(""),
    role: Joi.string().valid("gymmer", "viewer").required().messages({
      "any.only": 'Role must be either "gymmer" or "viewer"',
      "any.required": "Role is required",
    }),
  });

  return schema.validate(data);
};

export const validateUpdateUser = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
    }),
    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address",
    }),
    dob: Joi.date().iso().max("now").optional().messages({
      "date.base": "Date of birth must be a valid date",
      "date.max": "Date of birth cannot be in the future",
    }),
    weight: Joi.number().positive().min(1).max(1000).optional().messages({
      "number.base": "Weight must be a number",
      "number.positive": "Weight must be a positive number",
      "number.min": "Weight must be at least 1 kg",
      "number.max": "Weight must not exceed 1000 kg",
    }),
    height: Joi.number().positive().min(50).max(300).optional().messages({
      "number.base": "Height must be a number",
      "number.positive": "Height must be a positive number",
      "number.min": "Height must be at least 50 cm",
      "number.max": "Height must not exceed 300 cm",
    }),
    profile_pic: Joi.string().uri().optional().allow("").messages({
      "string.uri": "Profile picture must be a valid URL",
    }),
    profile_pic_public_id: Joi.string().optional().allow(""),
    role: Joi.string().valid("gymmer", "viewer").optional().messages({
      "any.only": 'Role must be either "gymmer" or "viewer"',
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required for update",
    });

  return schema.validate(data);
};
