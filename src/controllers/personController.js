import {
  createPerson,
  getAllPersons,
  seedPerson,
} from "../services/personService.js";

const createPersonController = async (req, res) => {
  try {
    const person = await createPerson({
      body: req.body,
      files: req.files,
    });

    return res.status(201).json({
      success: true,
      data: person,
    });
  } catch (error) {
    console.error("Create person error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPersonsController = async (req, res) => {
  try {
    const { search } = req.query;

    const persons = await getAllPersons(search);

    return res.status(200).json({
      success: true,
      count: persons.length,
      data: persons,
    });
  } catch (error) {
    console.error("Get persons error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const seedPersonController = async (req, res) => {
  try {
    const person = await seedPerson(req.body);

    return res.status(201).json({
      success: true,
      data: person,
    });
  } catch (error) {
    console.error("Seed person error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createPersonController,
  getAllPersonsController,
  seedPersonController,
};