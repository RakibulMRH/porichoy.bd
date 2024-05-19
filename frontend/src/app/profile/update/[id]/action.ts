'use server';

import { promises as fs } from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'dps');

export const uploadToCloudinary = async (formData: FormData) => {
  const file = formData.get('image') as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create the uploads directory if it doesn't exist
  await fs.mkdir(uploadsDir, { recursive: true });

  // Generate a unique filename for the uploaded file
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  // Write the file to the uploads directory
  await fs.writeFile(filePath, buffer);

  // Return the relative path to the uploaded file
  return `/dps/${fileName}`;
};