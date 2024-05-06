const Jamaat = require('../models/jamaatModel');
const Region = require('../models/regionModel');
const Group = require('../models/groupModel');
const Role = require('../models/roleModel');
const Channel = require('../models/channelModel');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/Wasilah", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to Wasilah Database");
}).catch((err) => {
  console.log(`Failed to connect to Wasilah Database: ${err.message}`);
});

async function seedDatabase() {
  try {
    await Region.deleteMany({});
    await Jamaat.deleteMany({});
    await Group.deleteMany({});
    await Role.deleteMany({});
    await Channel.deleteMany({});

    const RegionData = [
      { name: 'Baitul Ehsan' },
      { name: 'Baitul Futuh' },
      { name: 'Baitun Noor' },
      { name: 'Bashir' },
      { name: 'Darul Amaan' },
      { name: 'East' },
      { name: 'East Midlands' },
      { name: 'Fazl Mosque' },
      { name: 'Hertfordshire' },
      { name: 'Mahmood' },
      { name: 'Masroor' },
      { name: 'Middlesex' },
      { name: 'Muqami' },
      { name: 'Nasir' },
      { name: 'North East' },
      { name: 'North West' },
      { name: 'Scotland' },
      { name: 'Shareef' },
      { name: 'South' },
      { name: 'South West' },
      { name: 'Tahir' },
      { name: 'Yorkshire' },
    ];

    const regions = await Region.create(RegionData);

    const JamaatData = [
      { name: 'Aldershot North', region: regions[12]._id },
      { name: 'Aldershot South', region: regions[12]._id },
      { name: 'Islamabad', region: regions[12]._id },
      { name: 'Ash', region: regions[12]._id },
      { name: 'Farnham', region: regions[12]._id },
      { name: 'Bordon', region: regions[12]._id },
    ];

    regions.forEach((region) => {
      const regionJamaats = [
        { name: `${region.name} Central`, region: region._id },
        { name: `${region.name} North`, region: region._id },
        { name: `${region.name} South`, region: region._id },
        { name: `${region.name} East`, region: region._id },
        { name: `${region.name} West`, region: region._id },
      ];
      JamaatData.push(...regionJamaats);
    });

    const jamaats = await Jamaat.create(JamaatData);

    const GroupData = jamaats.map((jamaat) => ({
      name: `${jamaat.name} Group`,
      jamaat: jamaat._id,
      region: jamaat.region,
    }));

    const groups = await Group.create(GroupData);

    const roleNames = [
      'Qaid',
      'Naib Qaid',
      'Nazim Tabligh',
      'Nazim Ishaat',
      'Nazim Tarbiyyat',
      'Nazim Waqar-e-Amal',
      'Nazim Amoor-e-Tulaba',
    ];

    const RoleData = groups.flatMap((group) =>
      roleNames.map((roleName) => ({
        name: roleName,
        group: group._id,
      }))
    );

    const roles = await Role.create(RoleData);

    const ChannelData = groups.flatMap((group) => [
      {
        name: 'amila',
        group: group._id,
        roles: roles.filter((role) => role.group.equals(group._id)).map((role) => role._id),
      },
      {
        name: 'general',
        group: group._id,
        roles: [],
      },
    ]);

    const channels = await Channel.create(ChannelData);

    const groupUpdates = groups.map((group) => ({
      updateOne: {
        filter: { _id: group._id },
        update: {
          $set: {
            channels: channels
              .filter((channel) => channel.group.equals(group._id))
              .map((channel) => channel._id),
            roles: roles.filter((role) => role.group.equals(group._id)).map((role) => role._id),
          },
        },
      },
    }));

    await Group.bulkWrite(groupUpdates);

    console.log('Database seeded successfully');
  } catch (error) {
    console.log('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();