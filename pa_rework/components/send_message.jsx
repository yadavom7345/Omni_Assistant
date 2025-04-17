import OpenAI from "openai";

export default async function SendMessage({message, onReturn, image, pdf, pdfFileId, setPdfFileId}) {
    try {
        let requestBody;

        if (image) {
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(image);
            });

            requestBody = {
                model: "gpt-4.1",
                messages: [{
                    role: "user",
                    content: [
                        { type: "text", text: message || "Analyze this image" },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${image.type};base64,${base64Image}`
                            }
                        }
                    ]
                }]
            };
        }

        else if (pdf) {
            let fileId = pdfFileId;
            
            if (!fileId) {
                const formData = new FormData();
                formData.append('file', pdf);
                formData.append('purpose', 'user_data');

                const fileResponse = await fetch('https://api.openai.com/v1/files', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    },
                    body: formData
                });

                if (!fileResponse.ok) {
                    throw new Error(`PDF upload failed: ${fileResponse.statusText}`);
                }

                const fileData = await fileResponse.json();
                fileId = fileData.id;
                setPdfFileId(fileId);
            }

            requestBody = {
                model: "gpt-4.1",
                messages: [{
                    role: "user",
                    content: [
                        {
                            type: "file",
                            file: {
                                file_id: fileId
                            }
                        },
                        {
                            type: "text",
                            text: message || "Analyze this PDF"
                        }
                    ]
                }]
            };
        }

        else {
            requestBody = {
                model: "gpt-4.1",
                messages: [{
                    role: "user",
                    content: message || "Please provide a message"
                }]
            };
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            onReturn(data.choices[0].message.content);
        } else {
            throw new Error('Invalid response format from OpenAI');
        }
    } catch (error) {
        console.error('Error in SendMessage:', error);
        onReturn(`Error: ${error.message}`);
    }
}