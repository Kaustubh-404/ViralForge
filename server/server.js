// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { Meme, GasModel } = require("./model");
// const { ethers, parseEther, Contract } = require("ethers");
// const CONTRACT = require("./FunnyOrFud.json");
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Initialize ethers.js provider and wallet
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const relayerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// // FIXED: Use correct contract address
// const contractAddress = "0x07AF95749d58d4f6288490a58AC9cae6f602b194";
// const contractABI = CONTRACT.abi;

// // Nonce management
// let currentNonce = null;
// let nonceLock = false;

// // Get and increment nonce safely
// async function getNextNonce() {
//   // Wait if another transaction is getting nonce
//   while (nonceLock) {
//     await new Promise(resolve => setTimeout(resolve, 100));
//   }
  
//   nonceLock = true;
  
//   try {
//     if (currentNonce === null) {
//       // Get current nonce from network
//       currentNonce = await provider.getTransactionCount(relayerWallet.address, "pending");
//       console.log(`Initial nonce: ${currentNonce}`);
//     } else {
//       // Increment our cached nonce
//       currentNonce++;
//       console.log(`Using cached nonce: ${currentNonce}`);
//     }
    
//     return currentNonce;
//   } finally {
//     nonceLock = false;
//   }
// }

// // Reset nonce on transaction failure
// function resetNonce() {
//   console.log("Resetting nonce cache");
//   currentNonce = null;
// }

// // Add balance check utility
// async function checkWalletBalance() {
//   try {
//     const balance = await provider.getBalance(relayerWallet.address);
//     const balanceInEth = ethers.formatEther(balance);
//     console.log(`Relayer wallet balance: ${balanceInEth} XTZ`);
    
//     if (parseFloat(balanceInEth) < 0.01) {
//       console.warn("⚠️  WARNING: Relayer wallet balance is low!");
//       console.log(`Please send some testnet XTZ to: ${relayerWallet.address}`);
//     }
    
//     return balance;
//   } catch (error) {
//     console.error("Error checking balance:", error);
//     return BigInt(0);
//   }
// }

// // Check balance and nonce on startup
// async function initializeWallet() {
//   await checkWalletBalance();
//   currentNonce = await provider.getTransactionCount(relayerWallet.address, "pending");
//   console.log(`Starting nonce: ${currentNonce}`);
// }

// // Initialize on startup
// initializeWallet();

// // Health Check
// app.get("/api/health", async (req, res) => {
//   try {
//     const balance = await checkWalletBalance();
//     const nonce = await provider.getTransactionCount(relayerWallet.address, "pending");
    
//     res.status(200).json({
//       status: "healthy",
//       wallet: relayerWallet.address,
//       balance: ethers.formatEther(balance) + " XTZ",
//       currentNonce: currentNonce,
//       networkNonce: nonce,
//       contract: contractAddress
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       status: "unhealthy", 
//       message: error.message 
//     });
//   }
// });

// // FIXED: Relay Transaction Route with proper nonce handling
// app.post("/api/relay", async (req, res) => {
//   const { userAddress, marketId, voteYes } = req.body;

//   if (!userAddress || marketId === undefined || voteYes === undefined) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   try {
//     console.log(`Processing vote: user=${userAddress}, market=${marketId}, vote=${voteYes}`);

//     // Check wallet balance first
//     const balance = await provider.getBalance(relayerWallet.address);
//     const voteCost = parseEther("0.0001");
//     const estimatedGasCost = parseEther("0.001");
    
//     if (balance < (voteCost + estimatedGasCost)) {
//       return res.status(500).json({ 
//         message: "Insufficient funds in relayer wallet",
//         required: ethers.formatEther(voteCost + estimatedGasCost) + " XTZ",
//         current: ethers.formatEther(balance) + " XTZ",
//         walletAddress: relayerWallet.address
//       });
//     }

//     // Initialize the contract instance
//     const contract = new Contract(contractAddress, contractABI, relayerWallet);

//     // Get nonce for this transaction
//     const nonce = await getNextNonce();
//     console.log(`Using nonce ${nonce} for vote transaction`);

//     // Estimate gas with error handling
//     let gasLimit;
//     try {
//       gasLimit = await contract.vote.estimateGas(
//         userAddress,
//         marketId,
//         voteYes,
//         { value: voteCost, nonce }
//       );
      
//       // Add 20% buffer to gas limit
//       gasLimit = gasLimit * BigInt(120) / BigInt(100);
//       console.log(`Estimated gas: ${gasLimit}`);
//     } catch (estimateError) {
//       console.error("Gas estimation failed:", estimateError);
//       resetNonce(); // Reset nonce on estimation failure
      
//       // Check if it's a contract revert
//       if (estimateError.reason) {
//         return res.status(400).json({ 
//           message: "Transaction would fail", 
//           reason: estimateError.reason 
//         });
//       }
      
//       // Use a default gas limit if estimation fails
//       gasLimit = BigInt(300000);
//     }

//     // Send the transaction with explicit nonce
//     const txResponse = await contract.vote(userAddress, marketId, voteYes, {
//       value: voteCost,
//       gasLimit: gasLimit,
//       nonce: nonce,
//       // Add gas price to avoid slow transactions
//       gasPrice: await provider.getFeeData().then(fees => fees.gasPrice)
//     });

//     console.log("Vote transaction sent:", txResponse.hash);

//     // Don't wait for confirmation to avoid timeouts
//     res.json({
//       message: "Vote transaction submitted successfully",
//       transactionHash: txResponse.hash,
//       nonce: nonce
//     });

//     // Wait for confirmation in background and log result
//     txResponse.wait(1).then(receipt => {
//       console.log("Vote transaction confirmed:", receipt.hash);
//     }).catch(error => {
//       console.error("Vote transaction failed:", error);
//       resetNonce(); // Reset nonce if transaction fails
//     });

//   } catch (error) {
//     console.error("Error relaying vote:", error);
//     resetNonce(); // Reset nonce on any error
    
//     // Handle specific error types
//     if (error.code === 'NONCE_EXPIRED' || error.code === 'REPLACEMENT_UNDERPRICED') {
//       return res.status(400).json({ 
//         message: "Transaction nonce issue, please try again", 
//         error: "Nonce conflict detected"
//       });
//     }
    
//     if (error.code === 'CALL_EXCEPTION') {
//       return res.status(400).json({ 
//         message: "Transaction failed", 
//         error: error.reason || "Unknown contract error",
//         details: error.info?.error?.message || error.message
//       });
//     }
    
//     if (error.code === 'INSUFFICIENT_FUNDS') {
//       return res.status(500).json({ 
//         message: "Insufficient funds in relayer wallet",
//         walletAddress: relayerWallet.address
//       });
//     }

//     res.status(500).json({ 
//       message: "Failed to relay vote", 
//       error: error.message 
//     });
//   }
// });

// // FIXED: Create Meme Route with proper nonce handling
// app.post("/api/meme", async (req, res) => {
//   const { address, cid, templateId } = req.body;

//   console.log("Creating meme:", req.body);
  
//   if (!address || !cid || templateId === undefined) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   try {
//     // Check wallet balance
//     const balance = await provider.getBalance(relayerWallet.address);
//     const estimatedGasCost = parseEther("0.001");
    
//     if (balance < estimatedGasCost) {
//       return res.status(500).json({ 
//         message: "Insufficient funds in relayer wallet",
//         current: ethers.formatEther(balance) + " XTZ",
//         walletAddress: relayerWallet.address
//       });
//     }

//     // Initialize the contract instance
//     const contract = new Contract(contractAddress, contractABI, relayerWallet);

//     // Get nonce for this transaction
//     const nonce = await getNextNonce();
//     console.log(`Using nonce ${nonce} for meme creation`);

//     // Estimate gas with error handling
//     let gasLimit;
//     try {
//       gasLimit = await contract.createMeme.estimateGas(
//         address,
//         cid,
//         templateId,
//         { nonce }
//       );
      
//       // Add 20% buffer
//       gasLimit = gasLimit * BigInt(120) / BigInt(100);
//     } catch (estimateError) {
//       console.error("Gas estimation failed:", estimateError);
//       resetNonce();
      
//       if (estimateError.reason) {
//         return res.status(400).json({ 
//           message: "Transaction would fail", 
//           reason: estimateError.reason 
//         });
//       }
      
//       gasLimit = BigInt(200000);
//     }

//     // Send the transaction with explicit nonce
//     const txResponse = await contract.createMeme(address, cid, templateId, {
//       gasLimit: gasLimit,
//       nonce: nonce,
//       gasPrice: await provider.getFeeData().then(fees => fees.gasPrice)
//     });

//     console.log("Meme creation transaction sent:", txResponse.hash);

//     // Don't wait for confirmation
//     res.json({
//       message: "Meme creation submitted successfully",
//       transactionHash: txResponse.hash,
//       nonce: nonce
//     });

//     // Confirm in background
//     txResponse.wait(1).then(receipt => {
//       console.log("Meme creation confirmed:", receipt.hash);
//     }).catch(error => {
//       console.error("Meme creation failed:", error);
//       resetNonce();
//     });

//   } catch (error) {
//     console.error("Error creating meme:", error);
//     resetNonce();
    
//     if (error.code === 'NONCE_EXPIRED' || error.code === 'REPLACEMENT_UNDERPRICED') {
//       return res.status(400).json({ 
//         message: "Transaction nonce issue, please try again", 
//         error: "Nonce conflict detected"
//       });
//     }
    
//     if (error.code === 'CALL_EXCEPTION') {
//       return res.status(400).json({ 
//         message: "Transaction failed", 
//         error: error.reason || "Unknown contract error" 
//       });
//     }
    
//     if (error.code === 'INSUFFICIENT_FUNDS') {
//       return res.status(500).json({ 
//         message: "Insufficient funds in relayer wallet",
//         walletAddress: relayerWallet.address
//       });
//     }

//     res.status(500).json({ 
//       message: "Failed to create meme", 
//       error: error.message 
//     });
//   }
// });

// // Rest of your existing routes (faucet, memes CRUD) remain the same...
// // [Include all your existing routes here]

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Relayer wallet address: ${relayerWallet.address}`);
//   console.log(`Contract address: ${contractAddress}`);
//   console.log("⚠️  Make sure this wallet has sufficient XTZ for gas fees!");
// });


// server/server.js - Updated with Auto-Settlement
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Meme, GasModel } = require("./model");
const { SettlementRecord, UserVote } = require("./models/Settlement");
const { ethers, parseEther, Contract } = require("ethers");
const CONTRACT = require("./FunnyOrFud.json");
const AutoSettlementService = require("./services/settlementService");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize ethers.js provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const relayerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = "0x07AF95749d58d4f6288490a58AC9cae6f602b194";
const contractABI = CONTRACT.abi;

// Initialize Auto-Settlement Service
const settlementService = new AutoSettlementService();
settlementService.start();

// Health Check
app.get("/api/health", async (req, res) => {
  try {
    res.status(200).json({ 
      status: "healthy", 
      settlement_service: "running",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Track user votes when they vote
app.post("/api/user-vote", async (req, res) => {
  const { userAddress, marketId, vote, transactionHash } = req.body;
  
  if (!userAddress || marketId === undefined || !vote) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Check if user already voted
    const existingVote = await UserVote.findOne({ userAddress, marketId });
    if (existingVote) {
      return res.status(400).json({ message: "User already voted on this market" });
    }

    // Save user vote
    const userVote = new UserVote({
      userAddress,
      marketId,
      vote,
      transactionHash
    });

    await userVote.save();
    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording user vote:", error);
    res.status(500).json({ message: "Failed to record vote", error: error.message });
  }
});

// Get user's voting history
app.get("/api/user-votes/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const userVotes = await UserVote.find({ userAddress: address }).sort({ votedAt: -1 });
    
    res.json(userVotes);
  } catch (error) {
    console.error("Error fetching user votes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's settlement history
app.get("/api/user-settlements/:address", async (req, res) => {
  try {
    const { address } = req.params;
    
    // Find all settlements where user participated
    const settlements = await SettlementRecord.find({
      "participants.address": address
    }).sort({ settledAt: -1 });

    // Calculate user-specific data for each settlement
    const userSettlements = settlements.map(settlement => {
      const userParticipation = settlement.participants.find(p => p.address === address);
      
      return {
        marketId: settlement.marketId,
        winnerSide: settlement.winnerSide,
        userVote: userParticipation.vote,
        userWon: userParticipation.won,
        userStake: userParticipation.staked,
        userPayout: userParticipation.payout,
        netResult: userParticipation.won ? 
          (BigInt(userParticipation.payout) - BigInt(userParticipation.staked)).toString() : 
          (-BigInt(userParticipation.staked)).toString(),
        totalVotes: settlement.totalVotes,
        yesVotes: settlement.yesVotes,
        noVotes: settlement.noVotes,
        settlementTx: settlement.settlementTx,
        settledAt: settlement.settledAt
      };
    });

    res.json(userSettlements);
  } catch (error) {
    console.error("Error fetching user settlements:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get settlement details for a specific market
app.get("/api/settlement/:marketId", async (req, res) => {
  try {
    const { marketId } = req.params;
    const settlement = await SettlementRecord.findOne({ marketId: parseInt(marketId) });
    
    if (!settlement) {
      return res.status(404).json({ message: "Settlement not found" });
    }
    
    res.json(settlement);
  } catch (error) {
    console.error("Error fetching settlement:", error);
    res.status(500).json({ message: error.message });
  }
});

// Manual settlement trigger (admin endpoint)
app.post("/api/manual-settle/:marketId", async (req, res) => {
  try {
    const { marketId } = req.params;
    
    console.log(`Manual settlement requested for market ${marketId}`);
    const success = await settlementService.manualSettle(parseInt(marketId));
    
    if (success) {
      res.json({ message: `Market ${marketId} settled successfully` });
    } else {
      res.status(400).json({ message: `Failed to settle market ${marketId}` });
    }
  } catch (error) {
    console.error("Manual settlement error:", error);
    res.status(500).json({ message: "Settlement failed", error: error.message });
  }
});

// Get settlement status for a market
app.get("/api/settlement-status/:marketId", async (req, res) => {
  try {
    const { marketId } = req.params;
    const status = await settlementService.getSettlementStatus(parseInt(marketId));
    
    res.json(status);
  } catch (error) {
    console.error("Error getting settlement status:", error);
    res.status(500).json({ message: error.message });
  }
});

// Existing Routes (keeping all the original functionality)

// Relay Transaction Route
app.post("/api/relay", async (req, res) => {
  const { userAddress, marketId, voteYes } = req.body;

  if (!userAddress || marketId === undefined || voteYes === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const contract = new Contract(contractAddress, contractABI, relayerWallet);
    const voteCost = parseEther("0.0001");

    const gasLimit = await contract.vote.estimateGas(
      userAddress,
      marketId,
      voteYes,
      { value: voteCost }
    );

    const txResponse = await contract.vote(userAddress, marketId, voteYes, {
      value: voteCost,
      gasLimit: gasLimit,
    });

    console.log("Vote transaction sent:", txResponse.hash);

    // Record the vote in database
    const userVote = new UserVote({
      userAddress,
      marketId,
      vote: voteYes ? 'funny' : 'lame',
      transactionHash: txResponse.hash
    });
    await userVote.save();

    res.json({
      message: "Vote relayed successfully",
      transactionHash: txResponse.hash
    });
  } catch (error) {
    console.error("Error relaying vote:", error);
    res.status(500).json({ message: "Failed to relay vote", error: error.message });
  }
});

app.post("/api/memes", async (req, res) => {
  try {
    const meme = new Meme(req.body);
    await meme.save();
    res.status(201).json(meme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/meme", async (req, res) => {
  const { address, cid, templateId } = req.body;

  if (!address || cid === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const contract = new Contract(contractAddress, contractABI, relayerWallet);

    const gasLimit = await contract.createMeme.estimateGas(
      address,
      cid,
      templateId
    );

    const txResponse = await contract.createMeme(address, cid, templateId, {
      gasLimit: gasLimit,
    });

    console.log("Meme creation transaction sent:", txResponse.hash);

    res.json({
      message: "Meme created successfully",
      transactionHash: txResponse.hash
    });
  } catch (error) {
    console.error("Error creating meme:", error);
    res.status(500).json({ message: "Failed to create meme", error: error.message });
  }
});

app.get("/api/memes", async (req, res) => {
  try {
    const memes = await Meme.find().sort({ createdAt: -1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/memes/:templateId", async (req, res) => {
  try {
    const { templateId } = req.params;
    const memes = await Meme.find({ memeTemplate: templateId });

    if (memes.length === 0) {
      return res.status(404).json({ message: "No memes found for this template" });
    }

    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/faucet/:address", async (req, res) => {
  try {
    const gas = await GasModel.findOne({ address: req.params.address });

    if (!gas) {
      const tx = await relayerWallet.sendTransaction({
        to: req.params.address,
        value: parseEther("0.1"),
      });

      await tx.wait();

      const sentGas = new GasModel({
        address: req.params.address,
      });

      await sentGas.save();
      return res.status(200).json({ message: "Sent tokens" });
    }

    res.status(200).json({ message: "Already given some testnet tokens" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⚡ Auto-Settlement Service active`);
  console.log(`🔗 Contract: ${contractAddress}`);
});