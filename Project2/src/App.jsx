import React, { useState } from "react";
import jsQR from "jsqr";
import QRCode from "qrcode";

export default function App() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [scanResult, setScanResult] = useState("");

  // Generate QR
  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Download QR
  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "qr-code.png";
    link.click();
  };

  // Scan QR from uploaded image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) setScanResult(code.data);
      else setScanResult("No QR code found");
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        QR Code Generator & Scanner
      </h1>

      {/* QR Generator */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mb-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />
        <button
          onClick={generateQR}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Generate
        </button>

        {qrDataUrl && (
          <>
            <img src={qrDataUrl} alt="QR Code" className="mx-auto mb-2" />
            <button
              onClick={downloadQR}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Download QR
            </button>
          </>
        )}
      </div>

      {/* QR Scanner */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {scanResult && (
          <p className="text-green-600 font-medium break-words">
            ✅ Scanned Result: {scanResult}
          </p>
        )}
      </div>
    </div>
  );
}
