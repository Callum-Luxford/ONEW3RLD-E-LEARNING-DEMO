// const mongoose = require("mongoose");
// const Course = require("./server/models/Course"); // Adjust path if needed

// // Replace with your actual DB URI
// const MONGO_URI =
//   "mongodb+srv://rsa-demo:TheBoathouse2024@onew3rld-rsa-demo.2zjwbh0.mongodb.net/";

// async function lockCourses() {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Match by course titles or _ids as needed
//     const filter = {
//       "title.en": {
//         $in: [
//           "Workplace Harassment Prevention (UAE-WHP)",
//           "UAE Fire Safety & Emergency Response (UAE-FSR)",
//         ],
//       },
//     };

//     const update = {
//       $set: { locked: true },
//     };

//     const result = await Course.updateMany(filter, update);

//     console.log(`Locked ${result.modifiedCount} course(s).`);
//   } catch (err) {
//     console.error("Error updating courses:", err);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// lockCourses();
