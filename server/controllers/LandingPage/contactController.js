import nodemailer from 'nodemailer';

export const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // 2. Validate fields (more thorough example)
  const errors = [];
  if (!firstName?.trim()) errors.push('First name is required');
  if (!lastName?.trim()) errors.push('Last name is required');
  if (!email?.trim()) errors.push('Email is required');
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Invalid email format');
  if (!message?.trim()) errors.push('Message is required');
  else if (message.trim().length < 10) errors.push('Message needs 10+ characters');

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors 
    });
  }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: email,
      to: 'brainwavebrigades@gmail.com',
      subject: `New message from ${firstName} ${lastName}`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Thanks for your message! We\'ll respond soon.'
    });

  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({
      success: false,
      message: 'Message failed to send. Please try again later.'
    });
  }
};