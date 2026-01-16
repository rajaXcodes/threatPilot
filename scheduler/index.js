import cron from "node-cron";
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

const WORKFLOW_URL = process.env.WORKFLOW_URL;
const API_KEY = process.env.API_KEY;

cron.schedule("*/1 * * * *", async () => {
    try {
        const executionId = `cmd - ${uuid()}`;
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 10 * 60 * 1000);

        console.log(`${startTime} - ${endTime} :: ${executionId} `)

        const prompt = `Process logs from the last 10 minutes.
                        Start time: ${startTime.toISOString()}
                        End time: ${endTime.toISOString()}
                        `.trim();

        const response = await fetch(WORKFLOW_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: API_KEY,
            },
            body: JSON.stringify({
                prompt: prompt,
            }),
        });

        const data = await response.json();

        console.log("Workflow triggered successfully:", data);
    } catch (error) {
        console.error("Failed to trigger workflow:", error);
    }
});

console.log("Cron job started: workflow will run every 10 minutes");
