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
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
  const image = createColorSquare(newColor);
  console.log(newColor);
  // console.log(image);

  // from https://gist.github.com/trozzelle/38ac90c5721c1fa1b6de488f8ca0eb11
  const blob = await agent.uploadBlob(image, { encoding: 'image/png' });
  await agent.post({
    text: `${newColor}`,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [{ image: blob.data.blob, alt: `a square filled with the color ${newColor}.` }],
    },
  });
}

// Run this on a cron job
const scheduleExpression = '0 */3 * * *'; // Run once every three hours in prod

const job = new CronJob(scheduleExpression, createAndPostImage);

job.start();
