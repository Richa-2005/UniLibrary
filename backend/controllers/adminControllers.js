import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'; // <-- ADD THIS
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
export const adminRegister = async(req,res) =>{
    try {
    const { name, adminEmail, password } = req.body;

    //if any field empty
    if (!name || !adminEmail || !password) {
      return res.status(400).json({ error: 'Please provide all fields.' });
    }

    //if admin already exists, using email as it is unique key
    const existingAdmin = await prisma.university.findUnique({
      where: { adminEmail: adminEmail },
    });

    if (existingAdmin) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    //Hash the password to be stored in database securely
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(password, salt);

    //Create the new University (admin) //query of inserting new value
    const newUniversity = await prisma.university.create({
      data: {
        name: name,
        adminEmail: adminEmail,
        adminPasswordHash: adminPasswordHash,
      },
    });

    //Send back the new university (without the password)
    res.status(201).json(newUniversity);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const loginAdmin = async(req,res) =>{
  try {
    const { adminEmail, password } = req.body;

    //Check if both inputs are there or not
    if (!adminEmail || !password) {
      return res.status(400).json({ error: 'Please provide all fields.' });
    }

    //Find the admin if exists
    const admin = await prisma.university.findUnique({
      where: { adminEmail: adminEmail },
    });
    //if not exists
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    //Check the password (exists, compare with hashed password)
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.adminPasswordHash
    );
    
    //not valid password
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    //Create and send a JWT
    const token = jwt.sign(
      { 
        universityId: admin.id, 
        email: admin.adminEmail 
      },
      process.env.JWT_SECRET,  
      { expiresIn: '1d' }      //expires in one day
    );

    //Send the token to the client
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      universityName: admin.name
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

export const checkIn = async (req, res) => {
  try {
    // Because the 'protect' middleware ran, we now have 'req.user'
    // It contains the payload from the token: { universityId: '...' }
    
    const university = await prisma.university.findUnique({
      where: { id: req.user.universityId },
      // Don't send the password back!
      select: {
        id: true,
        name: true,
        adminEmail: true
      }
    });

    res.status(200).json(university);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const registerStudentByAdmin = async (req, res) => {
  const { name, rollNumber, password } = req.body;
  const { universityId } = req.user; 

  if (!name || !rollNumber || !password) {
    return res.status(400).json({ error: 'Please provide Name, Roll Number, and Password.' });
  }

  try {
    // 1. Check if student exists IN THIS UNIVERSITY
    const existingStudent = await prisma.student.findFirst({
      where: {
        rollNumber,
        universityId
      }
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this Roll Number already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create the student linked to the Admin's University
    const newStudent = await prisma.student.create({
      data: {
        name,
        rollNumber,
        passwordHash,
        universityId
      }
    });

    res.status(201).json({ message: 'Student created successfully', student: newStudent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating student.' });
  }
};

export const getMyStudents = async (req, res) => {
  const { universityId } = req.user; // From token

  try {
    const students = await prisma.student.findMany({
      where: { universityId: universityId },
      orderBy: { name: 'asc' }, // Sort alphabetically
      select: {
        id: true,
        name: true,
        rollNumber: true,
        // Don't send back the passwordHash!
      }
    });
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
};


export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const { universityId } = req.user;

  try {
    // Security Check: Ensure student belongs to this admin
    const student = await prisma.student.findFirst({
      where: { id, universityId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await prisma.student.delete({ where: { id } });
    res.status(200).json({ message: 'Student removed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove student.' });
  }
};