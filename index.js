const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime-types");
const base64 = require("base-64");

const app = express();
app.use(bodyParser.json());

function processData(data) {
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
  const lowercaseAlphabets = data.filter((item) => /^[a-z]$/.test(item));
  const highestLowercaseAlphabet =
    lowercaseAlphabets.length > 0 ? lowercaseAlphabets.sort().pop() : null;

  return {
    numbers,
    alphabets,
    highestLowercaseAlphabet,
  };
}

function processFile(fileB64) {
  try {
    const fileBuffer = Buffer.from(fileB64, "base64");
    const mimeType = mime.lookup(fileBuffer);
    const fileSizeKb = (fileBuffer.length / 1024).toFixed(2);
    return { valid: true, mimeType, sizeKb: fileSizeKb };
  } catch (err) {
    return { valid: false, mimeType: "", sizeKb: 0 };
  }
}

app.post("/bfhl", (req, res) => {
  try {
    const { data = [], file_b64 = "" } = req.body;

    const { numbers, alphabets, highestLowercaseAlphabet } = processData(data);

    const { valid, mimeType, sizeKb } = processFile(file_b64);

    const response = {
      is_success: true,
      user_id: "john_doe_17091999",
      email: "john@xyz.com",
      roll_number: "ABCD123",
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet
        ? [highestLowercaseAlphabet]
        : [],
      file_valid: valid,
      file_mime_type: mimeType,
      file_size_kb: sizeKb,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      is_success: false,
      error: error.message,
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
