import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MemeTemplate } from "./memes";
import lighthouse from '@lighthouse-web3/sdk' 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_ROUTE =
  process.env.NEXT_PUBLIC_PROD == "False" ? "http://localhost:5000" :"https://FunnyOrFud.onrender.com";

// lib/api.ts
interface MemeData {
  address: string,
  cid: string;
  templateId: string
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const createMeme = async (memeData: MemeData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_ROUTE}/api/meme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memeData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create meme");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error creating meme:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};


export const getAllMemes = async ()  => {
  try {
    const response = await fetch(`${API_ROUTE}/api/memes`);

    const data: MemeTemplate[] = await response.json();
    
    if (!response.ok) {
      throw new Error("Failed to create meme");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error creating meme:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}


export const uploadImage = async (base64: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_LIGHTHOPUSE_GATEWAY;
  const response = await lighthouse.uploadText(base64, API_KEY || "");

  return response.data.Hash;
}


export const investInTemplate = async (
    userAddress: string,
    marketId: number,
    voteYes: boolean
  ) => {
    try {
      const data = {
        userAddress,
        marketId,
        voteYes,
      };
  
      const response = await fetch(`${API_ROUTE}/api/relay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const res = await response.json();
  
      if (!response.ok) {
        throw new Error(res.message || "Failed to relay vote");
      }
  
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("Error relaying vote:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };
  

export const giveGas = async (address: string) => {
  const response = await fetch(`${API_ROUTE}/api/faucet/${address}`);

  const res = await response.json();

  console.log(res);
  
}

// Type definitions
type MimeType = string;
type Base64String = string;
type FileName = string;

interface FileReaderProgressEvent extends ProgressEvent {
  readonly target: (FileReader & EventTarget) | null;
}

// Convert base64 to Blob
const base64ToBlob = (
  base64String: Base64String, 
  mimeType: MimeType = 'application/octet-stream'
): Blob => {
  // Remove data URL prefix if present
  const base64WithoutPrefix = base64String.replace(/^data:.*,/, '');
  
  // Convert base64 to byte array
  const byteCharacters = atob(base64WithoutPrefix);
  const byteArrays: Uint8Array[] = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

// Convert base64 to File
const base64ToFile = (
  base64String: Base64String, 
  fileName: FileName, 
  mimeType: MimeType = 'application/octet-stream'
): File => {
  const blob = base64ToBlob(base64String, mimeType);
  return new File([blob], fileName, { type: mimeType });
};

// Download base64 as file
const downloadBase64File = (
  base64String: Base64String, 
  fileName: FileName, 
  mimeType: MimeType = 'application/octet-stream'
): void => {
  const blob = base64ToBlob(base64String, mimeType);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  window.URL.revokeObjectURL(url);
};

// Example usage with type checking
const exampleUsage = (): void => {
  // Example base64 string (this is just a small text file that says "Hello World")
  const base64String: Base64String = 'SGVsbG8gV29ybGQ=';
  const mimeType: MimeType = 'text/plain';
  const fileName: FileName = 'example.txt';
  
  // 1. Convert to File object
  const file: File = base64ToFile(base64String, fileName, mimeType);
  console.log('File object:', file);
  
  // 2. Convert to Blob
  const blob: Blob = base64ToBlob(base64String, mimeType);
  console.log('Blob object:', blob);
  
  // 3. Download file
  downloadBase64File(base64String, fileName, mimeType);
  
  // 4. Use with FormData (for uploading)
  const formData: FormData = new FormData();
  formData.append('file', file);
  
  // 5. Read file content with type-safe event handling
  const reader: FileReader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      console.log('File content:', e.target.result);
    }
  };
  reader.readAsText(file);
};

// Error handling with types
interface Base64Error extends Error {
  code: string;
  details?: unknown;
}

// Helper function to create typed errors
const createBase64Error = (
  message: string, 
  code: string, 
  details?: unknown
): Base64Error => {
  const error: Base64Error = new Error(message) as Base64Error;
  error.code = code;
  if (details) error.details = details;
  return error;
};

// Safe base64 conversion with error handling
export const safeBase64ToFile = (
  base64String: Base64String, 
  fileName: FileName, 
  mimeType: MimeType = 'application/octet-stream'
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      if (!base64String) {
        throw createBase64Error(
          'Base64 string is required', 
          'INVALID_INPUT'
        );
      }
      
      const file = base64ToFile(base64String, fileName, mimeType);
      resolve(file);
    } catch (error) {
      reject(createBase64Error(
        'Failed to convert base64 to file',
        'CONVERSION_ERROR',
        error
      ));
    }
  });
};