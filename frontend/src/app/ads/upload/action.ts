'use server';
import { exec } from 'child_process';
import util from 'util'; 
import { promises as fs } from 'fs';
import path from 'path';
import getVideoDurationInSeconds from 'get-video-duration';
import { Readable } from 'stream';
import { ReadableStream } from 'node:stream/web';
import { promises as fsPromises } from 'fs';

const uploadsDir = path.join(process.cwd(), 'public', 'ads');

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
  return `/ads/${fileName}`;
};

const execPromise = util.promisify(exec);

export const getVideoDuration = async (filePath: string): Promise<number> => {
  const filePath3 = path.join(uploadsDir, filePath);
  try {
    
    await fsPromises.access(filePath3, fs.constants.R_OK);
  } catch (err) {
    throw new Error('File does not exist'); 
  }

  // Construct the ffprobe command to get the duration
  const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath3}"`;

  try {
      const { stdout } = await execPromise(command);
      const durationInSeconds = parseFloat(stdout);
      return durationInSeconds;
  } catch (error) {
      console.error('Error executing ffprobe:', error);
      throw new Error('Error calculating video duration');
  }
};