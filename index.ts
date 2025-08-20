import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
import { createCanvas } from 'canvas';
import { CronJob } from 'cron';

dotenv.config();

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

// Every color bot
// const randomNumber = seedrandom('colorbot');
// generates a random hex color
function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + randomColor.padStart(6, '0');
}

// converts hex color to human-readable color name using Color Pizza API with fallback
async function getColorName(hex: string): Promise<string> {
  try {
    // Remove the # if present for the API call
    const cleanHex = hex.replace('#', '');

    // Call Color Pizza API
    const response = await fetch(`https://api.color.pizza/v1/?values=${cleanHex}&list=nbsIscc`);
    if (response.ok) {
      const data = await response.json();
      if (data.colors && data.colors.length > 0 && data.colors[0].name) {
        return data.colors[0].name.toLowerCase();
      }
    }
  } catch (error) {
    console.warn('Color Pizza API failed, using fallback:', error);
  }

  // Fallback to our local color naming function
  return getLocalColorName(hex);
}

// local fallback function for color naming
function getLocalColorName(hex: string): string {
  // Remove the # if present
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Calculate brightness and saturation for better color classification
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const brightness = (max + min) / 2;
  const delta = max - min;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * brightness - 1));

  // Handle grayscale colors
  if (saturation < 0.15) {
    if (brightness < 0.15) return 'blackish';
    if (brightness < 0.85) return 'grayish';
    return 'whitish';
  }

  // Determine hue-based color
  let hue = 0;
  if (delta !== 0) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    if (max === rNorm) {
      hue = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
    } else if (max === gNorm) {
      hue = ((bNorm - rNorm) / delta + 2) / 6;
    } else {
      hue = ((rNorm - gNorm) / delta + 4) / 6;
    }
  }

  // Convert hue to degrees
  const hueDegrees = hue * 360;

  // Determine color family based on hue and add "ish" suffix
  if (hueDegrees < 15 || hueDegrees >= 330) {
    return 'reddish';
  } else if (hueDegrees < 45) {
    return 'orangish';
  } else if (hueDegrees < 90) {
    return 'yellowish';
  } else if (hueDegrees < 150) {
    return 'greenish';
  } else if (hueDegrees < 180) {
    return 'teal-ish';
  } else if (hueDegrees < 240) {
    return 'bluish';
  } else if (hueDegrees < 300) {
    return 'purplish';
  } else {
    return 'pinkish';
  }
}

function createColorSquare(color: string): Buffer {
  // create a square with the color using canvas and returns it
  const canvas = createCanvas(100, 100);
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 100, 100);
  return canvas.toBuffer();
}

async function createAndPostImage() {
  const newColor = generateRandomColor();
  const colorName = await getColorName(newColor);
  const image = createColorSquare(newColor);
  console.log(newColor, '->', colorName);
  // console.log(image);

  // from https://gist.github.com/trozzelle/38ac90c5721c1fa1b6de488f8ca0eb11
  const blob = await agent.uploadBlob(image, { encoding: 'image/png' });
  await agent.post({
    text: `${newColor.toUpperCase()}`,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [{ image: blob.data.blob, alt: `a square filled in with ${colorName} color  ${newColor}.` }],
    },
  });
}

// Run this on a cron job
const scheduleExpression = '0 */3 * * *'; // Run once every three hours in prod

const job = new CronJob(scheduleExpression, createAndPostImage);

job.start();
