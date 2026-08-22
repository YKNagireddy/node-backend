import streamifier from "streamifier";
import cloudinary from "../models/config/cloudinary.js";
import Person from "../models/personModel.js";

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "business-portfolio",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const createPerson = async ({ body, files }) => {
  try {
    const { name, phone, email } = body;

    if (!name || !name.trim()) {
      throw new Error("name is required");
    }

    if (!body.companies) {
      throw new Error("companies is required (JSON array)");
    }

    let companiesInput;

    try {
      companiesInput = JSON.parse(body.companies);
    } catch {
      throw new Error("companies must be valid JSON");
    }

    if (!Array.isArray(companiesInput) || companiesInput.length === 0) {
      throw new Error("companies must be a non-empty array");
    }

    const uploadedFiles = files || [];

    if (uploadedFiles.length !== companiesInput.length) {
      throw new Error(
        `Expected ${companiesInput.length} logo file(s) (one per company) but received ${uploadedFiles.length}`
      );
    }

    const uploadResults = await Promise.all(
      uploadedFiles.map((file) => streamUpload(file.buffer))
    );

    const companies = companiesInput.map((company, index) => ({
      companyName: company.companyName,
      category: company.category,

      keywords: Array.isArray(company.keywords)
        ? company.keywords
        : String(company.keywords || "")
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),

      logoUrl: uploadResults[index].secure_url,
      logoPublicId: uploadResults[index].public_id,
    }));

    const person = await Person.create({
      name,
      phone,
      email,
      companies,
    });

    return person;
  } catch (error) {
    throw error;
  }
};

const getAllPersons = async (search) => {
  try {
    let query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");

      query = {
        $or: [
          { name: regex },
          { "companies.companyName": regex },
          { "companies.keywords": regex },
        ],
      };
    }

    const persons = await Person.find(query).sort({
      createdAt: -1,
    });

    return persons;
  } catch (error) {
    throw error;
  }
};

const seedPerson = async (data) => {
  try {
    const person = await Person.create(data);

    return person;
  } catch (error) {
    throw error;
  }
};

export {
  createPerson,
  getAllPersons,
  seedPerson,
};