import { User } from "../model/user.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, gender, phone, age, password, answer } =
      req.body;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !gender ||
      !phone ||
      !age ||
      !password ||
      !answer
    ) return res.status(400).json({ message: "All fields are required!" });

    const existedEmail = await User.findOne({ email })
    const existedPhone = await User.findOne({ phone })


    if (existedEmail) return res.status(400).json({ success: false, message: "Email is  already exists " });
    if (existedPhone) return res.status(400).json({ success: false, message: "Phone number is  already exists " });


    const user = await User.create({
      first_name,
      last_name,
      email,
      gender,
      phone,
      age,
      password,
      answer
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "Registration Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required!" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid data!" });
    const comperePassword = await bcrypt.compare(password, user.password);

    if (!comperePassword) return res.status(400).json({ message: "Invalid data!" });
    const token = await user.generateJWTToken()
    res.status(200).json({
      success: true,
      token,
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }
};


const profile = async (req, res) => {
  const id = req.id
  const user = await User.findById(id)
  console.log(user);
  res.status(200).json({
    success: true,
    message: "LoggedIn",
    user,
  })
};

const forgetPassword = async (req, res) => {

  const { email, answer, password } = req.body
  const user = await User.findOne({ email })
  if (!answer || !password) return res.status(400).json({ message: "Answer required!" });
  console.log(user);
  if (answer !== user?.answer) return res.status(400).json({ message: "Invalid  Answer " });

  user.password = password
  await user.save()
  res.status(201).json({
    success: true,
    message: 'Password reset successfull..!',
    user
  })

}

const updateProfile = async (req, res) => {
  try {

    const id = req.id

    if (!id) return res.status(400).json({ message: "User Not Login" })
    const user = await User.findById(id)

    if (!user) return res.status(400).json({ message: "User Not exist" })

    
    const { first_name, last_name, gender, phone, age, answer } = req.body;
    const existingPhone = await User.findOne({phone:phone})
    console.log(existingPhone)

    if (existingPhone && phone !== user.phone) return res.status(400).json({ message: "Phone number is  already exists" })
    
    user.first_name = first_name || user.first_name
    user.last_name = last_name || user.last_name
    user.gender = gender || user.gender
    user.phone = phone || user.phone
    user.age = age || user.age
    user.answer = answer || user.answer

    await user.save()
    res.status(201).json({
      success: true,
      message: 'Profile Upadate Successfully!',
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error,
    });
  }


}

export { register, login, profile, forgetPassword, updateProfile };
