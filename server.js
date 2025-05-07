import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const API_URL = 'https://api.nrfcloud.com/v1/messages?deviceId=nrf-351901930761014';
const API_KEY = '2101d3d2d30f96a178fe89838b888027d7f4b836'; 

app.get('/sensor', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        const data = await response.json();
        console.log("🔎 Mensajes completos recibidos:", JSON.stringify(data, null, 2));

        // Filtrar solo los mensajes de sensores ambientales
        const sensorData = {};
        if (data.items) {
            data.items.forEach(item => {
                const message = item.message;
                if (message.appId === "TEMP") sensorData.temperature = message.data;
                if (message.appId === "HUMID") sensorData.humidity = message.data;
                if (message.appId === "AIR_PRESS") sensorData.pressure = message.data;
                if (message.appId === "AIR_QUAL") sensorData.airQuality = message.data;
                if (message.appId === "BATTERY") sensorData.battery = message.data;
            });
        }

        console.log("📌 Datos del sensor extraídos:", sensorData);
        res.json(sensorData);
    } catch (error) {
        console.error("❌ Error crítico:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/ubicacion', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        const data = await response.json();
        console.log("🔎 Mensajes completos recibidos:", JSON.stringify(data, null, 2));

        // Filtrar el mensaje que contiene la ubicación
        let locationData = {};
        if (data.items) {
            data.items.forEach(item => {
                const message = item.message;
                if (message.appId === "GROUND_FIX" && message.data.lat && message.data.lon) {
                    locationData = {
                        lat: message.data.lat,
                        lon: message.data.lon
                    };
                }
            });
        }

        console.log("📌 Coordenadas del dispositivo:", locationData);
        res.json(locationData);
    } catch (error) {
        console.error("❌ Error crítico:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Servidor backend corriendo en http://localhost:3000'));
