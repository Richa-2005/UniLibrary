

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

    //Create the new University (admin)
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