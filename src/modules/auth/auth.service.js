const { hashPassword, comparePassword } = require("../../utils/security");
const { generateToken } = require("../../utils/jwt");
const { compare } = require("bcrypt");

const {
  findRoleByName,
  createUser,
  findUserByEmail,
  findUserAuthByEmail,
  findUserProfileById,
} = require("../auth/auth.repository.js");

const {
  cleanName,
  normalizeEmail,
  normalizeMiddleInitial,
  validateContactNumber,
  cleanRoleName,
} = require("../../utils/helper.js");

async function registerAuthService(userData) {
  const {
    first_name,
    middle_initial,
    last_name,
    display_name,
    password,
    contact_number,
    email,
    role_name,
  } = userData;

  const firstName = cleanName(first_name);
  const middleInitial = middle_initial
    ? normalizeMiddleInitial(middle_initial)
    : null;
  const lastName = cleanName(last_name);
  const displayName = display_name ? cleanName(display_name) : null;
  const emailAdd = normalizeEmail(email);

  if (!firstName || !lastName || !password || !emailAdd || !role_name) {
    return {
      success: false,
      code: "MISSING_REQUIRED_FIELDS",
      message: "All required fields must be provided.",
    };
  }

  if (contact_number) {
    const isValidContactNumber = validateContactNumber(contact_number);
    if (!isValidContactNumber) {
      return {
        success: false,
        code: "INVALID_CONTACT_NUMBER",
        message:
          "Contact number must start with +639 followed by 9 digits (e.g., +639123456789).",
      };
    }
  }

  const existingUser = await findUserByEmail(emailAdd);
  if (existingUser) {
    return {
      success: false,
      code: "DUPLICATE_EMAIL",
      message: "Email already in use.",
    };
  }

  const validRoleName = cleanRoleName(role_name);
  if (!validRoleName) {
    return {
      success: false,
      code: "INVALID_ROLE",
      message: `The role "${role_name}" is not valid. Please provide a valid role name or seed default roles (Admin, Driver, Passenger).`,
    };
  }

  const existingRole = await findRoleByName(validRoleName);
  if (!existingRole) {
    return {
      success: false,
      code: "DEFAULT_ROLE_NOT_FOUND",
      message: `The role "${role_name}" does not exist. Please seed default roles (Admin, Driver, Passenger) or create this role before assigning it.`,
    };
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      code: "INVALID_PASSWORD",
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    };
  }

  const password_hash = await hashPassword(password);

  const user = await createUser({
    role_id: existingRole.role_id,
    first_name: firstName,
    middle_initial: middleInitial,
    last_name: lastName,
    display_name: displayName,
    password_hash,
    email: emailAdd,
    contact_number,
  });

  return {
    success: true,
    message: "User registered successfully",
    data: {
      user_id: user.user_id,
      email: user.email,
      role: existingRole.role_name,
    },
  };
}

async function loginAuthService(userData) {
  const { email, password } = userData;

  const emailAdd = normalizeEmail(email);

  if (!emailAdd || !password) {
    return {
      success: false,
      code: "VALIDATION_ERROR",
      message: "Please enter required fields.",
    };
  }

  const user = await findUserAuthByEmail(emailAdd);
  if (!user) {
    return {
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    };
  }

  const validPassword = await comparePassword(password, user.password_hash);
  if (!validPassword) {
    return {
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    };
  }

  if (user && user.is_active === false) {
    return {
      success: false,
      code: "ACCOUNT_INACTIVE",
      message: "Account must be disalbled or inactive.",
    };
  }
  const token = generateToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
  });

  console.log("generated token:", token);

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      token,
    },
  };
}

async function getMeService(user_id) {
  const user = await findUserProfileById(user_id);
  if (!user) {
    return {
      succes: false,
      code: "USER_NOT_FOUND",
      message: "Authenticated user not found.",
    };
  }

  if (user && user.isactive == false) {
    return {
      success: false,
      code: "ACCOUNT_INACTIVE",
      message: "User is deactivated",
    };
  }

  return {
    success: true,
    code: "FETCH_ME_SUCCESS",
    message: "User profile retrieved successfully",
    data: user,
  };
}

module.exports = { registerAuthService, loginAuthService, getMeService };
