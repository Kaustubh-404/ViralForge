// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Meme, GasModel } = require("./model");
const { ethers, parseEther, Contract } = require("ethers");
const CONTRACT = require("./FunnyOrFud.json");
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
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Add your RPC URL to .env
const relayerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Add your private key to .env

const contractAddress = "0x8ed88f91D19fBE8bEfBB07Eb7625AcA694A780C0";
const contractABI = CONTRACT.abi;

// Create - GET Health Check
app.get("/api/health", async (req, res) => {
  try {
    res.status(201).json("Healthy");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Relay Transaction Route
app.post("/api/relay", async (req, res) => {
  const { userAddress, marketId, voteYes } = req.body;

  if (!userAddress || marketId === undefined || voteYes === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Initialize the contract instance
    const contract = new Contract(contractAddress, contractABI, relayerWallet);

    // Estimate the gas required for the transaction
    const voteCost = parseEther("0.0001"); // Replace with actual voteCost from your contract

    const gasLimit = await contract.vote.estimateGas(
      userAddress,
      marketId,
      voteYes,
      {
        value: voteCost,
      }
    );

    // Send the transaction
    const txResponse = await contract.vote(userAddress, marketId, voteYes, {
      value: voteCost,
      gasLimit: gasLimit,
    });

    console.log("Transaction sent:", txResponse.hash);

    // /
    res.json({
      message: "Vote relayed successfully",
    });
  } catch (error) {
    console.error("Error relaying vote:", error);
    res
      .status(500)
      .json({ message: "Failed to relay vote", error: error.message });
  }
});

// Existing Routes
app.post("/api/memes", async (req, res) => {
  try {
    console.log("Fetching memes");

    const meme = new Meme(req.body);
    await meme.save();
    res.status(201).json(meme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/meme", async (req, res) => {
  const { address, cid, templateId } = req.body;

  console.log(req.body);
  
  if (!address || cid === undefined) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Initialize the contract instance
    const contract = new Contract(contractAddress, contractABI, relayerWallet);

    const gasLimit = await contract.createMeme.estimateGas(
      address,
      cid,
      templateId
    );

    // Send the transaction
    const txResponse = await contract.createMeme(address, cid, templateId, {
      gasLimit: gasLimit,
    });

    console.log("Transaction sent:", txResponse.hash);

    // /
    res.json({
      message: "Meme created successfully",
    });
  } catch (error) {
    console.error("Error relaying:", error);
    res
      .status(500)
      .json({ message: "Failed to relay", error: error.message });
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
      return res
        .status(404)
        .json({ message: "No memes found for this template" });
    }

    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/memes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }
    res.json(meme);
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
        value: parseEther("0.1"), // Sends 0.1 test ETH
      });

      await tx.wait();

      console.log("Transaction sent:", tx);

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

app.put("/api/memes/:id", async (req, res) => {
  try {
    const meme = await Meme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }
    res.json(meme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/memes/:id", async (req, res) => {
  try {
    const meme = await Meme.findByIdAndDelete(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }
    res.json({ message: "Meme deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
