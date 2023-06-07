const {
  saveUser,
  findUserByEmail,
  findUserById,
} = require("../database/users");

const express = require("express");
const router = express.Router();
const z = require("zod");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/register", async (req, res) => {
  try {
    const user = userSchema.parse(req.body);

    const isEmailAlreadyUsed = await findUserByEmail(user.email);
    if (isEmailAlreadyUsed) {
      return res.status(400).json({
        message: "Email already is being used",
      });
    }
      
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
    
    const savedUser = await saveUser(user);
    delete savedUser.password;

    res.status(201).json({
      user: savedUser,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        message: err.errors,
      });
    }
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).send();

  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (!isSamePassword) return res.status(401).send();
  
  const token = jwt.sign({
      userId: user.id,
      name: user.name,
    },
    process.env.SECRET
  );

  res.json({
    success: true,
    token,
  });
});

router.get("/profile", auth, async (req, res) => {
  const user = await findUserById(req.user.userId);
  res.json({
    user,
  });
});

module.exports = router;
