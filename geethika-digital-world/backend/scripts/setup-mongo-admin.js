import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function setupAdmin() {
  console.log('\n🔧 Setting up admin user in MongoDB...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'geethika_digital_world' });
    console.log('✅ MongoDB connected!\n');

    // Inline user schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      phone: String,
      role: { type: String, default: 'customer' },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geethikadigitalworld.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      await User.updateOne({ email: adminEmail }, { password: hashedPassword, role: 'admin' });
      console.log('⚠️  Admin already exists - password updated!');
    } else {
      await User.create({ name: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
      console.log('✅ Admin created successfully!');
    }

    console.log('\n🎉 Admin setup complete!');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}`);
    console.log(`   🔗 Login: http://localhost:5173/admin/login\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupAdmin();
