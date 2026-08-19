/**
 * BACKEND-ONLY way to add people — no frontend form involved.
 *
 * 1. Put logo image files somewhere on disk (e.g. your React app's src/Assets).
 * 2. Edit scripts/peopleData.js — add a person, with one or more companies,
 *    each pointing at a logoPath (filename relative to ASSETS_PATH).
 * 3. Set ASSETS_PATH in your .env to the folder those logoPaths are relative to.
 * 4. Run:  node scripts/addPeople.js
 *
 * Safe to re-run — people already in the database (matched by name) are skipped,
 * so you can keep adding new entries to the bottom of peopleData.js over time
 * and just re-run this script.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Person = require('../models/Person');
const people = require('./peopleData');

const ASSETS_PATH = process.env.ASSETS_PATH;

async function run() {
  if (!ASSETS_PATH) {
    console.error('Set ASSETS_PATH in .env to the folder your logoPaths are relative to.');
    process.exit(1);
  }
  if (!fs.existsSync(ASSETS_PATH)) {
    console.error(`ASSETS_PATH not found: ${ASSETS_PATH}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.\n');

  let created = 0, skipped = 0, failed = 0;

  for (const entry of people) {
    const exists = await Person.findOne({ name: entry.name });
    if (exists) {
      console.log(`SKIP (already exists): ${entry.name}`);
      skipped++;
      continue;
    }

    try {
      const companies = [];

      for (const c of entry.companies) {
        const filePath = path.join(ASSETS_PATH, c.logoPath);
        if (!fs.existsSync(filePath)) {
          throw new Error(`missing logo file: ${c.logoPath}`);
        }

        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'business-portfolio',
        });

        companies.push({
          companyName: c.companyName,
          category: c.category,
          keywords: c.keywords || [],
          logoUrl: uploadResult.secure_url,
          logoPublicId: uploadResult.public_id,
        });
      }

      await Person.create({
        name: entry.name,
        phone: entry.phone || undefined,
        email: entry.email || undefined,
        companies,
      });

      console.log(`Added: ${entry.name} (${companies.length} compan${companies.length === 1 ? 'y' : 'ies'})`);
      created++;
    } catch (err) {
      console.error(`FAILED: ${entry.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
  process.exit(0);
}

run();
