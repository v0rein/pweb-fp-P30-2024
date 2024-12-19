import { Request, Response } from "express";
import { User } from "../models/home.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Login = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    var { username, password, role } = user;

    const isUserAlreadyExist = await User.findOne({
      username: username,
    });
    if (!isUserAlreadyExist) {
      res.status(400).json({
        status: 400,
        message: "User has not Registered yet",
      });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserAlreadyExist.password
    );
    if (!isPasswordMatched) {
      res.status(401).json({
        // 400 Code means Bad Request
        status: 401,
        message: "Wrong Password",
      });
      return;
    }

    const isRoleMatched = isUserAlreadyExist.role === role;
    if (!isRoleMatched) {
      res.status(401).json({
        status: 401,
        message: "Wrong Role",
      });
      return;
    }

    const token = jwt.sign(
      { _id: isUserAlreadyExist?._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    isUserAlreadyExist.tokens.push({ token });
    await isUserAlreadyExist.save();

    // send the response
    res.status(200).json({
      status: 200,
      success: true,
      message: "login success",
      token: token,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};
