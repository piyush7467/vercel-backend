const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  // 1️⃣ Check empty fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  // 2️⃣ Name validation
  if (name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Name must be at least 3 characters long"
    });
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({
      success: false,
      message: "Name can contain only letters and spaces"
    });
  }

  // 3️⃣ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  // Normalize email
  req.body.email = email.toLowerCase().trim();

  // 4️⃣ Password validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long"
    });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least one letter and one number"
    });
  }

  next(); // ✅ Validation passed
};

module.exports = { validateSignup };
