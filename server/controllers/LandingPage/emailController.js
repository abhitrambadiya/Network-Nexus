import Subscriber from '../../models/LandingPage/subscriberModel.js';
import transporter from '../../config/LandingPage/emailConfig.js';

// Changed from exports.subscribe to named export
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Attempting to send email to:", email); // Log 1

    // Save to database
    const newSubscriber = await Subscriber.create({ email });

    // Send welcome email
    await transporter.sendMail({
      from: '"Alumni Connect" brainwavebrigades@gmail.com',
      to: email,
      subject: 'Welcome to Alumni Connect!',
      html: `
        <h1>Thank You for Subscribing!</h1>
        <p>Welcome to Alumni Connect. We're excited to have you join our community.</p>
        <p>You'll now receive updates about alumni events, news, and opportunities.</p>
      `
    });

    res.status(200).json({ 
      success: true,
      data: newSubscriber
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already subscribed'
      });
    }
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Alternative if you prefer default export:
export default { subscribe };