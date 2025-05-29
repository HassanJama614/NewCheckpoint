// app.js

// 1. Installing and setting up Mongoose:
// ---------------------------------------
// Require mongoose and dotenv
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env file

// Get the MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// 2. Create a person with this prototype:
// ---------------------------------------
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 0
  },
  favoriteFoods: {
    type: [String],
    default: []
  }
});

// Create the Person model from the schema
const Person = mongoose.model('Person', personSchema);


// --- Database Operation Functions (using async/await) ---

// 3. Create and Save a Record of a Model:
const createAndSavePerson = async () => {
  try {
    const person = new Person({
      name: "John Doe",
      age: 30,
      favoriteFoods: ["Pizza", "Sushi"]
    });
    const data = await person.save();
    console.log("Person saved successfully (John Doe):", data);
    return data; // Return the saved person document
  } catch (err) {
    console.error("Error saving person (John Doe):", err);
    throw err; // Re-throw to be caught by the main try/catch if needed
  }
};

// 4. Create Many Records with model.create()
const createManyPeople = async () => {
  try {
    const arrayOfPeople = [
      { name: "Jane Doe", age: 28, favoriteFoods: ["Pasta", "Salad"] },
      { name: "Mike Ross", age: 25, favoriteFoods: ["Burritos", "Tacos", "Pizza"] },
      { name: "Mary Poppins", age: 35, favoriteFoods: ["Spoonful of Sugar", "Tea"] },
      { name: "Peter Parker", age: 18, favoriteFoods: ["Pizza", "Hot Dogs", "Burritos"] }
    ];
    const people = await Person.create(arrayOfPeople);
    console.log("Many people created successfully:", people);
    return people;
  } catch (err) {
    console.error("Error creating many people:", err);
    throw err;
  }
};

// 5. Use model.find() to Search Your Database
const findPeopleByName = async (personName) => {
  try {
    const peopleFound = await Person.find({ name: personName });
    console.log(`People named "${personName}":`, peopleFound);
    return peopleFound;
  } catch (err) {
    console.error(`Error finding people named ${personName}:`, err);
    throw err;
  }
};

// 6. Use model.findOne() to Return a Single Matching Document
const findOnePersonByFood = async (food) => {
  try {
    const personFound = await Person.findOne({ favoriteFoods: food });
    if (personFound) {
      console.log(`Person who likes ${food}:`, personFound);
    } else {
      console.log(`No person found who likes ${food}.`);
    }
    return personFound;
  } catch (err) {
    console.error(`Error finding person who likes ${food}:`, err);
    throw err;
  }
};

// 7. Use model.findById() to Search Your Database By _id
const findPersonById = async (personId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      console.error("Invalid personId format provided.");
      return null; // Or throw an error
    }
    const personFound = await Person.findById(personId);
    if (personFound) {
      console.log(`Person with ID ${personId}:`, personFound);
    } else {
      console.log(`No person found with ID ${personId}.`);
    }
    return personFound;
  } catch (err) {
    console.error(`Error finding person with ID ${personId}:`, err);
    throw err;
  }
};

// 8. Perform Classic Updates by Running Find, Edit, then Save
const performClassicUpdate = async (personId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      console.error("Invalid personId format for classic update.");
      return null;
    }
    const person = await Person.findById(personId);
    if (!person) {
      console.log(`No person found with ID ${personId} to update (classic).`);
      return null;
    }
    person.favoriteFoods.push("Hamburger");
    const updatedPerson = await person.save(); // save() returns the updated document
    console.log("Person updated (classic method):", updatedPerson);
    return updatedPerson;
  } catch (err) {
    console.error(`Error in classic update (ID: ${personId}):`, err);
    throw err;
  }
};

// 9. Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdatePersonAge = async (personName, newAge) => {
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },   // Search criteria
      { age: newAge },        // Update to apply
      { new: true }           // Options: return the updated document
    );
    if (updatedPerson) {
      console.log(`"${personName}"'s age updated to ${newAge}:`, updatedPerson);
    } else {
      console.log(`No person named "${personName}" found to update age.`);
    }
    return updatedPerson;
  } catch (err) {
    console.error(`Error finding and updating age for ${personName}:`, err);
    throw err;
  }
};

// 10. Delete One Document Using model.findByIdAndRemove (or findByIdAndDelete)
const removePersonById = async (personId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      console.error("Invalid personId format for removal.");
      return null;
    }
    // findByIdAndDelete is generally preferred over findByIdAndRemove
    const removedPerson = await Person.findByIdAndDelete(personId);
    if (removedPerson) {
      console.log("Person removed successfully by ID:", removedPerson);
    } else {
      console.log(`No person found with ID ${personId} to remove.`);
    }
    return removedPerson;
  } catch (err) {
    console.error(`Error removing person with ID ${personId}:`, err);
    throw err;
  }
};

// 11. MongoDB and Mongoose - Delete Many Documents with model.remove() (Using modern deleteMany)
const removeManyPeopleByName = async (nameToRemove) => {
  try {
    // Model.remove() is deprecated. Using Model.deleteMany() as per modern Mongoose.
    const result = await Person.deleteMany({ name: nameToRemove });
    console.log(`Result of removing people named "${nameToRemove}":`, result);
    // result will contain { acknowledged: true, deletedCount: X }
    return result;
  } catch (err) {
    console.error(`Error removing people named "${nameToRemove}":`, err);
    throw err;
  }
};

// 12. Chain Search Query Helpers to Narrow Search Results
const chainQueryHelpersForBurritoLovers = async () => {
  try {
    const data = await Person.find({ favoriteFoods: "Burritos" })
      .sort({ name: 1 })        // Sort by name ascending
      .limit(2)                 // Limit to 2 results
      .select({ age: 0 })       // Exclude the age field (or '-age')
      .exec();                  // Execute the query
    console.log("Burrito lovers (sorted, limited, age hidden):", data);
    return data;
  } catch (err) {
    console.error("Error chaining query helpers for burrito lovers:", err);
    throw err;
  }
};


// --- Main Function to Run Database Operations ---
const runDatabaseOperations = async () => {
  try {
    // Connect to MongoDB
    // Note: useNewUrlParser and useUnifiedTopology are deprecated and can be removed
    // if using Mongoose 6+ with MongoDB Node.js Driver 4.0+.
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB Atlas!');

    // --- Clean up previous data (optional, for repeatable testing) ---
    // console.log("Cleaning up previous Person data...");
    // await Person.deleteMany({}); // Deletes all documents in the Person collection
    // console.log("Cleanup complete.");

    // --- CREATE Operations ---
    const john = await createAndSavePerson(); // Creates "John Doe"
    await createManyPeople();                 // Creates Jane, Mike, Mary, Peter

    // --- READ (FIND) Operations ---
    if (john) {
      await findPeopleByName(john.name);
    }
    await findPeopleByName("NonExistent Name"); // Test finding non-existent
    await findOnePersonByFood("Pizza");
    await findOnePersonByFood("Avocado"); // Test finding food no one likes (yet)

    let personToTestById;
    const jane = await Person.findOne({ name: "Jane Doe" });
    if (jane) {
      personToTestById = jane._id.toString(); // Get ID for later tests
      await findPersonById(personToTestById);
    } else {
      console.log("Jane Doe not found for ID-based tests.");
    }
    await findPersonById("123456789012345678901234"); // Test with an invalid format ID (if not caught earlier) or non-existent valid ID

    // --- UPDATE Operations ---
    if (personToTestById) {
      await performClassicUpdate(personToTestById); // Adds "Hamburger" to Jane's food
    }
    await findAndUpdatePersonAge("Mike Ross", 26); // Updates Mike's age
    await findAndUpdatePersonAge("NonExistent Person", 99); // Test updating non-existent

    // --- DELETE Operations ---
    const peter = await Person.findOne({ name: "Peter Parker" });
    if (peter) {
      await removePersonById(peter._id);
    } else {
      console.log("Peter Parker not found for removal by ID test.");
    }
    await removeManyPeopleByName("Mary Poppins"); // Should remove one Mary

    // --- CHAINED QUERY ---
    await chainQueryHelpersForBurritoLovers();

    console.log("\nAll operations attempted. Check logs for details.");

  } catch (error) {
    // This catches errors from mongoose.connect or any re-thrown errors from the operation functions
    console.error("A major error occurred in runDatabaseOperations:", error);
  } finally {
    // Optional: Disconnect Mongoose when all operations are done, especially for scripts
    try {
      await mongoose.disconnect();
      console.log("\nDisconnected from MongoDB.");
    } catch (disconnectError) {
      console.error("Error disconnecting from MongoDB:", disconnectError);
    }
  }
};

// --- Execute the main function ---
if (!mongoURI) {
  console.error("MONGO_URI is not defined. Please check your .env file.");
} else {
  runDatabaseOperations();
}