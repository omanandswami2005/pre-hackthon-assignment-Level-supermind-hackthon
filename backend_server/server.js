const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const process = require('process');
require('dotenv').config();

class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Send a POST request to the given endpoint with the given body.
     *
     * @param {string} endpoint - The endpoint to send the request to.
     * @param {Object} body - The body of the request.
     * @param {Object} [headers={ "Content-Type": "application/json" }] - The headers for the request.
     * @returns {Promise<Object>} - A promise that resolves with the JSON response from the server.
     * @throws {Error} - If there is an error with the request.

/******  32569dd7-a807-4526-b78c-ad97c77d0a6a  *******/    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = (event) => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener('close', () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

const app = express();
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST'],
    }
));
app.use(bodyParser.json());

const PORT = 3000|| process.env.PORT;
const flowIdOrName = '49c12f1b-80f3-45b4-9f8f-e6eb0dd3ed55';
const langflowId = '90ee7bfa-450b-4ba0-97c8-d755b85fbbf2';
const applicationToken = process.env.LANGFLOW_APPLICATION_TOKEN;

const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken);

// Endpoint to run the flow
app.post('/runFlow', async (req, res) => {
    const { inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {} } = req.body;
    console.log('Input:', inputValue);

    try {
        const response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            inputValue,
            inputType,
            outputType,
            tweaks,
            stream,
            (data) => console.log('Received:', data.chunk), // onUpdate
            (message) => console.log('Stream Closed:', message), // onClose
            (error) => console.error('Stream Error:', error) // onError
        );

        if (!stream && response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            console.log('Output:', output);

            res.status(200).json({ message: output.message.text });
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    console.log('Health Check');
    res.send('Hello, World! Techies, Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
