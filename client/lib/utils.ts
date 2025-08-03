import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MemeTemplate } from "./memes";
import lighthouse from '@lighthouse-web3/sdk' 
import { parseEther } from "ethers";
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from "@/config/wagmiConfig";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/ethers";

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

// FIXED: Enhanced investInTemplate with proper type handling and error management
export const investInTemplate = async (
  userAddress: string,
  marketId: number,
  voteYes: boolean
): Promise<ApiResponse> => {
  try {
    console.log(`User ${userAddress} voting ${voteYes ? 'Funny' : 'Lame'} on market ${marketId}`);

    // Validate inputs
    if (!userAddress || !userAddress.startsWith('0x')) {
      throw new Error('Invalid user address');
    }

    if (marketId < 0 || !Number.isInteger(marketId)) {
      throw new Error('Invalid market ID');
    }

    // IMPORTANT: User pays 0.0001 XTZ directly via MetaMask
    const voteCost = parseEther("0.0001"); // 0.0001 XTZ

    // Type assertion to fix wagmi config compatibility
    const wagmiConfig = config as any;

    // Show MetaMask popup for user to pay
    const hash = await writeContract(wagmiConfig, {
      address: DEPLOYED_CONTRACT as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'vote',
      args: [userAddress as `0x${string}`, BigInt(marketId), voteYes],
      value: voteCost, // This triggers MetaMask payment popup
    });

    console.log("Vote transaction submitted:", hash);

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: hash,
    });

    console.log("Vote confirmed:", receipt);

    return {
      success: true,
      data: {
        transactionHash: hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        status: receipt.status
      },
    };
  } catch (error) {
    console.error("Error voting:", error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      // Handle specific wagmi/MetaMask errors
      if (error.message.includes('User rejected') || 
          error.message.includes('rejected') ||
          error.message.includes('denied')) {
        return {
          success: false,
          error: "Payment cancelled by user",
        };
      }
      
      if (error.message.includes('insufficient funds') ||
          error.message.includes('insufficient balance')) {
        return {
          success: false,
          error: "Insufficient balance to complete transaction",
        };
      }
      
      if (error.message.includes('network') ||
          error.message.includes('connection')) {
        return {
          success: false,
          error: "Network connection error. Please try again.",
        };
      }
      
      if (error.message.includes('nonce')) {
        return {
          success: false,
          error: "Transaction nonce error. Please refresh and try again.",
        };
      }
      
      // Handle contract-specific errors
      if (error.message.includes('execution reverted')) {
        return {
          success: false,
          error: "Transaction failed: Contract execution reverted. You may have already voted or the market may be closed.",
        };
      }
      
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: false,
      error: "Voting failed due to unknown error",
    };
  }
};

export const giveGas = async (address: string) => {
  try {
    const response = await fetch(`${API_ROUTE}/api/faucet/${address}`);
    const res = await response.json();
    
    if (!response.ok) {
      console.warn(`Faucet request failed: ${res.message}`);
      // Don't throw error, just log warning since this is optional
      return { success: false, message: res.message };
    }
    
    console.log("Faucet response:", res);
    return { success: true, data: res };
  } catch (error) {
    console.warn("Faucet request failed:", error);
    // Don't throw error, just log warning
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

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

// BONUS: Helper function to check if user has sufficient balance
export const checkUserBalance = async (
  userAddress: string,
  requiredAmount: string = "0.0001"
): Promise<{ hasEnough: boolean; balance: string; required: string }> => {
  try {
    // You can implement balance checking logic here
    // This is a placeholder that you can enhance based on your needs
    return {
      hasEnough: true, // Placeholder
      balance: "0", // Placeholder
      required: requiredAmount
    };
  } catch (error) {
    console.error("Error checking balance:", error);
    return {
      hasEnough: false,
      balance: "0",
      required: requiredAmount
    };
  }
};

// BONUS: Helper to format transaction errors for user display
export const formatTransactionError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'User rejected': 'You cancelled the transaction',
    'insufficient funds': 'Not enough XTZ in your wallet',
    'execution reverted': 'Transaction failed - you may have already voted',
    'network': 'Network connection problem',
    'nonce': 'Please refresh the page and try again'
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }

  return 'Transaction failed. Please try again.';
};