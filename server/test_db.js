const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const test = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('URI:', uri);

    await mongoose.connect(uri);
    console.log('Connected!');

    const userSchema = new mongoose.Schema({ name: String });
    const User = mongoose.model('TestUser', userSchema);

    const user = new User({ name: 'Test' });
    await user.save();
    console.log('Saved!');

    const found = await User.findOne({ name: 'Test' });
    console.log('Found:', found.name);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

test();
