const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Person = require('../models/Person');

// Streams a file buffer to Cloudinary and resolves with the upload result
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'business-portfolio' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * POST /api/person
 * multipart/form-data:
 *   name            text
 *   phone           text
 *   email           text (optional)
 *   companies       text — JSON string, e.g.
 *                   '[{"companyName":"The Shooting Spot","keywords":"Photography, Films"},
 *                     {"companyName":"V Zone Photography","keywords":"Weddings"}]'
 *   logos           file[] — one image per company, SAME ORDER as the companies array
 *
 * One person can have 1..N companies; send N files under "logos" for N companies.
 */
exports.createPerson = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }

    if (!req.body.companies) {
      return res.status(400).json({ success: false, message: 'companies is required (JSON array)' });
    }

    let companiesInput;
    try {
      companiesInput = JSON.parse(req.body.companies);
    } catch {
      return res.status(400).json({ success: false, message: 'companies must be valid JSON' });
    }

    if (!Array.isArray(companiesInput) || companiesInput.length === 0) {
      return res.status(400).json({ success: false, message: 'companies must be a non-empty array' });
    }

    const files = req.files || [];
    if (files.length !== companiesInput.length) {
      return res.status(400).json({
        success: false,
        message: `Expected ${companiesInput.length} logo file(s) (one per company) but received ${files.length}`,
      });
    }

    // Upload every logo to Cloudinary in parallel, matched by array index to its company
    const uploadResults = await Promise.all(files.map((f) => streamUpload(f.buffer)));

    const companies = companiesInput.map((c, i) => ({
      companyName: c.companyName,
      category: c.category,
      keywords: Array.isArray(c.keywords)
        ? c.keywords
        : String(c.keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      logoUrl: uploadResults[i].secure_url,
      logoPublicId: uploadResults[i].public_id,
    }));

    const person = await Person.create({ name, phone, email, companies });

    res.status(201).json({ success: true, data: person });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/person   ?search=keyword
 * Returns every person with their full companies array.
 * `search` matches against person name, company name, or any keyword.
 */
exports.getAllPersons = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: regex },
          { 'companies.companyName': regex },
          { 'companies.keywords': regex },
        ],
      };
    }

    const persons = await Person.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: persons.length, data: persons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedPerson = async (req, res) => {
  try {
    const person = await Person.create(req.body);

    res.status(201).json({
      success: true,
      data: person,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
