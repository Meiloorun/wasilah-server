const User = require("../models/userModel");
const Group = require("../models/groupModel");
const bcrypt = require("bcrypt");


module.exports.register = async (req,res,next) => {
    try {
        const{firstname, secondname, email, password, aimsid, phonenumber, dateofbirth, jamaat, gender, publicSignedPreKey, oneTimePreKey, identityPubKey, registrationId} = req.body;
        const aimsidCheck = await User.findOne({ aimsid });
        if (aimsidCheck){
            return res.json({msg: "Member with this AIMS ID already added", status: false});
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck){
            return res.json({msg: "Email already used", status: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            firstname: firstname,
            secondname: secondname,
            email: email,
            password: hashedPassword,
            aimsid: aimsid,
            phonenumber: phonenumber,
            dateofbirth: dateofbirth,
            jamaat: jamaat,
            gender: gender,
            registration: {
                registrationId: registrationId,
                identityPubKey: identityPubKey,
                publicSignedPreKey: publicSignedPreKey,
                oneTimePreKey: oneTimePreKey,
            }
        });

        
        const jamaatGroup = await Group.findOne({ jamaat: jamaat });

        if (jamaatGroup) {
            jamaatGroup.members.push(user._id);
            await jamaatGroup.save();
        }

        delete user.password;
        return res.json({status: true, user})
    } catch (error) {
        next(error);
    };
};

module.exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user){
            return res.json({ msg: "Incorrect Username or Password", status: false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }
        delete user.password;
        return res.json({ status:true, user });
    } catch (error) {
        next(error);
    }
};

module.exports.allcontacts = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.params.id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const usersInSameJamaat = await User.find({
            _id: { $ne: req.params.id },
            jamaat: currentUser.jamaat, 
        }).select([
            "email",
            "firstname",
            "secondname",
            "_id",
            "phonenumber",
            "registration",
        ]);

        return res.json(usersInSameJamaat);
    } catch (error) {
        next(error);
    }
};
