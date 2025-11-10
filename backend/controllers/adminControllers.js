import jwt from 'jsonwebtoken';

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