import Joi from "joi";
import { Request, Response, NextFunction } from "express";

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

export const validateCreateSet = (data: any) => {
  const schema = Joi.object({
    user_id: Joi.number().positive().required().messages({
      "number.base": "User ID must be a number",
      "number.positive": "User ID must be positive",
      "any.required": "User ID is required",
    }),
    workout_session_id: Joi.number().positive().optional().messages({
      "number.base": "Workout session ID must be a number",
      "number.positive": "Workout session ID must be positive",
    }),
    set_number: Joi.number().positive().required().messages({
      "number.base": "Set number must be a number",
      "number.positive": "Set number must be positive",
      "any.required": "Set number is required",
    }),
    set_type: Joi.string()
      .valid("normal", "dropset", "superset")
      .required()
      .messages({
        "any.only": 'Set type must be "normal", "dropset", or "superset"',
        "any.required": "Set type is required",
      }),
    exercise_id: Joi.number().positive().required().messages({
      "number.base": "Exercise ID must be a number",
      "number.positive": "Exercise ID must be positive",
      "any.required": "Exercise ID is required",
    }),
    superset_exercise_id: Joi.number()
      .positive()
      .when("set_type", {
        is: "superset",
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        "number.base": "Superset exercise ID must be a number",
        "number.positive": "Superset exercise ID must be positive",
        "any.required": "Superset exercise ID is required for supersets",
        "any.unknown":
          "Superset exercise ID should not be provided for non-superset types",
      }),
    weight: Joi.object({
      primary: Joi.number().positive().required().messages({
        "number.base": "Primary weight must be a number",
        "number.positive": "Primary weight must be positive",
        "any.required": "Primary weight is required",
      }),
      secondary: Joi.number()
        .positive()
        .when("...set_type", {
          is: "superset",
          then: Joi.required(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.base": "Secondary weight must be a number",
          "number.positive": "Secondary weight must be positive",
          "any.required": "Secondary weight is required for supersets",
          "any.unknown":
            "Secondary weight should not be provided for non-superset types",
        }),
    })
      .required()
      .messages({
        "any.required": "Weight information is required",
      }),
    reps: Joi.object({
      primary: Joi.number().positive().required().messages({
        "number.base": "Primary reps must be a number",
        "number.positive": "Primary reps must be positive",
        "any.required": "Primary reps is required",
      }),
      secondary: Joi.number()
        .positive()
        .when("...set_type", {
          is: "superset",
          then: Joi.required(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.base": "Secondary reps must be a number",
          "number.positive": "Secondary reps must be positive",
          "any.required": "Secondary reps is required for supersets",
          "any.unknown":
            "Secondary reps should not be provided for non-superset types",
        }),
    })
      .required()
      .messages({
        "any.required": "Reps information is required",
      }),
    drop_weight: Joi.number()
      .positive()
      .when("set_type", {
        is: "dropset",
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        "number.base": "Drop weight must be a number",
        "number.positive": "Drop weight must be positive",
        "any.unknown": "Drop weight should only be provided for dropsets",
      }),
    drop_reps: Joi.number()
      .positive()
      .when("set_type", {
        is: "dropset",
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        "number.base": "Drop reps must be a number",
        "number.positive": "Drop reps must be positive",
        "any.unknown": "Drop reps should only be provided for dropsets",
      }),
    note: Joi.string().max(500).optional().messages({
      "string.max": "Note must not exceed 500 characters",
    }),
    completed: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

export const validateUpdateSet = (data: any) => {
  const schema = Joi.object({
    workout_session_id: Joi.number().positive().optional().messages({
      "number.base": "Workout session ID must be a number",
      "number.positive": "Workout session ID must be positive",
    }),
    set_number: Joi.number().positive().optional().messages({
      "number.base": "Set number must be a number",
      "number.positive": "Set number must be positive",
    }),
    set_type: Joi.string()
      .valid("normal", "dropset", "superset")
      .optional()
      .messages({
        "any.only": 'Set type must be "normal", "dropset", or "superset"',
      }),
    exercise_id: Joi.number().positive().optional().messages({
      "number.base": "Exercise ID must be a number",
      "number.positive": "Exercise ID must be positive",
    }),
    superset_exercise_id: Joi.number().positive().optional().messages({
      "number.base": "Superset exercise ID must be a number",
      "number.positive": "Superset exercise ID must be positive",
    }),
    weight: Joi.object({
      primary: Joi.number().positive().optional().messages({
        "number.base": "Primary weight must be a number",
        "number.positive": "Primary weight must be positive",
      }),
      secondary: Joi.number().positive().optional().messages({
        "number.base": "Secondary weight must be a number",
        "number.positive": "Secondary weight must be positive",
      }),
    }).optional(),
    reps: Joi.object({
      primary: Joi.number().positive().optional().messages({
        "number.base": "Primary reps must be a number",
        "number.positive": "Primary reps must be positive",
      }),
      secondary: Joi.number().positive().optional().messages({
        "number.base": "Secondary reps must be a number",
        "number.positive": "Secondary reps must be positive",
      }),
    }).optional(),
    drop_weight: Joi.number().positive().optional().messages({
      "number.base": "Drop weight must be a number",
      "number.positive": "Drop weight must be positive",
    }),
    drop_reps: Joi.number().positive().optional().messages({
      "number.base": "Drop reps must be a number",
      "number.positive": "Drop reps must be positive",
    }),
    note: Joi.string().max(500).optional().messages({
      "string.max": "Note must not exceed 500 characters",
    }),
    completed: Joi.boolean().optional(),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required for update",
    });

  return schema.validate(data);
};

// Middleware functions for sets validation
export const validateCreateSetMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateCreateSet(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
      data: null,
    });
  }

  next();
};

export const validateUpdateSetMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateUpdateSet(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
      data: null,
    });
  }

  next();
};

export const validateBulkCreateSetsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sets } = req.body;

  if (!Array.isArray(sets) || sets.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Sets array is required and cannot be empty",
      data: null,
    });
  }

  const errors: { index: number; errors: string[] }[] = [];

  sets.forEach((set: any, index: number) => {
    const { error } = validateCreateSet(set);
    if (error) {
      errors.push({
        index,
        errors: error.details.map((detail) => detail.message),
      });
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation errors found in sets array",
      errors,
      data: null,
    });
  }

  next();
};
