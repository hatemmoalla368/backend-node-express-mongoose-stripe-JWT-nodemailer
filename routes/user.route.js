const express = require('express');
const router = express.Router();
const User=require("../models/user")
const bcrypt = require('bcrypt')
const crypto = require('crypto');

const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware');
const authenticateToken = require('../middleware/authenticateToken ');
const {verifyToken} = require('../middleware/verifytoken');

const nodemailer=require('nodemailer');
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'hatemmoalla368@gmail.com',
    pass:'ljac eqly wbxc gtpt'
    },
    tls:{
    rejectUnauthorized:false
    }
})
// créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
    let { email, password, firstname, lastname } = req.body
    const user = await User.findOne({ email })
    if (user) return res.status(404).send({ success: false, message:"User already exists" })
    
    const newUser = new User({ email, password, firstname, lastname })
    const createdUser = await newUser.save()
    // Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
    from: '"verify your email " <hatemmoalla368@gmail.com>',
    to: newUser.email,
    subject: 'vérification your email ',
    html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
    <h4>please verify your email to procced.. </h4>
    <a
    href="http://${req.headers.host}/api/user/status/edit?email=${newUser.email}">click
    here</a>`
    }
    transporter.sendMail(mailOption,function(error,info){
    if(error){
    console.log(error)
    }
    else{
    console.log('verification email sent to your gmail account ')
    }
    })
    return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser })
    } catch (err) {
    console.log(err)
    res.status(404).send({ success: false, message: err })
    }
    });

    // afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
    try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    
    });

    /**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
    try {
    let email = req.query.email
    let user = await User.findOne({email})
    user.isActive = !user.isActive
    user.save()
    res.status(200).send({ success: true, user })
    } catch (err) {
    return res.status(404).send({ success: false, message: err })
    }
    })

    // se connecter
router.post('/login', async (req, res) => {
    try {
    let { email, password } = req.body
    
    if (!email || !password) {
    return res.status(404).send({ success: false, message: "All fields are required" })
}

let user = await User.findOne({ email})

if (!user) {

return res.status(404).send({ success: false, message: "Account doesn't exists" })

} else {

let isCorrectPassword = await bcrypt.compare(password, user.password)
if (isCorrectPassword) {

delete user._doc.password
if (!user.isActive) {
  return res.status(403).send({ success: false, message: 'Your account is inactive, Please check email' });
}  console.log("User object before generating tokens in login:", user); // Add this log

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

return res.status(200).send({ success: true, user,token,refreshToken })

} else {

return res.status(404).send({ success: false, message:"Please verify your credentials" })

}
}

} catch (err) {
return res.status(404).send({ success: false, message: err.message

})
}

});
//Access Token
const generateAccessToken = (user) => {
  /*if (!user._id) {
      console.error("User ID is not defined:", user);
      throw new Error("User ID is not defined");
  }*/
      let iduser = user.iduser; // Preserve the existing iduser if not changed
    if (typeof user._id === 'object') {
        iduser = user._id.toString();
    }

      console.log("iduser :", iduser)
  
  const payload = {
    iduser,
      firstname: user.firstname,
      lastname: user.lastname,
      isActive: user.isActive,
      email: user.email,
      role: user.role
  };
  console.log("Access Token Payload:", payload); // Log the payload
  return jwt.sign(payload, process.env.SECRET, { expiresIn: '60s' });
}

const generateRefreshToken = (user) => {
 /* if (!user._id) {
      console.error("User ID is not defined:", user);
      throw new Error("User ID is not defined");
  }*/
      let iduser = user.iduser; // Preserve the existing iduser if not changed
    if (typeof user._id === 'object') {
        iduser = user._id.toString();
    }

  console.log("iduser :", iduser)

  const payload = {
    iduser,
          firstname: user.firstname,
      lastname: user.lastname,
      isActive: user.isActive,
      email: user.email,
      role: user.role
  };
  console.log("Refresh Token Payload:", payload); // Log the payload
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
}



    //Refresh Route
router.post('/refreshToken', async (req, res, )=> {
    const refreshtoken = req.body.refreshToken;
if (!refreshtoken) {
return res.status(404).send({success: false, message: 'Token Not Found' });
}
else {
jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
if (err) { console.log(err)
return res.status(406).send({ success: false,message: 'Unauthorized' });
}
else {
  console.log("User object before generating tokens in refresh token:", user); // Add this log

  const newToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
res.status(200).send({
  success: true,
  token: newToken,
  refreshToken: newRefreshToken
});
}
});
}

});

/*router.post('/refreshToken', async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(404).send({ success: false, message: 'Token Not Found' });
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(406).send({ success: false, message: 'Unauthorized' });
      } else {
        const token = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        res.status(200).send({
          success: true,
          token,
          refreshToken: newRefreshToken,
        });
      }
    });
  }
});*/


router.put('/status/:id', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.isActive = req.body.isActive;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Change user role
  router.put('/role/:id', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.role = req.body.role;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get('/current-user', verifyToken, (req, res) => {
    // `req.user` contains the user data if authentication is successful
    res.json(req.user);
    console.log("user details", req.user)
  });

  /*router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hatemmoalla368@gmail.com',
          pass: 'ljac eqly wbxc gtpt',
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: '"reset your password " <hatemmoalla368@gmail.com>',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               http://localhost:3000/reset-password/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'Password reset email sent.' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending password reset email.' });
    }
  });

  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.json({ message: 'Password has been reset.' });
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password.' });
    }
  });*/
  router.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
        const tokenres = jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hatemmoalla368@gmail.com',
              pass: 'ljac eqly wbxc gtpt'
            }
          });
          
          var mailOptions = {
            from: 'hatemmoalla368@gmail.com',
            to: user.email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset-password/${user._id}/${tokenres}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})

router.post('/reset-password/:id/:tokenres', (req, res) => {
  const {id, tokenres} = req.params
  const {password} = req.body

  jwt.verify(tokenres, process.env.SECRET, (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with tokenres"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              User.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
      }
  })
})
    module.exports = router;